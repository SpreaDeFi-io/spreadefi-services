import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChainID, CovalentClient } from '@covalenthq/client-sdk';

@Injectable()
export class CovalentService {
  covalentClient: CovalentClient;

  constructor(private readonly configService: ConfigService) {
    this.covalentClient = new CovalentClient(
      this.configService.get<string>('COVALENT_API_KEY'),
    );
  }

  /**
   * Fetches the total balance of the user wallet including erc20 and native token
   * @param userAddress address of the user
   * @param chainId chain to query
   * @returns the user wallet balance
   */
  async getWalletBalanceForChain(userAddress: string, chainId: ChainID) {
    const response =
      await this.covalentClient.BalanceService.getTokenBalancesForWalletAddress(
        chainId,
        userAddress,
      );

    //!this is a temporary fix for the issue of covalent returning null for some chains
    if (response.error) {
      console.log('Error fetching wallet balance', response.error);
      return [];
    }

    // if (response.error)
    //   throw new InternalServerErrorException('Fetching token balance failed');

    return response.data.items;
  }
}
