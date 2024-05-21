import { HookArgs } from 'src/common/types';
import { hookBuilder } from 'src/common/hooks/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, AAVE_POOL_ABI } from 'src/common/constants/abi';

/**
 * * This hooks includes interacting with aave protocol and performing functions
 * * such as supply, borrow, withdraw, repay etc using squid protocol
 * * however withdrawing and borrowing do not necessarily need hooks as they can be
 * * withdrawn from protocol and then bridged using Squid's SDK
 */

/**
 * Creates the aave supply hooks for squid
 * * first call includes giving the approval of erc20 token that we will receive at dest chain to aave pool address
 * * second call includes depositing the token to aave protocol
 * * we pass the neccessary data into HookBuilder and it creates the hook for us
 * @param {HookArgs} hookArgs
 * @returns squid sdk Hook
 */
export const aaveSupplyHandler = (hookArgs: HookArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    hookArgs.contracts[0].params,
  );

  const aaveSupplyEncodedData = encodeFunctionData(
    AAVE_POOL_ABI,
    'supply',
    hookArgs.contracts[1].params,
  );

  const calls = [
    {
      target: hookArgs.contracts[0].target,
      callData: erc20EncodedData,
    },
    {
      target: hookArgs.contracts[1].target,
      callData: aaveSupplyEncodedData,
    },
  ];
  const hooks = hookBuilder({
    fundToken: hookArgs.fundToken,
    fundAmount: hookArgs.fundAmount,
    description: 'Supply into aave using squid',
    calls,
  });

  return hooks;
};

/**
 * Creates the aave repay hook for squid
 * * first call includes giving the approval of erc20 token that we will repay to aave
 * * second call includes repaying back the token to aave protocol
 * @param {HookArgs} hookArgs
 * @returns squid SDK Hook for repaying back to aave
 */
export const aaveRepayHandler = (hookArgs: HookArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    hookArgs.contracts[0].params,
  );

  const aaveRepayEncodedData = encodeFunctionData(
    AAVE_POOL_ABI,
    'repay',
    hookArgs.contracts[1].params,
  );

  const calls = [
    {
      target: hookArgs.contracts[0].target,
      callData: erc20EncodedData,
    },
    {
      target: hookArgs.contracts[1].target,
      callData: aaveRepayEncodedData,
    },
  ];

  const hook = hookBuilder({
    fundToken: hookArgs.fundToken,
    fundAmount: hookArgs.fundAmount,
    description: 'Repay back to aave protocol using squid',
    calls,
  });

  return hook;
};
