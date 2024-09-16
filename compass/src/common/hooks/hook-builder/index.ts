import { ChainType, Hook } from '@0xsquid/squid-types';
import { HookBuilderArgs } from 'src/common/types';

export const hookBuilder = (hookBuilderArgs: HookBuilderArgs): Hook => {
  const hook: Hook = {
    chainType: ChainType.EVM,
    fundToken: hookBuilderArgs.fundToken,
    fundAmount: hookBuilderArgs.fundAmount,
    description: hookBuilderArgs.description,
    calls: hookBuilderArgs.calls.map((call) => {
      return {
        chainType: ChainType.EVM,
        callType: call.callType,
        target: call.target,
        callData: call.callData,
        estimatedGas: '4000000',
        value: '0',
        payload: call.payload,
      };
    }),
    provider: 'Spreadefi',
    logoURI: 'https://spreadefi.svg',
  };

  return hook;
};
