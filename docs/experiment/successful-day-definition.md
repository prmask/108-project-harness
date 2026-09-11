# Successful Day — Definition (Versioned)

This document is the authoritative, versioned record of the experiment's
"successful day" scoring rule.

Per `AGENTS.md` §8 (Experiment Integrity) and §9 (Protocol Amendments), the
successful-day definition may not be silently modified once the experiment
has begun, and historical days must continue to be scored under the
definition that was in effect on the day they occurred. Later amendments
must never be applied retroactively.

The 13 protocol items referenced below are defined in `AGENTS.md` §15
(Daily Protocol) and are not duplicated here to avoid drift between two
sources of truth.

## Definition v1

- **Effective:** Day 1 – Day 46
- **Rule:** A day is successful only if all 13 of 13 protocol items are completed.
- **Status:** Superseded by v2. Applies to historical days 1–46 only and must
  never be recalculated under a later definition.

## Definition v2

- **Effective:** Day 47 (2026-09-06) only — superseded the same day, before
  being applied to score any day.
- **Rule:** A day is successful if at least 10 of the 13 protocol items are completed.
- **Status:** Superseded by v3. Never used to score any day.

## Definition v3

- **Effective:** Day 47 – present
- **Rule:** A day is successful if at least 8 of the 13 protocol items are completed.
- **Status:** Current.

## Amendment Record #1

| Field | Value |
|---|---|
| Amendment date | 2026-09-06 (Day 47) |
| Requested by | User |
| Change | Successful-day threshold changed from "all 13 of 13 protocol items" to "at least 10 of 13 protocol items" |
| Reason | Not specified by the user at the time of the amendment |
| Effect on comparability | Days scored under v1 (13/13) are not directly comparable to days scored under v2 (≥10/13) without accounting for the change in threshold. Adherence and streak statistics that span the Day 46 / Day 47 boundary must be presented with the definition boundary clearly marked, not silently blended. |
| Historical recalculation | None performed. Days 1–46 remain scored under v1 and must never be recalculated under v2. |
| Previous definition preserved | Yes — see Definition v1 above. |

## Amendment Record #2

| Field | Value |
|---|---|
| Amendment date | 2026-09-06 (Day 47, same day as Amendment #1) |
| Requested by | User |
| Change | Successful-day threshold changed from "at least 10 of 13 protocol items" (v2) to "at least 8 of 13 protocol items" (v3) |
| Reason | User changed their mind; no further reason specified |
| Effect on comparability | v2 was never used to score any day, so it introduces no additional comparability gap. Days 1–46 remain scored under v1 (13/13); Day 47 onward is scored under v3 (≥8/13). Adherence and streak statistics spanning the Day 46 / Day 47 boundary must still be presented with the v1 → v3 definition boundary clearly marked, not silently blended. |
| Historical recalculation | None performed. Days 1–46 remain scored under v1 and must never be recalculated under v2 or v3. |
| Previous definitions preserved | Yes — see Definition v1 and Definition v2 above. |

## Implementation Requirements

Once daily-scoring logic is implemented, it must:

1. Look up which definition version was in effect for the date being scored,
   using the version's effective date range above rather than a single
   global constant.
2. Apply v1 (13/13) to Day 1 – Day 46.
3. Apply v3 (≥8/13) to Day 47 onward. (v2, ≥10/13, was superseded before it
   was ever applied to score a day and must not be used.)
4. Never silently recompute a historical day under a later definition.
5. Label any cross-version comparison (e.g., streaks or cumulative adherence
   spanning the Day 46/47 boundary) as spanning a definition change, per
   AGENTS.md §9 and §29 (No Fabricated Success).
6. Be covered by automated tests asserting all versions score correctly
   and that no historical recalculation occurs (AGENTS.md §19).

Future amendments to this rule must be appended as a new "Definition vN"
section and a new numbered Amendment Record below Amendment Record #1 —
never by editing the entries above in place.
