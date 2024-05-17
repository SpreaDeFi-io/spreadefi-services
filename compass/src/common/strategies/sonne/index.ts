import { StrategyArgs } from 'src/common/types';
import { hookBuilder } from 'src/common/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, SONNE_POOL_ABI } from 'src/common/constants/abi';

/**
 * * This strategy includes interacting with sonne protocol and performing functions
 * * such as supply, borrow, withdraw, repay etc using squid protocol
 * * however withdrawing and borrowing do not necessarily need hooks as they can be
 * * withdrawn from protocol and then bridged using Squid's SDK
 */

/**
 * Creates the sonne supply strategy for squid hook
 * * first call includes giving the approval of erc20 token that we will receive at dest chain to sonne pool address
 * * second call includes depositing the token to sonne protocol
 * * we pass the neccessary data into HookBuilder and it creates the hook for us that we call strategy
 * @param {StrategyArgs} strategyArgs
 * @returns squid sdk Hook
 */
export const sonneSupplyHandler = (strategyArgs: StrategyArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    strategyArgs.contracts[0].params,
  );

  const sonneSupplyEncodedData = encodeFunctionData(
    SONNE_POOL_ABI,
    'supply',
    strategyArgs.contracts[1].params,
  );

  const calls = [
    {
      target: strategyArgs.contracts[0].target,
      callData: erc20EncodedData,
    },
    {
      target: strategyArgs.contracts[1].target,
      callData: sonneSupplyEncodedData,
    },
  ];

  const strategy = hookBuilder({
    fundToken: strategyArgs.fundToken,
    fundAmount: strategyArgs.fundAmount,
    description: 'Supply into sonne using squid',
    calls,
  });

  return strategy;
};

/**
 * Creates the sonne repay strategy for squid hook
 * * first call includes giving the approval of erc20 token that we will repay to sonne
 * * second call includes repaying back the token to sonne protocol
 * @param {StrategyArgs} strategyArgs
 * @returns squid SDK Hook for repaying back to sonne
 */
export const sonneRepayHandler = (strategyArgs: StrategyArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    strategyArgs.contracts[0].params,
  );

  const sonneRepayEncodedData = encodeFunctionData(
    SONNE_POOL_ABI,
    'repay',
    strategyArgs.contracts[1].params,
  );

  const calls = [
    {
      target: strategyArgs.contracts[0].target,
      callData: erc20EncodedData,
    },
    {
      target: strategyArgs.contracts[1].target,
      callData: sonneRepayEncodedData,
    },
  ];

  const strategy = hookBuilder({
    fundToken: strategyArgs.fundToken,
    fundAmount: strategyArgs.fundAmount,
    description: 'Repay backe to sonne protocol using squid',
    calls,
  });

  return strategy;
};
