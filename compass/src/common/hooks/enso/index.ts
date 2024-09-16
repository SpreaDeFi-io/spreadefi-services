import { SquidCallType } from '@0xsquid/squid-types';
import { chains } from 'src/common/constants/config/chain';
import { HookBuilderArgs } from 'src/common/types';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';

export type EnsoTx = {
  to: string;
  tx: string;
};

export const ensoHandler = (
  txDetails: TransactionDetailsDto,
  ensoApproveTx: EnsoTx,
  ensoSwapTx: EnsoTx,
) => {
  const calls: HookBuilderArgs['calls'] = [];

  //*This is the approval transaction
  calls.push({
    target: chains[txDetails.toChain].wethAddress,
    callType: SquidCallType.DEFAULT,
    callData: ensoApproveTx.tx,
    payload: {
      tokenAddress: chains[txDetails.toChain].wethAddress,
      inputPos: 1,
    },
  });

  //*then create the swapTx of enso
  calls.push({
    target: ensoSwapTx.to,
    callType: SquidCallType.DEFAULT,
    callData: ensoSwapTx.tx,
    payload: {
      tokenAddress: chains[txDetails.toChain].wethAddress,
      inputPos: 0,
    },
  });

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Deposit or withdraw from protocols using enso',
    calls,
  });

  return hook;
};
