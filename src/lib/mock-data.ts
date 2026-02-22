import type { Transaction, BIP329Label, CytoscapeGraph } from "@/types";

// Fake but realistic-looking 64-char hex txids
export const DEMO_TXIDS = {
  coinbase: "000000a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
  txA: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
  txB: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
} as const;

const DEMO_ADDRESSES = {
  miner: "bc1qminerxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  alice: "bc1qalicexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  bob: "bc1qbobxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  exchange: "bc1qexchangexxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
};

export const DEMO_TRANSACTIONS: Record<string, Transaction> = {
  [DEMO_TXIDS.coinbase]: {
    txid: DEMO_TXIDS.coinbase,
    confirmations: 52000,
    total_value: 6.25,
    timestamp: 1700000000,
    is_coinbase: true,
    inputs: [{ txid: "0".repeat(64), vout: 0 }],
    outputs: [
      { n: 0, address: DEMO_ADDRESSES.miner, value: 6.25 },
    ],
  },
  [DEMO_TXIDS.txA]: {
    txid: DEMO_TXIDS.txA,
    confirmations: 51990,
    total_value: 6.24,
    timestamp: 1700003600,
    is_coinbase: false,
    inputs: [
      { txid: DEMO_TXIDS.coinbase, vout: 0, address: DEMO_ADDRESSES.miner, value: 6.25 },
    ],
    outputs: [
      { n: 0, address: DEMO_ADDRESSES.alice, value: 3.5 },
      { n: 1, address: DEMO_ADDRESSES.bob, value: 2.74, spent_by: DEMO_TXIDS.txB },
    ],
  },
  [DEMO_TXIDS.txB]: {
    txid: DEMO_TXIDS.txB,
    confirmations: 51980,
    total_value: 2.73,
    timestamp: 1700007200,
    is_coinbase: false,
    inputs: [
      { txid: DEMO_TXIDS.txA, vout: 1, address: DEMO_ADDRESSES.bob, value: 2.74 },
    ],
    outputs: [
      { n: 0, address: DEMO_ADDRESSES.exchange, value: 2.5 },
      { n: 1, address: DEMO_ADDRESSES.bob, value: 0.23 },
    ],
  },
};

export const DEMO_GRAPH: CytoscapeGraph = {
  nodes: [
    {
      data: {
        id: DEMO_TXIDS.coinbase,
        label: "Coinbase\n6.25 BTC",
        txid: DEMO_TXIDS.coinbase,
        value: 6.25,
        is_coinbase: true,
        has_label: true,
      },
    },
    {
      data: {
        id: DEMO_TXIDS.txA,
        label: "Tx A\n6.24 BTC",
        txid: DEMO_TXIDS.txA,
        value: 6.24,
        is_coinbase: false,
        has_label: false,
      },
    },
    {
      data: {
        id: DEMO_TXIDS.txB,
        label: "Tx B\n2.73 BTC",
        txid: DEMO_TXIDS.txB,
        value: 2.73,
        is_coinbase: false,
        has_label: true,
      },
    },
  ],
  edges: [
    {
      data: {
        id: `${DEMO_TXIDS.coinbase}->${DEMO_TXIDS.txA}`,
        source: DEMO_TXIDS.coinbase,
        target: DEMO_TXIDS.txA,
        value: 6.25,
        label: "6.25 BTC",
      },
    },
    {
      data: {
        id: `${DEMO_TXIDS.txA}->${DEMO_TXIDS.txB}`,
        source: DEMO_TXIDS.txA,
        target: DEMO_TXIDS.txB,
        value: 2.74,
        label: "2.74 BTC",
      },
    },
  ],
};

export const DEMO_LABELS: BIP329Label[] = [
  {
    id: "demo-label-1",
    type: "tx",
    ref: DEMO_TXIDS.coinbase,
    label: "Mining reward",
    origin: "demo",
  },
  {
    id: "demo-label-2",
    type: "tx",
    ref: DEMO_TXIDS.txB,
    label: "Exchange deposit",
    origin: "demo",
  },
];
