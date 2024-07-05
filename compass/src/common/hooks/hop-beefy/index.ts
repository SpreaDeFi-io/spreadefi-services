import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI } from 'src/common/constants/abi';
import { HOP_WRAPPER_ABI } from 'src/common/constants/abi/hop';
import { encodeFunctionData } from 'src/common/ethers';
import { HookBuilderArgs } from 'src/common/types';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';
import { BEEFY_VAULT_ABI } from 'src/common/constants/abi/beefy';
import { hopConfig } from 'src/common/constants/config/hop';
import { ethers } from 'ethers';

//* Hop and beefy need to be created together since they can not work seperately
//* as in hop it requires an additional step to transfer the lp token to the user
export const hopBeefyHandler = (
  txDetails: TransactionDetailsDto,
  swapAddress: string,
  lpTokenAddress: string,
  beefyVaultAddress: string,
) => {
  const calls: HookBuilderArgs['calls'] = [];

  //*provide approval first
  const erc20EncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    hopConfig[txDetails.toChain].hopWrapperAddress,
    1, //* this amount gets overwritten by payload
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

  //* add liquidity to hop uaing hop wrapper
  const hopAddLiquidityEncodedData = encodeFunctionData(
    HOP_WRAPPER_ABI,
    'deposit',
    [swapAddress, txDetails.toToken, lpTokenAddress, 1], //* value at index 3 will be overwritten by payload
  );

  calls.push({
    target: hopConfig[txDetails.toChain].hopWrapperAddress,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: hopAddLiquidityEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 3,
    },
  });

  //* approve the lp token
  const lpTokenApprovalEncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    beefyVaultAddress,
    ethers.MaxUint256.toString(),
  ]);

  calls.push({
    target: lpTokenAddress,
    callType: SquidCallType.DEFAULT,
    callData: lpTokenApprovalEncodedData,
    payload: {
      tokenAddress: lpTokenAddress,
      inputPos: 1,
    },
  });

  //* deposit everything into beefy
  const beefyEncodedData = encodeFunctionData(
    BEEFY_VAULT_ABI,
    'depositAll',
    [],
  );

  calls.push({
    target: beefyVaultAddress,
    callType: SquidCallType.DEFAULT,
    callData: beefyEncodedData,
    payload: {
      tokenAddress: lpTokenAddress,
      inputPos: 0,
    },
  });

  const transferEncodedData = encodeFunctionData(ERC20_ABI, 'transfer', [
    txDetails.toAddress,
    1, //* this value will be overwritten by payload
  ]);

  calls.push({
    target: beefyVaultAddress,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: transferEncodedData,
    payload: {
      tokenAddress: beefyVaultAddress,
      inputPos: 1,
    },
  });

  //* set the approval of lp token to zero
  const removeApprovalEncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    beefyVaultAddress,
    0, //* set the approval to 0
  ]);

  calls.push({
    target: lpTokenAddress,
    callType: SquidCallType.DEFAULT,
    callData: removeApprovalEncodedData,
    payload: {
      tokenAddress: lpTokenAddress,
      inputPos: 1,
    },
  });

  const hooks = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Add liquidity to hop protocol and deposit to beefy',
    calls,
  });

  return hooks;
};
