import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI, LOOPING_STRATEGY_ABI } from 'src/common/constants/abi';
import { chains } from 'src/common/constants/config/chain';
import { encodeFunctionData } from 'src/common/ethers';
import { HookBuilderArgs } from 'src/common/types';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';

export const loopStrategyHandler = (txdetails: TransactionDetailsDto) => {
  const calls: HookBuilderArgs['calls'] = [];

  //* give the approval of wstETH first
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    chains[txdetails.toChain].loopingStrategy,
    1,
  ]); //* this amount gets overwritten by payload

  calls.push({
    target: txdetails.toToken,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: erc20EncodedData,
    payload: {
      tokenAddress: txdetails.toToken,
      inputPos: 1,
    },
  });

  const loopStrategyEncodedData = encodeFunctionData(
    LOOPING_STRATEGY_ABI,
    'loopStrategy',
    [
      txdetails.toToken,
      chains[txdetails.toChain].wethAddress,
      1, //* this amount gets overwritten by payload
      txdetails.leverage,
      txdetails.toAddress,
      105, //!TODO: Hardcoded as of now but make it dynamic later
      100, //!TODO: Hardcoded as of now but make it dynamic later
    ],
  );

  calls.push({
    target: chains[txdetails.toChain].loopingStrategy,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: loopStrategyEncodedData,
    payload: {
      tokenAddress: txdetails.toToken,
      inputPos: 2,
    },
  });

  const hook = hookBuilder({
    fundToken: txdetails.fundToken,
    fundAmount: txdetails.fundAmount,
    description: 'Looping strategy',
    calls,
  });

  return hook;
};
