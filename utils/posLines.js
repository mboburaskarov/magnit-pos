// Helpers for reasoning about a POS cart line.

// A weight/loose line has no DataMatrix printed on it — you cannot scan a code
// off a banana — so it is exempt when marking is required globally. A product
// genuinely flagged is_marking still prompts, exactly as it did before.
//
// unit_per_pack === 1000 is this codebase's weight convention (the backend
// reports `(p.unit_per_pack = 1000) AS is_weight` for scale groups, and the
// catalog bears it out: 118,137 products sit at 1, 2,408 at 1000, and fewer
// than 60 anywhere else). It is a heuristic: a genuine 1000-piece pack would be
// exempted, and a loose good configured at 500 would not.
export function isLooseWeightLine(item) {
  return Number(item?.unit_per_pack) === 1000
}

// How many fiscal slots a line occupies: one per whole pack, plus one for any
// remainder. getReadyDataForOFD emits exactly one receipt line per slot, so
// this is also how many marking codes a line can carry.
export function markingSlotCount(item) {
  const packs = Number(item?.quantity || 0)
  const remainder = Number(item?.unit_quantity || 0) > 0 ? 1 : 0
  return Math.max(0, packs) + remainder
}

// A scanned value only looks like a DataMatrix if it is long and carries a
// serial application identifier. This is NOT the "does this code belong to this
// product" check — it only rejects a plain product barcode or a stray keystroke
// burst that landed in the marking prompt, which would otherwise be stored as
// this line's marking and printed on the fiscal receipt.
export function hasMarkingShape(value) {
  const v = String(value || '').trim()
  return v.length >= 16 && /\(?21\)?/.test(v)
}
