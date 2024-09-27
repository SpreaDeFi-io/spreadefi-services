import { Estimate, RouteRequest, SquidData } from '@0xsquid/squid-types';
import { Action } from './strategy';
import { BytesLike } from 'ethers';
import { Route } from '@lifi/sdk';

export type ExecutableTransaction = {
  chain: string;
  to: string;
  type: Action;
  tx:
    | BytesLike
    | {
        estimate: Estimate;
        transactionRequest?: SquidData;
        params: RouteRequest;
      }
    | Route;
};
