import { BadRequestException, Injectable } from '@nestjs/common';
import { MaxUint256 } from 'ethers';
import { ERC20_ABI } from 'src/common/constants/abi';
import { BEEFY_VAULT_ABI } from 'src/common/constants/abi/beefy';
import { HOP_WRAPPER_ABI } from 'src/common/constants/abi/hop';
import { beefyConfig } from 'src/common/constants/config/beefy';
import { chains } from 'src/common/constants/config/chain';
import { hopConfig } from 'src/common/constants/config/hop';
import { encodeFunctionData, ethersContract } from 'src/common/ethers';
import { hopBeefyHandler } from 'src/common/hooks/hop-beefy';
import { Action, ExecutableTransaction } from 'src/common/types';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { TransactionDetailsDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { SquidService } from 'src/libs/squid/squid.service';

@Injectable()
export class HopBeefyService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly squidService: SquidService,
  ) {}

  async addLiquidityAndDeposit(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const toTokenDetails = await this.assetRepository.getAssetByAddress(
      txDetails.toToken,
    );

    //* fetch the swap address and beefy vault address
    const swapAddress =
      hopConfig[txDetails.toChain][toTokenDetails.assetSymbol]?.swapAddress;
    const lpTokenAddress =
      hopConfig[txDetails.toChain][toTokenDetails.assetSymbol]?.lpTokenAddress;
    const beefyVault =
      beefyConfig[txDetails.toChain][toTokenDetails.assetSymbol]
        ?.beefyVaultAddress;

    if (!swapAddress || !lpTokenAddress || !beefyVault)
      throw new BadRequestException('Token not supported');
    if (
      txDetails.fromChain === txDetails.toChain &&
      txDetails.fromToken === txDetails.toToken
    ) {
      //* approve the token first
      const tx1 = encodeFunctionData(ERC20_ABI, 'approve', [
        swapAddress,
        txDetails.fromAmount,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: txDetails.toToken,
        type: Action.APPROVE,
        tx: tx1,
      });

      //* add liquidity to hop protocol
      const tx2 = encodeFunctionData(HOP_WRAPPER_ABI, 'deposit', [
        swapAddress,
        txDetails.toToken,
        lpTokenAddress,
        txDetails.fromAmount,
      ]);

      transactions.push({
        chain: txDetails.fromChain,
        to: swapAddress,
        type: Action.ADD_LIQUIDITY,
        tx: tx2,
      });

      const erc20Contract = ethersContract(
        lpTokenAddress,
        ERC20_ABI,
        chains[txDetails.toChain].rpc,
      );

      //* check how much allowance beefyvault Contract has of lptoken
      const allowance = await erc20Contract.allowance(
        txDetails.toAddress,
        beefyVault,
      );

      //* approve lptoken to make the approval max
      if (BigInt(allowance.toString()) !== MaxUint256) {
        const tx3 = encodeFunctionData(ERC20_ABI, 'approve', [
          beefyVault,
          MaxUint256.toString(),
        ]);

        transactions.push({
          chain: txDetails.fromChain,
          to: lpTokenAddress,
          type: Action.APPROVE,
          tx: tx3,
        });
      }

      //* call deposit all on beefy vault contract
      const tx4 = encodeFunctionData(BEEFY_VAULT_ABI, 'depositAll', []);

      transactions.push({
        chain: txDetails.fromChain,
        to: beefyVault,
        type: Action.DEPOSIT,
        tx: tx4,
      });

      return transactions;
    } else {
      //* get the quote from squid
      //* prepare the post hook
      const hook = hopBeefyHandler(
        txDetails,
        swapAddress,
        lpTokenAddress,
        beefyVault,
      );

      //*prepare squid transaction data
      const tx1 = await this.squidService.createQuote({
        ...txDetails,
        postHook: hook,
      });

      transactions.push({
        chain: txDetails.fromChain,
        to: '',
        type: Action.SQUID,
        tx: tx1,
      });

      return transactions;
    }
  }
}
