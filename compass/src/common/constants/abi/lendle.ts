export const LENDLE_POOL_ABI = [
  {
    inputs: [],
    name: 'FLASHLOAN_PREMIUM_TOTAL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LENDINGPOOL_REVISION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_NUMBER_RESERVES',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_STABLE_RATE_BORROW_SIZE_PERCENT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'referralCode',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: 'referralCode',
        type: 'uint16',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'balanceFromBefore',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'balanceToBefore',
        type: 'uint256',
      },
    ],
    name: 'finalizeTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiverAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'modes',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
      {
        internalType: 'uint16',
        name: 'referralCode',
        type: 'uint16',
      },
    ],
    name: 'flashLoan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAddressesProvider',
    outputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getConfiguration',
    outputs: [
      {
        components: [
          {
            type: 'uint256',
          },
        ],
        internalType: 'struct DataTypes.ReserveConfigurationMap',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          {
            components: [
              {
                type: 'uint256',
              },
            ],
            type: 'tuple',
          },
          {
            type: 'uint128',
          },
          {
            type: 'uint128',
          },
          {
            type: 'uint128',
          },
          {
            type: 'uint128',
          },
          {
            type: 'uint128',
          },
          {
            type: 'uint40',
          },
          {
            type: 'address',
          },
          {
            type: 'address',
          },
          {
            type: 'address',
          },
          {
            type: 'address',
          },
          {
            type: 'uint8',
          },
        ],
        internalType: 'struct DataTypes.ReserveData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveNormalizedIncome',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveNormalizedVariableDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getReservesList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserAccountData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableBorrowsETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentLiquidationThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ltv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactor',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserConfiguration',
    outputs: [
      {
        components: [
          {
            type: 'uint256',
          },
        ],
        internalType: 'struct DataTypes.UserConfigurationMap',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'aTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stableDebtAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'variableDebtAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'interestRateStrategyAddress',
        type: 'address',
      },
    ],
    name: 'initReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ILendingPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collateralAsset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'debtAsset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'debtToCover',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'receiveAToken',
        type: 'bool',
      },
    ],
    name: 'liquidationCall',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'rebalanceStableBorrowRate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'rateMode',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
    ],
    name: 'repay',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'configuration',
        type: 'uint256',
      },
    ],
    name: 'setConfiguration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'val',
        type: 'bool',
      },
    ],
    name: 'setPause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'rateStrategyAddress',
        type: 'address',
      },
    ],
    name: 'setReserveInterestRateStrategyAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'useAsCollateral',
        type: 'bool',
      },
    ],
    name: 'setUserUseReserveAsCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'rateMode',
        type: 'uint256',
      },
    ],
    name: 'swapBorrowRateMode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: false,
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        name: 'onBehalfOf',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'borrowRateMode',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'borrowRate',
        type: 'uint256',
      },
      {
        indexed: true,
        name: 'referral',
        type: 'uint16',
      },
    ],
    name: 'Borrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: false,
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        name: 'onBehalfOf',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        name: 'referral',
        type: 'uint16',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'target',
        type: 'address',
      },
      {
        indexed: true,
        name: 'initiator',
        type: 'address',
      },
      {
        indexed: true,
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'premium',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'referralCode',
        type: 'uint16',
      },
    ],
    name: 'FlashLoan',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'collateralAsset',
        type: 'address',
      },
      {
        indexed: true,
        name: 'debtAsset',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        name: 'debtToCover',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'liquidatedCollateralAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'liquidator',
        type: 'address',
      },
      {
        indexed: false,
        name: 'receiveAToken',
        type: 'bool',
      },
    ],
    name: 'LiquidationCall',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
    ],
    name: 'RebalanceStableBorrowRate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        name: 'repayer',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Repay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: false,
        name: 'liquidityRate',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'stableBorrowRate',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'variableBorrowRate',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'liquidityIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'variableBorrowIndex',
        type: 'uint256',
      },
    ],
    name: 'ReserveDataUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
    ],
    name: 'ReserveUsedAsCollateralDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
    ],
    name: 'ReserveUsedAsCollateralEnabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        name: 'rateMode',
        type: 'uint256',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'reserve',
        type: 'address',
      },
      {
        indexed: true,
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
];

export const LENDLE_CREDIT_DELEGATION_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'fromUser',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'toUser',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'BorrowAllowanceDelegated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'approveDelegation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'fromUser',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toUser',
        type: 'address',
      },
    ],
    name: 'borrowAllowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegator',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'delegatee',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'delegationWithSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
