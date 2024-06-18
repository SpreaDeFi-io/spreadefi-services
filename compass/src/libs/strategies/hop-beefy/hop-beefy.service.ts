import { BadRequestException, Injectable } from '@nestjs/common';
import { ERC20_ABI } from 'src/common/constants/abi';
import { BEEFY_VAULT_ABI } from 'src/common/constants/abi/beefy';
import { HOP_SWAP_ABI } from 'src/common/constants/abi/hop';
import { beefyConfig } from 'src/common/constants/config/beefy';
import { hopConfig } from 'src/common/constants/config/hop';
import { encodeFunctionData } from 'src/common/ethers';
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

  async addLiquidity(txDetails: TransactionDetailsDto) {
    const transactions: Array<ExecutableTransaction> = [];

    const toTokenDetails = await this.assetRepository.getAssetByAddress(
      txDetails.toToken,
    );

    //* fetch the swap address and beefy vault address
    const swapAddress =
      hopConfig[txDetails.toChain][toTokenDetails.assetSymbol].swapAddress;
    const lpTokenAddress =
      hopConfig[txDetails.toChain][toTokenDetails.assetSymbol].lpTokenAddress;
    const beefyVault =
      beefyConfig[txDetails.toChain][toTokenDetails.assetSymbol]
        .beefyVaultAddress;

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
        to: txDetails.toToken,
        type: Action.APPROVE,
        tx: tx1,
      });

      //* add liquidity to hop protocol
      const tx2 = encodeFunctionData(HOP_SWAP_ABI, 'addLiquidity', [
        txDetails.fromAmount,
        0,
        Date.now() + 5000000,
      ]);

      transactions.push({
        to: swapAddress,
        type: Action.ADD_LIQUIDITY,
        tx: tx2,
      });

      const tx3 = encodeFunctionData(ERC20_ABI, 'approve', [
        beefyVault,
        txDetails.fromAmount,
      ]);

      //! figure out how to pass the balance of lptoken in the next transaction
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
        to: '',
        type: Action.SQUID,
        tx: tx1,
      });

      return transactions;
    }
  }
}
