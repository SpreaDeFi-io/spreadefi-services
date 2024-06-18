import { SquidCallType } from '@0xsquid/squid-types';
import { ERC20_ABI } from 'src/common/constants/abi';
import { HOP_SWAP_ABI } from 'src/common/constants/abi/hop';
import { encodeFunctionData } from 'src/common/ethers';
import { HookBuilderArgs } from 'src/common/types';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { hookBuilder } from '../hook-builder';
import { BEEFY_VAULT_ABI } from 'src/common/constants/abi/beefy';

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
    swapAddress,
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

  //* add liquidity to hop
  const hopAddLiquidityEncodedData = encodeFunctionData(
    HOP_SWAP_ABI,
    'addLiquidity',
    [1, 0, Date.now() + 5000000], //* value at index 0 will be overwritten by payload
  );

  calls.push({
    target: swapAddress,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
    callData: hopAddLiquidityEncodedData,
    payload: {
      tokenAddress: txDetails.toToken,
      inputPos: 0,
    },
  });

  //* approve the lp token
  const lpTokenApprovalEncodedData = encodeFunctionData(ERC20_ABI, 'approve', [
    beefyVaultAddress,
    1, //* this amount gets overwritten by payload
  ]);

  calls.push({
    target: lpTokenAddress,
    callType: SquidCallType.FULL_TOKEN_BALANCE,
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
  });

  const hooks = hookBuilder({
    fundToken: txDetails.fundToken,
    fundAmount: txDetails.fundAmount,
    description: 'Add liquidity to hop protocol and deposit to beefy',
    calls,
  });

  return hooks;
};
