import { hookBuilder } from 'src/common/hooks/hook-builder';
import { encodeFunctionData } from 'src/common/ethers';
import { ERC20_ABI, SEAMLESS_POOL_ABI } from 'src/common/constants/abi';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { SquidCallType } from '@0xsquid/squid-types';
import { ETHEREUM_ADDRESS_SQUID } from 'src/common/constants';
import { HookBuilderArgs } from 'src/common/types';

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
  const calls: HookBuilderArgs['calls'] = [];

  //* approval not needed if token is ethereum
  if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      seamlessConfig[txDetails.toChain].poolAddress as string,
      1, //* this amount gets overwritten by payload
    ]);

    calls.push({
      target: txDetails.toToken,
      callType: SquidCallType.FULL_TOKEN_BALANCE, //!it should support both token and native
      callData: erc20EncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    });
  }

  const seamlessSupplyEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
    'supply',
    [txDetails.toToken, 1, txDetails.fromAddress, 0], //! toToken will differ here in case of ETH
    //* the amount at index 1 gets overwritten by payload
  );

  calls.push({
    target: seamlessConfig[txDetails.toChain].poolAddress,
    callType:
      txDetails.toToken === ETHEREUM_ADDRESS_SQUID
        ? SquidCallType.FULL_NATIVE_BALANCE
        : SquidCallType.FULL_TOKEN_BALANCE,
    callData: seamlessSupplyEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

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
  const calls: HookBuilderArgs['calls'] = [];

  if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      seamlessConfig[txDetails.toChain].poolAddress,
      1, //* the amount at index 1 gets overwritten by payload
    ]);

    calls.push({
      target: txDetails.toToken,
      callType: SquidCallType.FULL_TOKEN_BALANCE,
      callData: erc20EncodedData,
      payload: {
        tokenAddress: txDetails.toToken,
        inputPos: 1,
      },
    });
  }

  const seamlessRepayEncodedData = encodeFunctionData(
    SEAMLESS_POOL_ABI,
    'repay',
    [txDetails.toToken, 1, 2, txDetails.fromAddress], //! toToken will differ here for eth
    //* the amount at index 1 gets overwritten by payload
  );

  calls.push({
    target: seamlessConfig[txDetails.toChain].poolAddress,
    callType:
      txDetails.toToken === ETHEREUM_ADDRESS_SQUID
        ? SquidCallType.FULL_NATIVE_BALANCE
        : SquidCallType.FULL_TOKEN_BALANCE,
    callData: seamlessRepayEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

  const returnAmountEncodeData = encodeFunctionData(ERC20_ABI, 'transfer', [
    txDetails.toAddress,
    1,
  ]); //* the amount at index 1 will be overwritten by payload

  calls.push({
    target: txDetails.toToken,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: returnAmountEncodeData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Repay back to seamless protocol using squid',
    calls,
  });

  return hook;
};
