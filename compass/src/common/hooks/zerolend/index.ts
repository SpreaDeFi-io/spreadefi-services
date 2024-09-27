import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI, ZEROLEND_POOL_ABI } from 'src/common/constants/abi';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { encodeFunctionData } from 'src/common/ethers';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';
import { HookBuilderArgs } from 'src/common/types';
import { ETHEREUM_ADDRESS_SQUID } from 'src/common/constants';

/**
 * * This hook includes interacting with zerolend protocol and performing functions
 * * such as supply, borrow, withdraw, repay etc using squid protocol
 * * however withdrawing and borrowing do not necessarily need hooks as they can be
 * * withdrawn from protocol and then bridged using Squid's SDK
 */

/**
 * Creates the zerolend supply hook for squid
 * * first call includes giving the approval of erc20 token that we will receive at dest chain to zerolend pool address
 * * second call includes depositing the token to zerolend protocol
 * * we pass the neccessary data into HookBuilder and it creates the hook for us
 * @param {TransactionDetailsDto} txDetails
 * @returns squid sdk Hook
 */
export const zerolendSupplyHandler = (txDetails: TransactionDetailsDto) => {
  const calls: HookBuilderArgs['calls'] = [];

  //* approval not needed if token is ethereum
  if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      zerolendConfig[txDetails.toChain].poolAddress as string,
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

  const zerolendSupplyEncodedData = encodeFunctionData(
    ZEROLEND_POOL_ABI,
    'supply',
    [txDetails.toToken, 1, txDetails.fromAddress, 0], //! toToken will differ here for eth
    //* the amount at index 1 gets overwritten by payload
  );

  calls.push({
    target: zerolendConfig[txDetails.toChain].poolAddress,
    callType:
      txDetails.toToken === ETHEREUM_ADDRESS_SQUID
        ? SquidCallType.FULL_NATIVE_BALANCE
        : SquidCallType.FULL_TOKEN_BALANCE,
    callData: zerolendSupplyEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 1,
    },
  });

  const hook = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Supply into zerolend using squid',
    calls,
  });

  return hook;
};

/**
 * Creates the zerolend repay hook for squid
 * * first call includes giving the approval of erc20 token that we will repay to zerolend
 * * second call includes repaying back the token to zerolend protocol
 * @param {TransactionDetailsDto} txDetails
 * @returns squid SDK Hook for repaying back to zerolend
 */
export const zerolendRepayHandler = (txDetails: TransactionDetailsDto) => {
  const calls: HookBuilderArgs['calls'] = [];

  if (txDetails.toToken !== ETHEREUM_ADDRESS_SQUID) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      zerolendConfig[txDetails.toChain].poolAddress,
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

  const zerolendRepayEncodedData = encodeFunctionData(
    ZEROLEND_POOL_ABI,
    'repay',
    [txDetails.toToken, 1, 2, txDetails.fromAddress], //! toToken will differ here for eth
    //* the amount at index 1 gets overwritten by payload
  );

  calls.push({
    target: zerolendConfig[txDetails.toChain].poolAddress,
    callType:
      txDetails.toToken === ETHEREUM_ADDRESS_SQUID
        ? SquidCallType.FULL_NATIVE_BALANCE
        : SquidCallType.FULL_TOKEN_BALANCE,
    callData: zerolendRepayEncodedData,
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
    description: 'Repay back to zerolend protocol using squid',
    calls,
  });

  return hook;
};
