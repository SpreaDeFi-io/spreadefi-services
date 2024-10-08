import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '../../asset/asset.schema';
import { Model } from 'mongoose';
import { BalanceLogger } from './balance.logger';
import { ethers, getAddress } from 'ethers';
import {
  chainToChainIdPortals,
  PORTALS_PLATFORMS,
  RPC_URLS,
} from 'src/common/constants';
import { aaveConfig } from 'src/common/constants/config/aave';
import {
  AAVE_DATA_PROVIDER_ABI,
  SEAMLESS_DATA_PROVIDER_ABI,
  ZEROLEND_DATA_PROVIDER_ABI,
} from 'src/common/constants/abi';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { CovalentService } from 'src/libs/covalent/covalent.service';
import { PortalsService } from 'src/libs/portals/portals.service';
import { lendleConfig } from 'src/common/constants/config/lendle';
import { LENDLE_DATA_PROVIDER_ABI } from 'src/common/constants/abi/lendle';
// import { lendleConfig } from 'src/common/constants/config/lendle';
// import { LENDLE_DATA_PROVIDER_ABI } from 'src/common/constants/abi/lendle';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private readonly covalentService: CovalentService,
    private readonly balanceLogger: BalanceLogger,
    private readonly portalsService: PortalsService,
  ) {}

  /**
   * Fetches the balance details of all assets for a specific user across different protocols.
   * @param userAddress - The wallet address of the user.
   * @returns A filtered array of balance details.
   */
  async getUserAssetBalances(userAddress: string) {
    const assets = await this.assetModel.find().lean();

    const balancePromises = assets.map(async (asset) => {
      try {
        let balanceData: any;
        switch (asset.protocolName) {
          case 'Aave':
            balanceData = await this.fetchAssetBalance(
              asset.assetAddress,
              asset.chainId,
              userAddress,
              aaveConfig,
              AAVE_DATA_PROVIDER_ABI,
            );
            break;
          case 'Zerolend':
            balanceData = await this.fetchAssetBalance(
              asset.assetAddress,
              asset.chainId,
              userAddress,
              zerolendConfig,
              ZEROLEND_DATA_PROVIDER_ABI,
            );
            break;
          case 'Seamless':
            balanceData = await this.fetchAssetBalance(
              asset.assetAddress,
              asset.chainId,
              userAddress,
              seamlessConfig,
              SEAMLESS_DATA_PROVIDER_ABI,
            );
            break;
          case 'Lendle':
            balanceData = await this.fetchAssetBalance(
              asset.assetAddress,
              asset.chainId,
              userAddress,
              lendleConfig,
              LENDLE_DATA_PROVIDER_ABI,
            );
            break;
        }
        return balanceData
          ? {
              asset: asset,
              protocol: asset.protocolName,
              chainId: asset.chainId,
              currentATokenBalance: this.convertBalanceToStrings(
                balanceData[0],
              ),
              currentStableDebt: this.convertBalanceToStrings(balanceData[1]),
              currentVariableDebt: this.convertBalanceToStrings(balanceData[2]),
            }
          : null;
      } catch (error) {
        this.balanceLogger.error(
          `Error fetching balance for asset ${asset.assetAddress} on protocol ${asset.protocolName}: ${error.message}`,
        );
        return null;
      }
    });

    const balanceResults = await Promise.allSettled(balancePromises);

    const networks = Object.keys(chainToChainIdPortals);

    //*Fetch portals balance
    const tokensDetail = await this.portalsService.getBalance(
      userAddress,
      networks,
    );

    const supportedTokens = tokensDetail.filter(
      (token) => PORTALS_PLATFORMS.includes(token.platform) && token,
    );

    const formattedTokenDetails = [];

    supportedTokens.forEach((token) => {
      const asset = assets.find(
        (asset) =>
          getAddress(asset.assetAddress) === getAddress(token.address) &&
          asset.chainId === chainToChainIdPortals[token.network],
      );

      if (asset) {
        formattedTokenDetails.push({
          asset: asset,
          protocol: token.platform,
          chainId: chainToChainIdPortals[token.network],
          balance: token.balance,
          balanceUSD: token.balanceUSD,
        });
      }
    });

    const filteredBalances = balanceResults
      .filter(
        (result) =>
          result.status === 'fulfilled' &&
          result.value &&
          (result.value.currentATokenBalance > 0 ||
            result.value.currentStableDebt > 0 ||
            result.value.currentVariableDebt > 0),
      )
      .map((result: any) => result.value);

    filteredBalances.push(...formattedTokenDetails);

    return { filteredBalances, assets };
  }

  /**
   * Fetches the balance data for a specific asset and user from a protocol.
   * @param assetAddress - The address of the asset.
   * @param chainId - The ID of the blockchain network.
   * @param userAddress - The wallet address of the user.
   * @param protocolConfig - The configuration object of the protocol.
   * @param protocolAbi - The ABI of the protocol's data provider contract.
   * @returns The user's reserve data for the specified asset.
   */
  async fetchAssetBalance(
    assetAddress: string,
    chainId: string,
    userAddress: string,
    protocolConfig: any,
    protocolAbi: any,
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const dataProviderAddress = protocolConfig[chainId].poolDataProvider;
      const dataProviderContract = new ethers.Contract(
        dataProviderAddress,
        protocolAbi,
        provider,
      );
      const userReserveData = await dataProviderContract.getUserReserveData(
        assetAddress,
        userAddress,
      );
      return userReserveData;
    } catch (error) {
      this.balanceLogger.error(
        `Error fetching balance for user ${userAddress} on chain ${chainId} for asset ${assetAddress}: ${error.message}`,
      );
    }
  }

  /**
   * Converts balances from BigInt to string format.
   * @param balance - The balance to be converted.
   * @returns The balance in string format.
   */
  private convertBalanceToStrings(balance: any): any {
    if (Array.isArray(balance)) {
      return balance.map((item) =>
        typeof item === 'bigint' ? item.toString() : item,
      );
    } else if (typeof balance === 'bigint') {
      return balance.toString();
    } else if (typeof balance === 'object' && balance !== null) {
      return Object.entries(balance).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'bigint' ? value.toString() : value;
        return acc;
      }, {});
    }
    return balance;
  }
}
