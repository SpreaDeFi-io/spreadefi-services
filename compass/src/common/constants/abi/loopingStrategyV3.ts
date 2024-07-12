export const LOOPING_STRATEGY_V3_ABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_addressProvider',
        type: 'address',
        internalType: 'address',
      },
      { name: '_router', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAddressesProviderAddr',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPoolAddr',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRouterAddr',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'loopStrategy',
    inputs: [
      { name: '_token', type: 'address', internalType: 'address' },
      {
        name: '_borrowedToken',
        type: 'address',
        internalType: 'address',
      },
      { name: '_amount', type: 'uint256', internalType: 'uint256' },
      { name: '_leverage', type: 'uint256', internalType: 'uint256' },
      { name: '_user', type: 'address', internalType: 'address' },
      {
        name: '_borrowPercentage',
        type: 'uint256',
        internalType: 'uint256',
      },
      { name: '_slippage', type: 'uint24', internalType: 'uint24' },
      {
        name: '_increaseApprove',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'error', name: 'FAILED_TO_RECEIVED', inputs: [] },
];
