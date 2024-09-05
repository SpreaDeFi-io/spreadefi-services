import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PORTALS_URL } from 'src/common/constants';
import { PortalsTransaction } from 'src/common/types/portals';

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
    network: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ) {
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
    network: string,
    inputToken: string,
    inputAmount: string,
  ) {
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

  async simulateTransaction(
    sender: string,
    network: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ) {
    const data = await fetch(
      `${PORTALS_URL}/portal/estimate?sender=${sender}&inputToken=${network + '%3A' + inputToken}&inputAmount=${inputAmount}&outputToken=${network + '%3A' + outputToken}&slippage=${slippage ? slippage : '2.5'}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const simulatedTransaction = await data.json();

    return simulatedTransaction;
  }

  async prepareTransaction(
    sender: string,
    network: string,
    inputToken: string,
    inputAmount: string,
    outputToken: string,
    slippage?: number,
  ): Promise<PortalsTransaction> {
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
}
