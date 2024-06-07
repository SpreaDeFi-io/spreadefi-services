export const LOOPING_STRATEGY_ABI = [
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
    name: 'aavePool',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'contract IPool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'addressesProvider',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IPoolAddressesProvider',
      },
    ],
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
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'router',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract ISwapRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'swapExactInputSingleHop',
    inputs: [
      { name: 'tokenIn', type: 'address', internalType: 'address' },
      { name: 'tokenOut', type: 'address', internalType: 'address' },
      { name: 'poolFee', type: 'uint24', internalType: 'uint24' },
      { name: 'amountIn', type: 'uint256', internalType: 'uint256' },
      { name: 'receiver', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  { type: 'error', name: 'FAILED_TO_LEND', inputs: [] },
];
