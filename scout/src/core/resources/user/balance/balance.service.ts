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

    const balancePromises = assets.map((asset) => {
      if (asset.protocolName == 'Aave') {
        return this.getAaveBalance(
          asset.assetAddress,
          asset.chainId,
          address,
        ).then((balance) => ({
          asset: asset.assetAddress,
          balance,
        }));
      } else if (asset.protocolName == 'Zerolend') {
        return this.getZerolendBalance(
          asset.assetAddress,
          asset.chainId,
          address,
        ).then((balance) => ({
          asset: asset.assetAddress,
          balance,
        }));
      } else if (asset.protocolName == 'Seamless') {
        return this.getSeamlessBalance(
          asset.assetAddress,
          asset.chainId,
          address,
        ).then((balance) => ({
          asset: asset.assetAddress,
          balance,
        }));
      }
    });

    const balanceValues = await Promise.all(balancePromises);
    const result = balanceValues.reduce((acc, { asset, balance }: any) => {
      if (balance && BigInt(balance[0]) > 0) {
        acc[asset] = this.convertBalanceToStrings(balance);
      }
      return acc;
    }, {});

    return result;
  }

  async getAaveBalance(
    assetAddress: string,
    chainId: string,
    userAddress: string,
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const address = aaveConfig[chainId].poolDataProvider;
      const contract = new ethers.Contract(
        address,
        AAVE_DATA_PROVIDER_ABI,
        provider,
      );
      const reserveData = await contract.getUserReserveData(
        assetAddress,
        userAddress,
      );
      return reserveData;
    } catch (error) {
      this.balanceLogger.error(
        `while getting total user ${userAddress} Aave bal on chainId ${chainId} of asset ${assetAddress} ${error}`,
      );
      return null;
    }
  }

  async getZerolendBalance(
    assetAddress: string,
    chainId: string,
    userAddress: string,
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const address = zerolendConfig[chainId].poolDataProvider;
      const contract = new ethers.Contract(
        address,
        ZEROLEND_DATA_PROVIDER_ABI,
        provider,
      );
      const reserveData = await contract.getUserReserveData(
        assetAddress,
        userAddress,
      );
      return reserveData;
    } catch (error) {
      this.balanceLogger.error(
        `while getting total user ${userAddress} Aave bal on chainId ${chainId} of asset ${assetAddress} ${error}`,
      );
      return null;
    }
  }

  async getSeamlessBalance(
    assetAddress: string,
    chainId: string,
    userAddress: string,
  ) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const address = seamlessConfig[chainId].poolDataProvider;
      const contract = new ethers.Contract(
        address,
        SEAMLESS_DATA_PROVIDER_ABI,
        provider,
      );
      const reserveData = await contract.getUserReserveData(
        assetAddress,
        userAddress,
      );
      return reserveData;
    } catch (error) {
      this.balanceLogger.error(
        `while getting total user ${userAddress} Aave bal on chainId ${chainId} of asset ${assetAddress} ${error}`,
      );
      return null;
    }
  }

  private calculateTotal(balances: any[], index: number) {
    let total = BigInt(0);

    balances.forEach((balance) => {
      total += BigInt(balance[index]);
    });

    return total.toString();
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
