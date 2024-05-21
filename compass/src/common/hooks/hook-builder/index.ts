import { ChainType, Hook, SquidCallType } from '@0xsquid/squid-types';
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
        callType: SquidCallType.DEFAULT,
        target: call.target,
        callData: call.callData,
        estimatedGas: call.estimatedGas ?? '300000',
        value: '0',
        payload: {
          //! this payload is just for testing, so squid calls don't fail
          tokenAddress: call.target,
          inputPos: 1,
        },
      };
    }),
  };

  return hook;
};
