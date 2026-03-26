// ============================================================
//  utils/id.ts  –  Tiny ID generator. Swap for crypto.randomUUID
//  if you need RFC-compliant UUIDs (available in modern browsers).
// ============================================================

export function generateId(): string {
  return crypto.randomUUID();
}
