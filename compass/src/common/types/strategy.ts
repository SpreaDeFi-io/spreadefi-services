// import { SquidQuoteArgs } from './quote';
import { RouteRequest } from '@0xsquid/squid-types';

export enum StrategyName {
  AAVE = 'Aave',
  SEAMLESS = 'Seamless',
  PENDLE = 'Pendle',
}

export enum Action {
  SUPPLY = 'Supply',
  WITHDRAW = 'Withdraw',
  BORROW = 'Borrow',
  REPAY = 'Repay',
}
export type StrategyArgs = Partial<RouteRequest> & {
  fundToken?: string;
  fundAmount?: string;
};
