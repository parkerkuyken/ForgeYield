// ── ERC-20 (approve / transfer) ───────────────────────────────────────────
export const erc20ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to',     type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const;

// ── Anvil CollateralVault ──────────────────────────────────────────────────
export const collateralVaultABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token',  type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token',  type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

// ── Anvil Letter of Credit proxy ───────────────────────────────────────────
export const letterOfCreditABI = [
  {
    name: 'createLOC',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'beneficiary', type: 'address' },
      { name: 'amount',      type: 'uint256' },
      { name: 'expiry',      type: 'uint256' },
    ],
    outputs: [{ name: 'locId', type: 'uint256' }],
  },
] as const;

// ── Ondo USDY Instant Manager ──────────────────────────────────────────────
export const usdyInstantManagerABI = [
  {
    name: 'subscribe',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'usdcAmount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'redeem',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'usdyAmount', type: 'uint256' }],
    outputs: [],
  },
] as const;
