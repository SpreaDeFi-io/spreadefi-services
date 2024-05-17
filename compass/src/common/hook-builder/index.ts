import { ChainType, Hook, SquidCallType } from '@0xsquid/squid-types';
import { HookArgs } from 'src/common/types/hook';

export const hookBuilder = (hookArgs: HookArgs): Hook => {
  const hook: Hook = {
    chainType: ChainType.EVM,
    fundToken: hookArgs.fundToken,
    fundAmount: hookArgs.fundAmount,
    description: hookArgs.description,
    calls: hookArgs.calls.map((call) => {
      return {
        chainType: ChainType.EVM,
        callType: SquidCallType.DEFAULT,
        target: call.target,
        callData: call.callData,
        estimatedGas: call.estimatedGas ?? '300000',
        value: '0',
      };
    }),
  };

  return hook;
};
