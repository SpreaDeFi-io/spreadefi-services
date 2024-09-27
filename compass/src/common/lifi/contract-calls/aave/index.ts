import { ContractCall } from '@lifi/sdk';
import {
  ETHEREUM_ADDRESS_LIFI,
  ETHEREUM_ADDRESS_SQUID,
} from 'src/common/constants';
import { AAVE_POOL_ABI, ERC20_ABI } from 'src/common/constants/abi';
import { aaveConfig } from 'src/common/constants/config/aave';
import { encodeFunctionData } from 'src/common/ethers';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';

export const aaveLifiSupplyHandler = (
  txDetails: TransactionDetailsDto,
  toAmount: string,
) => {
  const calls: ContractCall[] = [];

  //* approval not needed if token is ethereum
  if (
    txDetails.toToken !== ETHEREUM_ADDRESS_SQUID &&
    txDetails.toToken !== ETHEREUM_ADDRESS_LIFI
  ) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      aaveConfig[txDetails.toChain].poolAddress as string,
      toAmount,
    ]);

    calls.push({
      fromAmount: toAmount,
      fromTokenAddress: txDetails.toToken,
      toContractAddress: txDetails.toToken,
      toContractCallData: erc20EncodedData,
      toContractGasLimit: '300000',
    });
  }

  const aaveSupplyEncodedData = encodeFunctionData(AAVE_POOL_ABI, 'supply', [
    txDetails.toToken,
    toAmount,
    txDetails.fromAddress,
    0,
  ]);

  calls.push({
    fromAmount: toAmount,
    fromTokenAddress: txDetails.toToken,
    toContractAddress: aaveConfig[txDetails.toChain].poolAddress,
    toContractCallData: aaveSupplyEncodedData,
    toContractGasLimit: '300000',
  });

  return calls;
};

export const aaveLifiRepayHandler = (
  txDetails: TransactionDetailsDto,
  toAmount: string,
) => {
  const calls: ContractCall[] = [];

  if (
    txDetails.toToken !== ETHEREUM_ADDRESS_SQUID &&
    txDetails.toToken !== ETHEREUM_ADDRESS_LIFI
  ) {
    const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
      aaveConfig[txDetails.toChain].poolAddress,
      toAmount,
    ]);

    calls.push({
      fromAmount: toAmount,
      fromTokenAddress: txDetails.toToken,
      toContractAddress: txDetails.toToken,
      toContractCallData: erc20EncodedData,
      toContractGasLimit: '300000',
    });

    const aaveRepayEncodedData = encodeFunctionData(AAVE_POOL_ABI, 'repay', [
      txDetails.toToken, //! toToken will differ here for eth
      toAmount,
      2,
      txDetails.fromAddress,
    ]);

    calls.push({
      fromAmount: toAmount,
      fromTokenAddress: txDetails.toToken,
      toContractAddress: aaveConfig[txDetails.toChain].poolAddress,
      toContractCallData: aaveRepayEncodedData,
      toContractGasLimit: '300000',
    });
  }

  return calls;
};
