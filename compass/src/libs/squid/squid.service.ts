import { Squid } from '@0xsquid/sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
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
      executionSettings: {
        infiniteApproval: false,
      },
    });
  }

  async getSquidTokens() {
    try {
      await this.squid.init();

      const tokens = this.squid.tokens;

      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getSquidChains() {
    try {
      await this.squid.init();

      const chains = this.squid.chains;

      return chains;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createQuote(squidQuoteArgs: Partial<RouteRequest>) {
    try {
      await this.squid.init();

      const config: RouteRequest = {
        fromChain: squidQuoteArgs.fromChain,
        fromAmount: squidQuoteArgs.fromAmount,
        fromToken: squidQuoteArgs.fromToken,
        toChain: squidQuoteArgs.toChain,
        toToken: squidQuoteArgs.toToken,
        fromAddress: squidQuoteArgs.fromAddress,
        toAddress: squidQuoteArgs.toAddress,
        receiveGasOnDestination: squidQuoteArgs.receiveGasOnDestination,
        enableBoost: true,
      };

      if (squidQuoteArgs?.slippage) {
        config.slippage = squidQuoteArgs.slippage;
      }

      if (squidQuoteArgs.preHook) {
        config.preHook = squidQuoteArgs.preHook;
      }

      if (squidQuoteArgs.postHook) {
        config.postHook = squidQuoteArgs.postHook;
      }

      const { route } = await this.squid.getRoute(config);

      return route;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
