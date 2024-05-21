import { hookBuilder } from 'src/common/hooks/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, AAVE_POOL_ABI } from 'src/common/constants/abi';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { aaveConfig } from 'src/common/constants/config/aave';
import { SquidCallType } from '@0xsquid/squid-types';

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
 * @param {TransactionDetailsDto} txDetails
 * @returns squid sdk Hook
 */
export const aaveSupplyHandler = (txDetails: TransactionDetailsDto) => {
  const erc20EncodedData = encodeFunctionData(
    ERC20_ABI,
    'approve',
    [aaveConfig[txDetails.toChain].poolAddress as string, 1], //* this amount gets overwritten by payload
  );

  const aaveSupplyEncodedData = encodeFunctionData(
    AAVE_POOL_ABI,
    'supply',
    [txDetails.toToken, 1, txDetails.fromAddress, 0], //* the amount at index 1 gets overwritten by payload
  );

  const calls = [
    {
      target: txDetails.toToken,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should support both token and native
      callData: erc20EncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
    {
      target: aaveConfig[txDetails.toChain].poolAddress, //!it should support both token and native
      callType: SquidCallType.FULL_TOKEN_BALANCE,
      callData: aaveSupplyEncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
  ];
  const hooks = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Supply into aave using squid',
    calls,
  });

  return hooks;
};

/**
 * Creates the aave repay hook for squid
 * * first call includes giving the approval of erc20 token that we will repay to aave
 * * second call includes repaying back the token to aave protocol
 * @param {TransactionDetailsDto} txDetails
 * @returns squid SDK Hook for repaying back to aave
 */
export const aaveRepayHandler = (txDetails: TransactionDetailsDto) => {
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    aaveConfig[txDetails.toChain].poolAddress,
    1,
  ]); //* this amount gets overwritten by payload

  const aaveRepayEncodedData = encodeFunctionData(AAVE_POOL_ABI, 'repay', [
    txDetails.toToken,
    1,
    2,
    txDetails.fromAddress,
  ]); //* the amount at index 1 gets overwritten by payload

  const calls = [
    {
      target: txDetails.toToken,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should support both token and native
      callData: erc20EncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
    {
      target: txDetails.toToken,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should support both token and native
      callData: aaveRepayEncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
  ];

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Repay back to aave protocol using squid',
    calls,
  });

  return hook;
};
