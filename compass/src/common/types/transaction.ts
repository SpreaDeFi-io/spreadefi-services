import { Estimate, RouteRequest, SquidData } from '@0xsquid/squid-types';
import { Action } from './strategy';
import { BytesLike } from 'ethers';

export type ExecutableTransaction = {
  to: string;
  type: Action;
  tx:
    | BytesLike
    | {
        estimate: Estimate;
        transactionRequest?: SquidData;
        params: RouteRequest;
      };
};
