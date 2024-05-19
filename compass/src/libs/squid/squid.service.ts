import { Squid } from '@0xsquid/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQUID_BASE_URL } from 'src/common/constants';
import { RouteRequest } from '@0xsquid/squid-types';

@Injectable()
export class SquidService {
  squid: Squid;

  constructor(private readonly configService: ConfigService) {
    this.squid = new Squid({
      baseUrl: SQUID_BASE_URL,
      integratorId: this.configService.get<string>('SQUID_INTEGRATOR_ID'),
    });
  }

  async createQuote(squidQuoteArgs: Partial<RouteRequest>) {
    await this.squid.init();

    const config: RouteRequest = {
      fromChain: squidQuoteArgs.fromChain,
      fromAmount: squidQuoteArgs.fromAmount,
      fromToken: squidQuoteArgs.fromToken,
      toChain: squidQuoteArgs.toChain,
      toToken: squidQuoteArgs.toToken,
      fromAddress: squidQuoteArgs.fromAddress,
      toAddress: squidQuoteArgs.toAddress,
      slippageConfig: {
        autoMode: 1, //!should be changed dynamically
      },
    };

    if (squidQuoteArgs.preHook) {
      config.preHook = squidQuoteArgs.preHook;
    }

    if (squidQuoteArgs.postHook) {
      config.postHook = squidQuoteArgs.postHook;
    }

    const { route } = await this.squid.getRoute(config);

    return route;
  }
}
