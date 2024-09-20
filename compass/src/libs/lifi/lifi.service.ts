import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ChainId,
  ChainType,
  ContractCallsQuoteRequest,
  ContractCallsQuoteRequestFromAmount,
  createConfig,
  getContractCallsQuote,
  getQuote,
  getRoutes,
  getTokens,
  QuoteRequest,
  RoutesRequest,
} from '@lifi/sdk';
import { LIFI_URL } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LifiService {
  constructor(private readonly configService: ConfigService) {
    createConfig({
      integrator: 'Spreadefi',
      apiUrl: LIFI_URL,
      apiKey: this.configService.get<string>('LIFI_API_KEY'),
      rpcUrls: {
        [ChainId.ARB]: [this.configService.get<string>('ARB_RPC')],
        [ChainId.OPT]: [this.configService.get<string>('OP_RPC')],
        [ChainId.BAS]: [this.configService.get<string>('BASE_RPC')],
        [ChainId.FTM]: [this.configService.get<string>('FANTOM_RPC')],
        [ChainId.AVA]: [this.configService.get<string>('AVALANCHE_RPC')],
        [ChainId.POL]: [this.configService.get<string>('POLYGON_RPC')],
        [ChainId.LNA]: [this.configService.get<string>('LINEA_RPC')],
        [ChainId.BSC]: [this.configService.get<string>('BSC_RPC')],
      },
    });
  }

  async getTokenList() {
    try {
      const tokens = await getTokens({
        chainTypes: [ChainType.EVM],
      });

      return tokens;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getLifiRoute(lifiRouteArgs: Partial<RoutesRequest>) {
    try {
      const result = await getRoutes({
        fromAddress: lifiRouteArgs.fromAddress,
        fromChainId: lifiRouteArgs.fromChainId,
        toChainId: lifiRouteArgs.toChainId,
        fromTokenAddress: lifiRouteArgs.fromTokenAddress,
        toTokenAddress: lifiRouteArgs.toTokenAddress,
        fromAmount: lifiRouteArgs.fromAmount,
      });

      return result.routes[0];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getLifiQuote(lifiQuoteArgs: Partial<QuoteRequest>) {
    try {
      const result = await getQuote({
        fromAddress: lifiQuoteArgs.fromAddress,
        fromChain: lifiQuoteArgs.fromChain,
        toChain: lifiQuoteArgs.toChain,
        fromToken: lifiQuoteArgs.fromToken,
        toToken: lifiQuoteArgs.toToken,
        fromAmount: lifiQuoteArgs.fromAmount,
      });

      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getLifiContractQuote(
    lifiContractQuoteArgs: Partial<ContractCallsQuoteRequest>,
  ) {
    try {
      const result = await getContractCallsQuote({
        fromAddress: lifiContractQuoteArgs.fromAddress,
        fromChain: lifiContractQuoteArgs.fromChain,
        toChain: lifiContractQuoteArgs.toChain,
        fromToken: lifiContractQuoteArgs.fromToken,
        toToken: lifiContractQuoteArgs.toToken,
        fromAmount: (
          lifiContractQuoteArgs as ContractCallsQuoteRequestFromAmount
        ).fromAmount,
        contractCalls: lifiContractQuoteArgs.contractCalls,
      });

      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
