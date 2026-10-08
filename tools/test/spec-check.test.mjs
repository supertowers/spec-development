// Tests for spec-check. Run with: node --test tools/test/
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { globToRegExp, parseFrontmatter, runCheck } from '../spec-check.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(here, 'fixtures/basic');
const cli = path.join(here, '../spec-check.mjs');
const config = JSON.parse(fs.readFileSync(path.join(fixture, 'spec-check.config.json'), 'utf8'));
const { findings } = runCheck(fixture, config);
const has = (code, where, detail = '') =>
  findings.some((f) => f.code === code && f.where.startsWith(where) && f.detail.includes(detail));

test('globs: ** spans directories, * stays within one', () => {
  assert.ok(globToRegExp('src/**/*.ts').test('src/a/b/c.ts'));
  assert.ok(globToRegExp('src/**/*.ts').test('src/c.ts'));
  assert.ok(!globToRegExp('src/*.ts').test('src/a/c.ts'));
  assert.ok(globToRegExp('apps/*/src/**').test('apps/x/src/y/z.ts'));
  assert.ok(globToRegExp('src/{a,b}.ts').test('src/b.ts'));
});

test('frontmatter: scalars, inline lists and block lists', () => {
  const fm = parseFrontmatter('---\nid: X\nretired: [X-REQ-1, X-REQ-2]\ncovers:\n  - a/**\n  - "b/*.ts"\n---\nbody');
  assert.deepEqual(fm, { id: 'X', retired: ['X-REQ-1', 'X-REQ-2'], covers: ['a/**', 'b/*.ts'] });
  assert.equal(parseFrontmatter('# no frontmatter'), null);
});

test('E005 flags references to undefined IDs in tests and spec prose', () => {
  assert.ok(has('E005', 'test/invoices.test.ts', 'INV-AC-9'));
  assert.ok(has('E005', 'docs/specs/auth.md', 'INV-REQ-99'));
});

test('E006 flags code that still references a retired requirement', () => {
  assert.ok(has('E006', 'src/invoices/create.ts', 'INV-REQ-3'));
  assert.ok(!has('E006', 'docs/specs/billing/invoices.md'), 'the spec itself may list retired IDs');
});

test('E007 flags code built against a draft spec', () => {
  assert.ok(has('E007', 'src/secret-feature.ts', 'AUTH-REQ-1'));
});

test('E008 flags orphan code and honours exemptions', () => {
  assert.ok(has('E008', 'src/secret-feature.ts'));
  assert.ok(!has('E008', 'src/index.ts'));
  assert.ok(!has('E008', 'src/invoices/'));
});

test('E009 flags public surface without an @spec annotation', () => {
  assert.ok(has('E009', 'src/invoices/create.ts:7', 'voidInvoice'));
  assert.ok(!has('E009', 'src/invoices/create.ts:2'));
});

test('E010 and E011 enforce the forward direction for implemented specs', () => {
  assert.ok(has('E010', 'docs/specs/billing/invoices.md', 'INV-AC-2'));
  assert.ok(!has('E010', 'docs/specs/billing/invoices.md', 'INV-AC-1'));
  assert.ok(has('E011', 'docs/specs/billing/invoices.md', 'INV-REQ-2'));
  assert.ok(!has('E011', 'docs/specs/billing/invoices.md', 'INV-REQ-1'));
});

test('E012 flags unscoped legacy IDs but not scoped ones', () => {
  assert.ok(has('E012', 'src/invoices/list.ts', 'REQ-2'));
  assert.ok(!has('E012', 'src/invoices/create.ts'));
});

test('W101 warns about free-form markdown in the specs directory', () => {
  assert.ok(has('W101', 'docs/specs/legacy-notes.md'));
});

test('baseline ratchet: accepts known debt, rejects growth, reports fixes', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-check-'));
  fs.cpSync(fixture, tmp, { recursive: true });
  const run = (...args) => {
    try {
      return { code: 0, out: execFileSync('node', [cli, '--root', tmp, ...args], { encoding: 'utf8', stdio: 'pipe' }) };
    } catch (err) {
      return { code: err.status, out: err.stdout + err.stderr };
    }
  };
  assert.equal(run().code, 1);
  assert.equal(run('--update-baseline').code, 1, 'must refuse to grow an empty baseline');
  assert.equal(run('--update-baseline', '--allow-grow').code, 0);
  assert.equal(run().code, 0, 'known violations no longer fail');

  fs.writeFileSync(path.join(tmp, 'src/another-orphan.ts'), 'export const x = 1;\n');
  const grown = run();
  assert.equal(grown.code, 1, 'a new violation fails even with a baseline');
  assert.match(grown.out, /another-orphan/);

  fs.rmSync(path.join(tmp, 'src/another-orphan.ts'));
  fs.rmSync(path.join(tmp, 'src/secret-feature.ts'));
  const fixed = run();
  assert.equal(fixed.code, 0);
  assert.match(fixed.out, /now fixed/);
  fs.rmSync(tmp, { recursive: true });
});
