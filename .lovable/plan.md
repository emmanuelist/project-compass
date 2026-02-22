

# Expand Demo Dataset

## Overview
Expand the current 3-transaction demo graph into a richer 8-transaction graph with branching paths, multiple addresses, and consolidation patterns to better showcase the visualization.

## New Graph Structure

The expanded graph adds 5 new transactions and 3 new addresses, creating branches and a consolidation:

```text
                          +-> Tx C (Alice -> Dave, Alice change) -> Tx F (Dave -> Mixer)
                         /
Coinbase -> Tx A (split) 
                         \
                          +-> Tx B (Bob -> Exchange, Bob change) -> Tx E (Bob consolidates with Carol)
                                                                        ^
                              Tx D (standalone: Carol funding) ----------+
```

- **Tx C**: Alice splits her funds (sends to Dave, keeps change)
- **Tx D**: Independent transaction from Carol (second root/source)
- **Tx E**: Bob and Carol consolidate into one output (multi-input tx)
- **Tx F**: Dave sends to a mixer address
- **Tx G**: Exchange internal transfer (from exchange output of Tx B)

## Changes

### `src/lib/mock-data.ts` -- Single file modified

**New txids** added to `DEMO_TXIDS`:
- `txC`, `txD`, `txE`, `txF`, `txG`

**New addresses** added to `DEMO_ADDRESSES`:
- `dave`, `carol`, `mixer`

**New transactions** added to `DEMO_TRANSACTIONS`:
- **Tx C**: Alice (from Tx A output 0) sends 2.0 to Dave, 1.49 change back to Alice
- **Tx D**: Independent coinbase-like source -- Carol receives 1.5 BTC (separate funding tx with a generic input)
- **Tx E**: Consolidation -- Bob (Tx B change, 0.23) + Carol (Tx D, 1.5) merge into 1.72 BTC to a new Bob address
- **Tx F**: Dave (from Tx C) sends 1.8 to mixer, 0.19 change
- **Tx G**: Exchange internal -- uses Tx B exchange output (2.5) to send 2.49 to another exchange address

**Updated `spent_by`** links on existing outputs:
- Tx A output 0 (Alice, 3.5) gets `spent_by: txC`
- Tx B output 0 (Exchange, 2.5) gets `spent_by: txG`
- Tx B output 1 (Bob, 0.23) gets `spent_by: txE`

**New graph nodes** (5 added, total 8):
- Tx C (blue, no label), Tx D (gray, coinbase-like), Tx E (green, has label), Tx F (blue, no label), Tx G (green, has label)

**New graph edges** (5 added, total 7):
- Tx A -> Tx C (3.5 BTC)
- Tx B -> Tx E (0.23 BTC)
- Tx D -> Tx E (1.5 BTC) -- consolidation input
- Tx C -> Tx F (2.0 BTC)
- Tx B -> Tx G (2.5 BTC)

**New labels** (3 added, total 5):
- Tx D: "Carol's funding" 
- Tx E: "Consolidation"
- Tx G: "Exchange internal"

## Technical Details

**Files modified:** `src/lib/mock-data.ts` only

No other files need changes -- the demo mode context and all consuming components already work with any number of transactions/nodes/edges.

**Graph characteristics after expansion:**
- 8 nodes, 7 edges
- Branching: Tx A fans out to both Tx B and Tx C
- Consolidation: Tx E has 2 inputs from different sources
- Multiple roots: Coinbase and Tx D are both source nodes
- Mix of labeled (5) and unlabeled (3) nodes for visual variety
- Realistic fee deductions on each transaction

