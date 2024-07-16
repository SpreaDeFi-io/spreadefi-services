import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI } from 'src/common/constants/abi';
import { chains } from 'src/common/constants/config/chain';
import { encodeFunctionData } from 'src/common/ethers';
import { HookBuilderArgs } from 'src/common/types';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';
import { loopingConfig } from 'src/common/constants/config/looping';
import { ethers } from 'ethers';

export const loopStrategyHandler = (
  txDetails: TransactionDetailsDto,
  protocolName: string,
) => {
  const calls: HookBuilderArgs['calls'] = [];

  //* give the approval of wstETH first
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    loopingConfig[protocolName][txDetails.toChain][txDetails.toToken]
      .loopingContract,
    1,
  ]); //* this amount gets overwritten by payload

  calls.push({
    target:
      ethers.getAddress(txDetails.toToken) ===
      ethers.getAddress(chains[txDetails.toChain].wstETHAddress)
        ? chains[txDetails.toChain].wethAddress
        : txDetails.toToken,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: erc20EncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

  const loopStrategyEncodedData = encodeFunctionData(
    loopingConfig[protocolName][txDetails.toChain][txDetails.toToken].abi,
    'loopStrategy',
    [
      txDetails.toToken,
      chains[txDetails.toChain].wethAddress,
      1, //* this amount gets overwritten by payload
      txDetails.leverage,
      txDetails.toAddress,
      loopingConfig[protocolName][txDetails.toChain][txDetails.toToken]
        .borrowPercentage,
      100,
      10,
    ],
  );

  calls.push({
    target:
      loopingConfig[protocolName][txDetails.toChain][txDetails.toToken]
        .loopingContract,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: loopStrategyEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 2,
    },
  });

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Looping strategy',
    calls,
  });

  return hook;
};
