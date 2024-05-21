import { hookBuilder } from 'src/common/hooks/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, SEAMLESS_POOL_ABI } from 'src/common/constants/abi';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { SquidCallType } from '@0xsquid/squid-types';

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
 * @param {TransactionDetailsDto} txDetails
 * @returns squid sdk Hook
 */
export const seamlessSupplyHandler = (txDetails: TransactionDetailsDto) => {
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    seamlessConfig[txDetails.toChain].poolAddress as string,
    1, //* this amount gets overwritten by payload
  ]);

  const seamlessSupplyEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
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
      target: seamlessConfig[txDetails.toChain].poolAddress,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should also support both token and native
      callData: seamlessSupplyEncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
  ];

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Supply into seamless using squid',
    calls,
  });

  return hook;
};

/**
 * Creates the seamless repay hook for squid
 * * first call includes giving the approval of erc20 token that we will repay to seamless
 * * second call includes repaying back the token to seamless protocol
 * @param {TransactionDetailsDto} txDetails
 * @returns squid SDK Hook for repaying back to seamless
 */
export const seamlessRepayHandler = (txDetails: TransactionDetailsDto) => {
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    seamlessConfig[txDetails.toChain].poolAddress,
    1, //* the amount at index 1 gets overwritten by payload
  ]);

  const seamlessRepayEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
    'repay',
    [txDetails.toToken, 1, 2, txDetails.fromAddress], //* the amount at index 1 gets overwritten by payload
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
      target: seamlessConfig[txDetails.toChain].poolAddress,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should support both token and native
      callData: seamlessRepayEncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    },
  ];

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Repay backe to seamless protocol using squid',
    calls,
  });

  return hook;
};
