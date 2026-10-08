/** @spec INV-REQ-1 */
export function createInvoice(items: number[]) {
  return items.reduce((a, b) => a + b, 0);
}

// Kept for INV-REQ-3 compatibility.
export function voidInvoice() {
  return null;
}
