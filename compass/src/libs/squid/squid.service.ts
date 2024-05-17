import { Squid } from '@0xsquid/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQUID_BASE_URL } from 'src/common/constants';
import { SquidQuoteParams } from 'src/common/types/quote';

@Injectable()
export class SquidService {
  squid: Squid;

  constructor(private readonly configService: ConfigService) {
    this.squid = new Squid({
      baseUrl: SQUID_BASE_URL,
      integratorId: this.configService.get<string>('SQUID_INTEGRATOR_ID'),
    });
  }

  async createQuote(squidQuoteParams: SquidQuoteParams) {
    await this.squid.init();

    const { route } = await this.squid.getRoute({
      fromChain: squidQuoteParams.fromChain,
      fromAmount: squidQuoteParams.fromAmount,
      fromToken: squidQuoteParams.fromToken,
      toChain: squidQuoteParams.toChain,
      toToken: squidQuoteParams.toToken,
      fromAddress: squidQuoteParams.fromAddress,
      toAddress: squidQuoteParams.toAddress,
      slippageConfig: {
        autoMode: 1,
      },
    });

    return route;
  }
}
