import { Hook } from '@0xsquid/squid-types';

export type SquidQuoteArgs = {
  fromChain: string;
  fromAmount: string;
  fromToken: string;
  toChain: string;
  toToken: string;
  fromAddress: string;
  toAddress: string;
  preHook?: Hook;
  postHook?: Hook;
};
