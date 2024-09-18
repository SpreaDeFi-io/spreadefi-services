export enum StrategyName {
  AAVE = 'Aave',
  SEAMLESS = 'Seamless',
  ZEROLEND = 'Zerolend',
  AAVE_SEAMLESS = 'Aave-Seamless',
  SEAMLESS_AAVE = 'Seamless-Aave',
  AAVE_ZEROLEND = 'Aave-Zerolend',
  ZEROLEND_AAVE = 'Zerolend-Aave',
  SEAMLESS_ZEROLEND = 'Seamless-Zerolend',
  ZEROLEND_SEAMLESS = 'Zerolend-Seamless',
  AAVE_LOOPING = 'Aave-Looping',
  SEAMLESS_LOOPING = 'Seamless-Looping', //looping is currently only present in aave and borrow/withdraw can happen from aave/seamless/zerolend
  ZEROLEND_LOOPING = 'Zerolend-Looping',
  AAVE_LOOPING_AAVE = 'Aave-Looping-Aave',
  AAVE_LOOPING_SEAMLESS = 'Aave-Looping-Seamless',
  AAVE_LOOPING_ZEROLEND = 'Aave-Looping-Zerolend',
  HOP_BEEFY = 'Hop Beefy',
  AAVE_HOP_BEEFY = 'Aave-Hop Beefy',
  YEARN_V3 = 'yearn-v3',
  YEARN = 'yearn',
  PENDLE = 'pendle',
  YEARN_V3_PENDLE = 'yearn-v3-pendle',
  YEARN_PENDLE = 'yearn-pendle',
  PENDLE_YEARN_V3 = 'pendle-yearn-v3',
  PENDLE_YEARN = 'pendle-yearn',
  BEEFY = 'beefy',
  YEARN_V3_BEEFY = 'yearn-v3-beefy',
  YEARN_BEEFY = 'yearn-beefy',
  PENDLE_BEEFY = 'pendle-beefy',
  BEEFY_YEARN_V3 = 'beefy-yearn-v3',
  BEEFY_YEARN = 'beefy-yearn',
  BEEFY_PENDLE = 'beefy-pendle',
  HARVEST_FINANCE = 'harvest-finance',
  HARVEST_FINANCE_YEARN_V3 = 'harvest-finance-yearn-v3',
  HARVEST_FINANCE_YEARN = 'harvest-finance-yearn',
  HARVEST_FINANCE_PENDLE = 'harvest-finance-pendle',
  HARVEST_FINANCE_BEEFY = 'harvest-finance-beefy',
  YEARN_V3_HARVEST_FINANCE = 'yearn-v3-harvest-finance',
  YEARN_HARVEST_FINANCE = 'yearn-harvest-finance',
  PENDLE_HARVEST_FINANCE = 'pendle-harvest-finance',
  BEEFY_HARVEST_FINANCE = 'beefy-harvest-finance',
  STARGATE = 'stargate',
  STARGATE_YEARN = 'stargate-yearn',
  YEARN_STARGATE = 'yearn-stargate',
  STARGATE_PENDLE = 'stargate-pendle',
  PENDLE_STARGATE = 'pendle-stargate',
  STARGATE_YEARN_V3 = 'stargate-yearn-v3',
  YEARN_V3_STARGATE = 'yearn-v3-stargate',
  HARVEST_FINANCE_STARGATE = 'harvest-finance-stargate',
  STARGATE_HARVEST_FINANCE = 'stargate-harvest-finance',
  STARGATE_BEEFY = 'stargate-beefy',
  BEEFY_STARGATE = 'beefy-stargate',
  BENQI = 'benqi',
  BENQI_STARGATE = 'benqi-stargate',
  STARGATE_BENQI = 'stargate-benqi',
  BENQI_YEARN = 'benqi-yearn',
  YEARN_BENQI = 'yearn-benqi',
  BENQI_YEARN_V3 = 'benqi-yearn-v3',
  YEARN_V3_BENQI = 'yearn-v3-benqi',
  BENQI_HARVEST_FINANCE = 'benqi-harvest-finance',
  HARVEST_FINANCE_BENQI = 'harvest-finance-benqi',
  BENQI_PENDLE = 'benqi-pendle',
  PENDLE_BENQI = 'pendle-benqi',
  BENQI_BEEFY = 'benqi-beefy',
  BEEFY_BENQI = 'beefy-benqi',
}

export enum Action {
  APPROVE = 'Approve',
  SQUID = 'Squid',
  SUPPLY = 'Supply',
  WITHDRAW = 'Withdraw',
  BORROW = 'Borrow',
  REPAY = 'Repay',
  WITHDRAW_SUPPLY = 'Withdraw-Supply',
  BORROW_SUPPLY = 'Borrow-Supply',
  WITHDRAW_DEPOSIT = 'Withdraw-Deposit',
  BORROW_DEPOSIT = 'Borrow-Deposit',
  E_MODE = 'Set-Aave-EMode',
  APPROVE_DELEGATION = 'Approve-Delegation',
  LOOP_STRATEGY = 'Loop-Strategy',
  WITHDRAW_LOOP = 'Withdraw-Loop',
  BORROW_LOOP = 'Borrow-Loop',
  ADD_LIQUIDITY = 'Add-Liquidity',
  DEPOSIT = 'Deposit',
  PORTALS = 'Portals',
  ENSO = 'Enso',
}
