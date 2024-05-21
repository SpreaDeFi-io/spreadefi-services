import { SquidCallType } from '@0xsquid/squid-types';

export type HookArgs = {
  fundToken?: string;
  fundAmount?: string;
  contracts: {
    target: string;
    params: Array<string | number>;
    callType: SquidCallType;
    payload: {
      tokenAddress: string;
      inputPos: number;
    };
  }[];
};

export type HookBuilderArgs = {
  fundToken: string;
  fundAmount: string;
  description: string;
  calls: {
    target: string;
    callType: SquidCallType;
    callData: string;
    payload?: {
      tokenAddress: string;
      inputPos: number;
    };
    estimatedGas?: string;
  }[];
};
