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
  async getAssetBalance(address: string, assetSymbol: string) {
    const assets = await this.assetModel.find({ assetSymbol: assetSymbol });

    const balancePromises = assets.map((asset) => {
      if (asset.protocolName == 'Aave') {
        return this.getAaveBalance(asset.assetAddress, asset.chainId, address);
      } else if (asset.protocolName == 'Zerolend') {
        return this.getZerolendBalance(
          asset.assetAddress,
          asset.chainId,
          address,
        );
      } else if (asset.protocolName == 'Seamless') {
        return this.getSeamlessBalance(
          asset.assetAddress,
          asset.chainId,
          address,
        );
      }
    });

    const balanceValues = await Promise.all(balancePromises);

    const totalBalance = this.calculateTotal(balanceValues, 0);

    return {
      totalBalance,
    };
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
}
