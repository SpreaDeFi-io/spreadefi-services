import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '../../asset/asset.schema';
import { Model } from 'mongoose';
import { BalanceLogger } from './balance.logger';
import { ethers } from 'ethers';
import { RPC_URLS } from 'src/common/constants';
import { aaveConfig } from 'src/common/constants/config/aave';
import {
  AAVE_DATA_PROVIDER_ABI,
  SEAMLESS_DATA_PROVIDER_ABI,
  ZEROLEND_DATA_PROVIDER_ABI,
} from 'src/common/constants/abi';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { seamlessConfig } from 'src/common/constants/config/seamless';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private readonly balanceLogger: BalanceLogger,
  ) {}

  async getAssetBalance(address: string) {
    const assets = await this.assetModel.find();

    const balancePromises = assets.map(async (asset) => {
      try {
        let balance: any;
        switch (asset.protocolName) {
          case 'Aave':
            balance = await this.getBalance(
              asset.assetAddress,
              asset.chainId,
              address,
              aaveConfig,
              AAVE_DATA_PROVIDER_ABI,
            );
            break;
          case 'Zerolend':
            balance = await this.getBalance(
              asset.assetAddress,
              asset.chainId,
              address,
              zerolendConfig,
              ZEROLEND_DATA_PROVIDER_ABI,
            );
            break;
          case 'Seamless':
            balance = await this.getBalance(
              asset.assetAddress,
              asset.chainId,
              address,
              seamlessConfig,
              SEAMLESS_DATA_PROVIDER_ABI,
            );
            break;
        }
        return balance
          ? {
              asset: asset.assetAddress,
              protocol: asset.protocolName,
              chainId: asset.chainId,
              currentATokenBalance: this.convertBalanceToStrings(balance[0]),
              currentStableDebt: this.convertBalanceToStrings(balance[1]),
              currentVariableDebt: this.convertBalanceToStrings(balance[2]),
            }
          : null;
      } catch (error) {
        this.balanceLogger.error(
          `Error fetching balance for asset ${asset.assetAddress} on protocol ${asset.protocolName}: ${error.message}`,
        );
        return null;
      }
    });

    const balanceValues = await Promise.allSettled(balancePromises);
    const balanceFiltered = balanceValues
      .filter(
        (result) =>
          result.status === 'fulfilled' &&
          result.value &&
          (result.value.currentATokenBalance > 0 ||
            result.value.currentStableDebt > 0 ||
            result.value.currentVariableDebt > 0),
      )
      .map((result: any) => result.value);

    return balanceFiltered;
  }

  async getBalance(
    assetAddress: string,
    chainId: string,
    userAddress: string,
    config: any,
    abi: any,
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const address = config[chainId].poolDataProvider;
      const contract = new ethers.Contract(address, abi, provider);
      const reserveData = await contract.getUserReserveData(
        assetAddress,
        userAddress,
      );
      return reserveData;
    } catch (error) {
      this.balanceLogger.error(
        `Error fetching balance for user ${userAddress} on chain ${chainId} for asset ${assetAddress}: ${error.message}`,
      );
      throw new Error(error);
    }
  }

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
