#!/usr/bin/env node
// spec-check — deterministic bidirectional traceability checker.
//
// Verifies that every piece of shipped behavior is backed by an approved spec
// and that every approved requirement has code and tests behind it.
// Zero dependencies. Node >= 18.
//
// Usage:
//   node spec-check.mjs [--root <dir>] [--config <file>] [--json]
//                       [--matrix <out.md>] [--update-baseline] [--allow-grow]
//
// See process/TRACEABILITY.md for the protocol this tool enforces.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// ─── Constants ──────────────────────────────────────────────────────────────

const ID_RE = /\b([A-Z][A-Z0-9]{1,15})-(REQ|NFR|AC)-(\d+)\b/g;
const BARE_ID_RE = /(?<![A-Za-z0-9_-])(REQ|NFR|AC)-\d+\b/g;
const DEFINITION_RE = /\*\*([A-Z][A-Z0-9]{1,15})-(REQ|NFR|AC)-(\d+)\*\*/g;
const SPEC_KEY_RE = /^[A-Z][A-Z0-9]{1,15}$/;
const STATUSES = ['draft', 'approved', 'implemented', 'deprecated'];
const AUXILIARY_MARKDOWN = new Set(['README.md', 'ux.md', 'notes.md']);

const CHECKS = {
  E001: 'Invalid spec frontmatter',
  E002: 'Duplicate spec key',
  E003: 'Requirement ID defined more than once',
  E004: 'Requirement ID prefix does not match its spec key',
  E005: 'Reference to an ID that is not defined in any spec',
  E006: 'Reference to a retired ID',
  E007: 'Code or test references a spec that is still draft',
  E008: 'Source file not covered by any spec (orphan code)',
  E009: 'Public surface item without an @spec annotation',
  E010: 'Acceptance criterion of an implemented spec has no test',
  E011: 'Requirement of an implemented spec has no code reference',
  E012: 'Unscoped requirement ID (use KEY-REQ-N)',
  W101: 'Markdown file in the specs directory is not a spec',
  W102: 'Code references a deprecated spec',
  W103: 'A covers glob matches no file',
};

// ─── CLI ────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { root: process.cwd(), config: null, json: false, matrix: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--root') args.root = path.resolve(argv[++i]);
    else if (a === '--config') args.config = path.resolve(argv[++i]);
    else if (a === '--json') args.json = true;
    else if (a === '--matrix') args.matrix = path.resolve(argv[++i]);
    else if (a === '--update-baseline') args.updateBaseline = true;
    else if (a === '--allow-grow') args.allowGrow = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  args.config ??= path.join(args.root, 'spec-check.config.json');
  return args;
}

// ─── Glob matching ──────────────────────────────────────────────────────────

const globCache = new Map();

/** Convert a glob (supports **, *, ?, {a,b}) into an anchored RegExp. */
export function globToRegExp(glob) {
  if (globCache.has(glob)) return globCache.get(glob);
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        const slashAfter = glob[i + 2] === '/';
        re += slashAfter ? '(?:.*/)?' : '.*';
        i += slashAfter ? 2 : 1;
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') re += '[^/]';
    else if (c === '{') {
      const end = glob.indexOf('}', i);
      if (end === -1) throw new Error(`Unclosed brace in glob: ${glob}`);
      const alts = glob.slice(i + 1, end).split(',').map((s) => s.replace(/[.+^$()|[\]\\]/g, '\\$&'));
      re += `(?:${alts.join('|')})`;
      i = end;
    } else re += c.replace(/[.+^$()|[\]\\]/g, '\\$&');
  }
  const compiled = new RegExp(`^${re}$`);
  globCache.set(glob, compiled);
  return compiled;
}

const matchesAny = (file, globs = []) => globs.some((g) => globToRegExp(g).test(file));

// ─── File system ────────────────────────────────────────────────────────────

function listFiles(root) {
  try {
    const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split('\n').filter(Boolean).filter((f) => fs.existsSync(path.join(root, f)));
  } catch {
    return walk(root, '');
  }
}

function walk(root, rel) {
  const skip = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage']);
  const files = [];
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const child = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...walk(root, child));
    else files.push(child);
  }
  return files;
}

const readCache = new Map();
function read(root, file) {
  if (!readCache.has(file)) readCache.set(file, fs.readFileSync(path.join(root, file), 'utf8'));
  return readCache.get(file);
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// ─── Frontmatter ────────────────────────────────────────────────────────────

/**
 * Parse the restricted YAML subset used by spec frontmatter:
 * `key: scalar`, `key: [a, b]`, and block lists (`key:` followed by `- item`).
 */
export function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) return null;
  const end = text.indexOf('\n---', 4);
  if (end === -1) return null;
  const data = {};
  let listKey = null;
  for (const raw of text.slice(4, end).split('\n')) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim()) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) throw new Error(`Unparseable frontmatter line: "${raw}"`);
    const [, key, value] = kv;
    if (value === '') {
      data[key] = [];
      listKey = key;
    } else if (value.startsWith('[')) {
      data[key] = value.replace(/^\[|\]$/g, '').split(',').map((s) => unquote(s.trim())).filter(Boolean);
      listKey = null;
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }
  return data;
}

const unquote = (s) => s.replace(/^(['"])(.*)\1$/, '$2');

// ─── Spec loading ───────────────────────────────────────────────────────────

function loadSpecs(root, files, config, report) {
  const specsDir = config.specs.replace(/\/$/, '');
  const specs = new Map();
  const definitions = new Map();
  const retired = new Map();

  const markdown = files.filter(
    (f) => f.startsWith(`${specsDir}/`) && f.endsWith('.md') && !/(^|\/)_/.test(f.slice(specsDir.length + 1)),
  );

  for (const file of markdown) {
    const text = read(root, file);
    let fm;
    try {
      fm = parseFrontmatter(text);
    } catch (err) {
      report('E001', file, err.message);
      continue;
    }
    if (!fm) {
      if (!AUXILIARY_MARKDOWN.has(path.basename(file))) report('W101', file, 'no frontmatter');
      continue;
    }

    const problems = [];
    if (!fm.id || !SPEC_KEY_RE.test(fm.id)) problems.push(`id must match ${SPEC_KEY_RE}`);
    if (!fm.title) problems.push('title is required');
    if (!STATUSES.includes(fm.status)) problems.push(`status must be one of ${STATUSES.join(', ')}`);
    if (fm.status !== 'draft' && (!Array.isArray(fm.covers) || fm.covers.length === 0))
      problems.push('covers is required once a spec leaves draft');
    if (problems.length) {
      report('E001', file, problems.join('; '));
      if (!fm.id || !SPEC_KEY_RE.test(fm.id)) continue;
    }
    if (specs.has(fm.id)) {
      report('E002', file, `${fm.id} already declared in ${specs.get(fm.id).file}`);
      continue;
    }

    const spec = {
      key: fm.id,
      file,
      title: fm.title,
      status: fm.status,
      covers: Array.isArray(fm.covers) ? fm.covers : [],
      retired: Array.isArray(fm.retired) ? fm.retired : [],
      ids: [],
    };
    specs.set(spec.key, spec);
    for (const id of spec.retired) retired.set(id, spec);

    for (const m of text.matchAll(DEFINITION_RE)) {
      const id = `${m[1]}-${m[2]}-${m[3]}`;
      const where = `${file}:${lineOf(text, m.index)}`;
      if (m[1] !== spec.key) {
        report('E004', where, `${id} is defined in spec ${spec.key}`, id);
        continue;
      }
      if (definitions.has(id)) {
        if (definitions.get(id).file !== file) report('E003', where, `${id} also defined in ${definitions.get(id).file}`, id);
        continue;
      }
      if (spec.retired.includes(id)) {
        report('E003', where, `${id} is both defined and retired`, id);
        continue;
      }
      const def = { id, kind: m[2], spec, file, line: lineOf(text, m.index), refs: { source: [], test: [] } };
      definitions.set(id, def);
      spec.ids.push(def);
    }
  }
  return { specs, definitions, retired };
}

// ─── Main check ─────────────────────────────────────────────────────────────

export function runCheck(root, config) {
  const findings = [];
  const report = (code, where, detail, key = '') =>
    findings.push({ code, where, detail, key: [code, where.replace(/:\d+$/, ''), key || detail].join('|') });

  const files = listFiles(root).filter((f) => !matchesAny(f, config.exclude));
  const { specs, definitions, retired } = loadSpecs(root, files, config, report);

  const sources = files.filter((f) => matchesAny(f, config.sources) && !matchesAny(f, config.tests));
  const tests = files.filter((f) => matchesAny(f, config.tests));
  const specsDir = config.specs.replace(/\/$/, '');
  const specMarkdown = files.filter((f) => f.startsWith(`${specsDir}/`) && f.endsWith('.md'));

  // References: any full ID token in code, tests, or other specs.
  const scan = (file, kind) => {
    const text = read(root, file);
    for (const m of text.matchAll(ID_RE)) {
      const id = m[0];
      const where = `${file}:${lineOf(text, m.index)}`;
      const def = definitions.get(id);
      if (def) {
        if (kind !== 'spec') def.refs[kind].push(where);
        if (kind !== 'spec' && def.spec.status === 'draft') report('E007', where, `${id} belongs to draft spec ${def.spec.key}`, id);
        if (kind === 'source' && def.spec.status === 'deprecated') report('W102', where, `${id} belongs to deprecated spec ${def.spec.key}`, id);
      } else if (retired.has(id)) {
        // Specs may legitimately mention retired IDs (frontmatter, changelog).
        if (kind === 'spec') continue;
        report('E006', where, `${id} was retired from ${retired.get(id).key}`, id);
      } else if (kind !== 'spec' || specs.has(m[1])) {
        // In spec prose, only flag tokens whose prefix is a known spec key.
        report('E005', where, id, id);
      }
    }
  };
  // Bare IDs such as `REQ-7` are ambiguous once more than one spec exists.
  for (const f of [...sources, ...tests]) {
    const text = read(root, f);
    for (const m of text.matchAll(BARE_ID_RE)) report('E012', `${f}:${lineOf(text, m.index)}`, m[0], m[0]);
  }

  for (const f of sources) scan(f, 'source');
  for (const f of tests) scan(f, 'test');
  for (const f of specMarkdown) scan(f, 'spec');

  // Coverage: every source file must be claimed by a non-draft spec or exempted.
  const claimed = [...specs.values()].filter((s) => s.status !== 'draft');
  for (const spec of claimed) {
    for (const glob of spec.covers) {
      if (!files.some((f) => globToRegExp(glob).test(f))) report('W103', spec.file, `covers "${glob}" matches nothing`, glob);
    }
  }
  const exemptGlobs = (config.exempt ?? []).map((e) => e.path);
  for (const file of sources) {
    if (matchesAny(file, exemptGlobs)) continue;
    if (!claimed.some((s) => matchesAny(file, s.covers))) report('E008', file, 'no spec covers this file');
  }

  // Surface: every public entry point must carry an @spec annotation nearby.
  for (const surface of config.surfaces ?? []) {
    const re = new RegExp(surface.pattern, 'gm');
    const window = surface.window ?? 10;
    for (const file of sources.filter((f) => matchesAny(f, surface.files))) {
      const text = read(root, file);
      const lines = text.split('\n');
      for (const m of text.matchAll(re)) {
        const line = lineOf(text, m.index);
        const context = lines.slice(Math.max(0, line - 1 - window), line).join('\n');
        const label = m[1] ?? m[0].trim().slice(0, 60);
        if (!/@spec\s+[A-Z][A-Z0-9]{1,15}-(REQ|NFR)-\d+/.test(context))
          report('E009', `${file}:${line}`, `${surface.name} "${label}"`, `${surface.name}:${label}`);
      }
    }
  }

  // Forward direction: implemented specs must be fully realized.
  for (const def of definitions.values()) {
    if (def.spec.status !== 'implemented') continue;
    if (def.kind === 'AC' && def.refs.test.length === 0) report('E010', `${def.file}:${def.line}`, def.id, def.id);
    if (def.kind === 'REQ' && def.refs.source.length === 0) report('E011', `${def.file}:${def.line}`, def.id, def.id);
  }

  findings.sort((a, b) => a.code.localeCompare(b.code) || a.where.localeCompare(b.where));
  return {
    findings,
    specs,
    definitions,
    stats: { files: files.length, sources: sources.length, tests: tests.length, specs: specs.size, ids: definitions.size },
  };
}

// ─── Baseline (ratchet) ─────────────────────────────────────────────────────

function applyBaseline(findings, baseline) {
  const known = new Set(baseline);
  const current = new Set(findings.map((f) => f.key));
  return {
    fresh: findings.filter((f) => f.code.startsWith('E') && !known.has(f.key)),
    fixed: baseline.filter((k) => !current.has(k)),
  };
}

// ─── Traceability matrix ────────────────────────────────────────────────────

function renderMatrix(result) {
  const out = ['# Traceability Matrix', '', '<!-- Generated by spec-check. Do not edit. -->', ''];
  for (const spec of [...result.specs.values()].sort((a, b) => a.key.localeCompare(b.key))) {
    out.push(`## ${spec.key} — ${spec.title}`, '', `Status: \`${spec.status}\` · Spec: \`${spec.file}\``, '');
    out.push('| ID | Code references | Test references |', '|---|---|---|');
    for (const def of spec.ids) {
      const fmt = (refs) => (refs.length ? refs.map((r) => `\`${r}\``).join('<br>') : '—');
      out.push(`| ${def.id} | ${fmt(def.refs.source)} | ${fmt(def.refs.test)} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

// ─── Entry point ────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 11).join('\n'));
    return 0;
  }
  if (!fs.existsSync(args.config)) {
    console.error(`spec-check: config not found at ${args.config}`);
    return 2;
  }
  const config = JSON.parse(fs.readFileSync(args.config, 'utf8'));
  for (const key of ['specs', 'sources', 'tests']) {
    if (!config[key]) {
      console.error(`spec-check: config is missing "${key}"`);
      return 2;
    }
  }

  const result = runCheck(args.root, config);
  const baselinePath = config.baseline ? path.join(args.root, config.baseline) : null;
  const baseline = baselinePath && fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : [];
  const { fresh, fixed } = applyBaseline(result.findings, baseline);

  if (args.matrix) fs.writeFileSync(args.matrix, renderMatrix(result));

  if (args.updateBaseline) {
    if (!baselinePath) {
      console.error('spec-check: set "baseline" in the config to use --update-baseline');
      return 2;
    }
    if (fresh.length && !args.allowGrow) {
      console.error(`spec-check: refusing to add ${fresh.length} new violations to the baseline. Fix them, or pass --allow-grow with a written justification in the commit.`);
      return 1;
    }
    const keys = [...new Set(result.findings.filter((f) => f.code.startsWith('E')).map((f) => f.key))].sort();
    fs.writeFileSync(baselinePath, `${JSON.stringify(keys, null, 2)}\n`);
    console.log(`spec-check: baseline now holds ${keys.length} known violations (was ${baseline.length}).`);
    return 0;
  }

  if (args.json) {
    console.log(JSON.stringify({ stats: result.stats, findings: result.findings, new: fresh.map((f) => f.key), fixed }, null, 2));
    return fresh.length ? 1 : 0;
  }

  const byCode = Map.groupBy
    ? Map.groupBy(result.findings, (f) => f.code)
    : result.findings.reduce((m, f) => m.set(f.code, [...(m.get(f.code) ?? []), f]), new Map());
  const freshKeys = new Set(fresh.map((f) => f.key));
  for (const [code, items] of byCode) {
    console.log(`\n${code} ${CHECKS[code]} (${items.length})`);
    for (const f of items) console.log(`  ${freshKeys.has(f.key) ? '✗' : f.code.startsWith('W') ? '!' : '·'} ${f.where}  ${f.detail}`);
  }
  const { stats } = result;
  console.log(`\nScanned ${stats.sources} source files, ${stats.tests} test files, ${stats.specs} specs, ${stats.ids} requirement IDs.`);
  if (baseline.length) console.log(`Baseline: ${baseline.length} known violations, ${fixed.length} now fixed.`);
  if (fixed.length) console.log('Run with --update-baseline to lock in the improvement.');
  console.log(fresh.length ? `\n✗ ${fresh.length} new violation(s).` : '\n✓ No new violations.');
  return fresh.length ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('spec-check.mjs')) {
  try {
    process.exitCode = main();
  } catch (err) {
    console.error(`spec-check: ${err.message}`);
    process.exitCode = 2;
  }
}
