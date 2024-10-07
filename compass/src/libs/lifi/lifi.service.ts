import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ChainId,
  ChainType,
  ContractCallsQuoteRequest,
  ContractCallsQuoteRequestToAmount,
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
        [ChainId.SCL]: [this.configService.get<string>('SCROLL_RPC')],
        [ChainId.BLS]: [this.configService.get<string>('BLAST_RPC')],
        [ChainId.MAM]: [this.configService.get<string>('METIS_RPC')],
        [ChainId.MNT]: [this.configService.get<string>('MANTLE_RPC')],
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
        fromAddress: lifiRouteArgs.fromAddress.toLowerCase(),
        fromChainId: lifiRouteArgs.fromChainId,
        toChainId: lifiRouteArgs.toChainId,
        fromTokenAddress: lifiRouteArgs.fromTokenAddress,
        toTokenAddress: lifiRouteArgs.toTokenAddress,
        fromAmount: lifiRouteArgs.fromAmount,
        options: {
          bridges: {
            allow: ['stargate', 'stargateV2'],
          },
        },
      });

      return result.routes[0];
    } catch (error) {
      console.log('error is', error);
      throw new BadRequestException(error);
    }
  }

  async getLifiQuote(lifiQuoteArgs: Partial<QuoteRequest>) {
    try {
      const result = await getQuote({
        fromAddress: lifiQuoteArgs.fromAddress.toLowerCase(),
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
        fromAddress: lifiContractQuoteArgs.fromAddress.toLowerCase(),
        toFallbackAddress: lifiContractQuoteArgs.fromAddress.toLowerCase(),
        fromChain: lifiContractQuoteArgs.fromChain,
        toChain: lifiContractQuoteArgs.toChain,
        fromToken: lifiContractQuoteArgs.fromToken,
        toToken: lifiContractQuoteArgs.toToken,
        toAmount: (lifiContractQuoteArgs as ContractCallsQuoteRequestToAmount)
          .toAmount,
        contractCalls: lifiContractQuoteArgs.contractCalls,
        preferBridges: ['stargate', 'stargateV2'],
      });

      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
