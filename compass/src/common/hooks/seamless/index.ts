import { HookArgs } from 'src/common/types';
import { hookBuilder } from 'src/common/hooks/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, SEAMLESS_POOL_ABI } from 'src/common/constants/abi';

/**
 * * This hook includes interacting with seamless protocol and performing functions
 * * such as supply, borrow, withdraw, repay etc using squid protocol
 * * however withdrawing and borrowing do not necessarily need hooks as they can be
 * * withdrawn from protocol and then bridged using Squid's SDK
 */

/**
 * Creates the seamless supply hook for squid
 * * first call includes giving the approval of erc20 token that we will receive at dest chain to seamless pool address
 * * second call includes depositing the token to seamless protocol
 * * we pass the neccessary data into HookBuilder and it creates the hook for us
 * @param {HookArgs} hookArgs
 * @returns squid sdk Hook
 */
export const seamlessSupplyHandler = (hookArgs: HookArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    hookArgs.contracts[0].params,
  );

  const seamlessSupplyEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
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
      callData: seamlessSupplyEncodedData,
    },
  ];

  const hook = hookBuilder({
    fundToken: hookArgs.fundToken,
    fundAmount: hookArgs.fundAmount,
    description: 'Supply into seamless using squid',
    calls,
  });

  return hook;
};

/**
 * Creates the seamless repay hook for squid
 * * first call includes giving the approval of erc20 token that we will repay to seamless
 * * second call includes repaying back the token to seamless protocol
 * @param {HookArgs} hookArgs
 * @returns squid SDK Hook for repaying back to seamless
 */
export const seamlessRepayHandler = (hookArgs: HookArgs) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    hookArgs.contracts[0].params,
  );

  const seamlessRepayEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
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
      callData: seamlessRepayEncodedData,
    },
  ];

  const hook = hookBuilder({
    fundToken: hookArgs.fundToken,
    fundAmount: hookArgs.fundAmount,
    description: 'Repay backe to seamless protocol using squid',
    calls,
  });

  return hook;
};
