import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chainToChainIdPortals, PORTALS_URL } from 'src/common/constants';
import { Action, ExecutableTransaction } from 'src/common/types';
import {
  FailedTransaction,
  PortalsTransaction,
  SuccessPortalsTransaction,
} from 'src/common/types/portals';

//!info ->
// * there is an option to charge fees
//* if we don't give approval to the portals then it doesn't build the tx data
//* turn around for this is to give infinite approval to portals contract beforehand
//* and then build the transaction
@Injectable()
export class PortalsService {
  constructor(private readonly configService: ConfigService) {}

  portalsUrlBuilder(
    sender: string,
    network: string | undefined,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ) {
    if (!network) throw new BadRequestException('Network not supported');

    const url = `${PORTALS_URL}/portal?sender=${sender}&inputToken=${network + '%3A' + inputToken}&inputAmount=${inputAmount}&outputToken=${network + '%3A' + outputToken}&slippageTolerancePercentage=${slippage ? slippage : '2.5'}&validate=false`;

    return url;
  }

  async getTokens(network: string, platform: string) {
    const data = await fetch(
      `${PORTALS_URL}/tokens?networks=${network}&platforms=${platform}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const tokens = await data.json();

    return tokens;
  }

  async approvePortals(
    sender: string,
    network: string | undefined,
    inputToken: string,
    inputAmount: string,
  ) {
    if (!network) throw new BadRequestException('Network not supported');

    const data = await fetch(
      `${PORTALS_URL}/approval?sender=${sender}&inputToken=${network + '%3A' + inputToken}&inputAmount=${inputAmount}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const approvalResponse = await data.json();

    return approvalResponse;
  }

  //*Creates the approval transaction of type ExecutableTransaction
  async createApproveTransaction(
    sender: string,
    network: string,
    inputToken: string,
    inputAmount: string,
  ) {
    let transaction: ExecutableTransaction | object = {};

    const data = await this.approvePortals(
      sender,
      network,
      inputToken,
      inputAmount,
    );

    if (data.statusCode && data.statusCode !== 200) {
      throw new BadRequestException(data.message);
    }

    if (data.context.shouldApprove) {
      transaction = {
        to: data.approve.to,
        tx: data.approve.data,
        chain: chainToChainIdPortals[network],
        type: Action.APPROVE,
      };
    }

    return transaction;
  }

  async simulateTransaction(
    network: string | undefined,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ) {
    if (!network) throw new BadRequestException('Network not supported');

    const data = await fetch(
      `${PORTALS_URL}/portal/estimate?&inputToken=${network + '%3A' + inputToken}&inputAmount=${inputAmount}&outputToken=${network + '%3A' + outputToken}&slippage=${slippage ? slippage : '2.5'}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const simulatedTransaction = await data.json();

    if (
      simulatedTransaction.statusCode &&
      simulatedTransaction.statusCode !== 200
    )
      throw new BadRequestException(simulatedTransaction.message);

    return simulatedTransaction;
  }

  async prepareTransaction(
    sender: string,
    network: string | undefined,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ): Promise<PortalsTransaction> {
    if (!network) throw new BadRequestException('Network not supported');

    const data = await fetch(
      `${PORTALS_URL}/portal?sender=${sender}&inputToken=${network + '%3A' + inputToken}&inputAmount=${inputAmount}&outputToken=${network + '%3A' + outputToken}&slippageTolerancePercentage=${slippage ? slippage : '2.5'}&validate=false`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const portalsTransaction = await data.json();

    return portalsTransaction;
  }

  //* Creates the executable transaction of portals of type ExecutableTransaction
  async createExecutableTransaction(
    sender: string,
    network: string | undefined,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ): Promise<ExecutableTransaction> {
    if (!network) throw new BadRequestException('Network not supported');

    const data = await this.prepareTransaction(
      sender,
      network,
      inputToken,
      inputAmount,
      outputToken,
      slippage,
    );

    if (
      (data as FailedTransaction).statusCode !== undefined &&
      (data as FailedTransaction).statusCode !== 200
    )
      throw new BadRequestException((data as FailedTransaction).message);

    return {
      chain: chainToChainIdPortals[network],
      type: Action.PORTALS,
      tx: (data as SuccessPortalsTransaction).tx.data,
      to: (data as SuccessPortalsTransaction).tx.to,
    };
  }
}
