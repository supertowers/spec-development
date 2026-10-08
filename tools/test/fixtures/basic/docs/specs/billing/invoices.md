---
id: INV
title: Invoices
status: implemented
version: 1.1.0
covers:
  - src/invoices/**
retired: [INV-REQ-3]
---

# Invoices

## Requirements

1. **INV-REQ-1**: Create invoice
   - The system MUST create an invoice from a list of line items.
2. **INV-REQ-2**: List invoices
   - The system MUST list invoices newest first.

## Acceptance Criteria

- **INV-AC-1**: Creating an invoice with two items returns a total equal to their sum.
- **INV-AC-2**: Listing returns the most recent invoice first.
