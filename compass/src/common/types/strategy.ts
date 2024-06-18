export enum StrategyName {
  AAVE = 'Aave',
  SEAMLESS = 'Seamless',
  ZEROLEND = 'Zerolend',
  PENDLE = 'Pendle',
  AAVE_SEAMLESS = 'Aave-Seamless',
  SEAMLESS_AAVE = 'Seamless-Aave',
  AAVE_ZEROLEND = 'Aave-Zerolend',
  ZEROLEND_AAVE = 'Zerolend-Aave',
  SEAMLESS_ZEROLEND = 'Seamless-Zerolend',
  ZEROLEND_SEAMLESS = 'Zerolend-Seamless',
  LOOPING_STRATEGY = 'Looping-Strategy',
  LOOPING_AAVE = 'Looping-Aave',
  LOOPING_SEAMLESS = 'Looping-Seamless', //looping is currently only present in aave and borrow/withdraw can happend from aave/seamless/zerolend
  LOOPING_ZEROLEND = 'Looping-Zerolend',
  HOP_BEEFY = 'Hop-Beefy',
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
  E_MODE = 'Set-Aave-EMode',
  APPROVE_DELEGATION = 'Approve-Delegation',
  LOOP_STRATEGY = 'Loop-Strategy',
  WITHDRAW_LOOP = 'Withdraw-Loop',
  BORROW_LOOP = 'Borrow-Loop',
  ADD_LIQUIDITY = 'Add-Liquidity',
}
