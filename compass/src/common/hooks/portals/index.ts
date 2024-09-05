import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI } from 'src/common/constants/abi';
import { encodeFunctionData } from 'src/common/ethers';
import { HookBuilderArgs } from 'src/common/types';
import { PortalsTransaction } from 'src/common/types/portals';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';

export const portalsHandler = (
  txDetails: TransactionDetailsDto,
  portalsTx: PortalsTransaction,
) => {
  const calls: HookBuilderArgs['calls'] = [];

  calls.push({
    target: portalsTx.tx.to,
    callType: SquidCallType.DEFAULT,
    callData: portalsTx.tx.data,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 0,
    },
  });

  const transferEncodedData = encodeFunctionData(ERC20_ABI, 'transfer', [
    txDetails.toAddress,
    1, //* the amount at index 1 will be overwritten by payload
  ]);

  calls.push({
    target: txDetails.toToken,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: transferEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Deposit into protocols using portals',
    calls,
  });

  return hook;
};

export const portalsMigrationHandler = (
  txDetails: TransactionDetailsDto,
  preHookPortalsTx: PortalsTransaction,
  postHookPortalsTx: PortalsTransaction,
) => {
  const preHookCalls: HookBuilderArgs['calls'] = [];

  preHookCalls.push({
    target: preHookPortalsTx.tx.to,
    callType: SquidCallType.DEFAULT,
    callData: preHookPortalsTx.tx.data,
    payload: {
      tokenAddress: txDetails.fromToken,
      inputPos: 0,
    },
  });

  const preHook = hookBuilder({
    fundToken: txDetails.fromToken,
    fundAmount: txDetails.fromAmount,
    description: 'Swap using portals',
    calls: preHookCalls,
  });

  const postHook = portalsHandler(txDetails, postHookPortalsTx);

  return { preHook, postHook };
};
