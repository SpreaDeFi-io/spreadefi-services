import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  chainIdToChainPortals,
  SQUID_MULTICALL_CONTRACT,
} from 'src/common/constants';
import { portalsHandler } from 'src/common/hooks/portals';
import { Action, ExecutableTransaction } from 'src/common/types';
import { PortalsTransaction } from 'src/common/types/portals';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { ProtocolType } from 'src/core/resources/asset/asset.schema';
import { PrepareTransactionDto } from 'src/core/resources/quote/dto/prepare-transaction.dto';
import { PortalsService } from 'src/core/resources/portals/portals.service';
import { SquidService } from 'src/libs/squid/squid.service';
import { chains } from 'src/common/constants/config/chain';

@Injectable()
export class SquidPortalsService {
  constructor(
    private readonly squidService: SquidService,
    private readonly portalsService: PortalsService,
    private readonly assetRepository: AssetRepository,
  ) {}

  async prepareSquidPortalsTransaction({
    strategyName,
    txDetails,
  }: Omit<PrepareTransactionDto, 'action'>) {
    try {
      const transactions: Array<ExecutableTransaction> = [];

      const isTokenExist = await this.assetRepository.isAssetSupported(
        strategyName,
        txDetails.toChain,
        txDetails.toToken,
        ProtocolType.YIELD, //!should be dynamic later on
      );

      if (!isTokenExist)
        throw new NotFoundException(
          'Deposit of this token is not supported yet!',
        );

      if (txDetails.fromChain === txDetails.toChain) {
        const approvalData = await this.portalsService.approvePortals(
          txDetails.fromAddress,
          chainIdToChainPortals[txDetails.fromChain],
          txDetails.fromToken,
          txDetails.fromAmount,
        );

        if (approvalData.context.shouldApprove) {
          transactions.push({
            chain: txDetails.fromChain,
            type: Action.APPROVE,
            to: approvalData.approve.to,
            tx: approvalData.approve.data,
          });
        }

        transactions.push({
          chain: txDetails.fromChain,
          type: Action.PORTALS,
          to: '',
          tx: this.portalsService.portalsUrlBuilder(
            txDetails.fromAddress,
            chainIdToChainPortals[txDetails.fromChain],
            txDetails.fromToken,
            txDetails.fromAmount,
            txDetails.toToken,
            txDetails?.slippage,
          ),
        });

        return transactions;
      } else {
        const squidQuote = await this.squidService.createQuote({
          ...txDetails,
          toToken: chains[txDetails.toChain].wethAddress,
        });

        const toAmountMin = squidQuote.estimate.toAmountMin;

        const portalsTx: PortalsTransaction =
          await this.portalsService.prepareTransaction(
            SQUID_MULTICALL_CONTRACT, //* this is the address of squid
            chainIdToChainPortals[txDetails.toChain],
            chains[txDetails.toChain].wethAddress,
            toAmountMin,
            txDetails.toToken,
            txDetails?.slippage,
          );

        const hook = portalsHandler(txDetails, portalsTx);

        const tx1 = await this.squidService.createQuote({
          ...txDetails,
          toToken: chains[txDetails.toChain].wethAddress,
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
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }
}
