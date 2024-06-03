import { Model } from 'mongoose';
import { ApyLogger } from './apy.logger';
import { Injectable } from '@nestjs/common';
import { Asset } from '../../asset/asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import { RPC_URLS } from 'src/common/constants';
import { aaveConfig } from 'src/common/constants/config/aave';
import {
  AAVE_POOL_ABI,
  SEAMLESS_POOL_ABI,
  ZEROLEND_POOL_ABI,
} from 'src/common/constants/abi';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { zerolendConfig } from 'src/common/constants/config/zerolend';

@Injectable()
export class ApyService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private readonly apyLogger: ApyLogger,
  ) {}

  async updateApy() {
    const assets = await this.assetModel.find();
    const apyPromises = assets.map((asset) => {
      if (asset.protocolName == 'Aave') {
        return this.getAaveApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Zerolend') {
        return this.getZerolendApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Seamless') {
        return this.getSeamlessApy(asset.assetAddress, asset.chainId);
      }
    });

    const apyValues = await Promise.all(apyPromises);

    //* apy value may return null if rpc is down for some reason, filter the null values
    const bulkOperations = assets
      .map((asset, index) => {
        const { supplyApy, borrowApy } = apyValues[index];
        if (supplyApy !== null && borrowApy !== null) {
          return {
            updateOne: {
              filter: { assetId: asset.assetId },
              update: {
                $set: { assetSupplyApy: supplyApy, assetBorrowApy: borrowApy },
              },
            },
          };
        }
        return null;
      })
      .filter((op) => op !== null);

    if (bulkOperations.length > 0) {
      const data = await this.assetModel.bulkWrite(bulkOperations);
      this.apyLogger.log('Successfully updated APY');

      return data;
    } else {
      this.apyLogger.log('No APY values to updated');

      return null;
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS) // Adjust the cron expression as needed
  async updateApyCron() {
    try {
      await this.updateApy();
      this.apyLogger.log('[CRON] - APY updated successfully');
    } catch (error) {
      this.apyLogger.error(`[CRON] - APY updation failed: ${error}`);
    }
  }

  async getAaveApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const aaveAddress = aaveConfig[chainId].poolAddress;
      const aaveContract = new ethers.Contract(
        aaveAddress,
        AAVE_POOL_ABI,
        provider,
      );
      const reserveData = await aaveContract.getReserveData(assetAddress);
      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `getting Aave apy on chainId ${chainId} of asset ${assetAddress} ${error}`,
      );
      return null;
    }
  }

  async getSeamlessApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const contractAddress = seamlessConfig[chainId].poolAddress;

      const contract = new ethers.Contract(
        contractAddress,
        SEAMLESS_POOL_ABI,
        provider,
      );

      const reserveData = await contract.getReserveData(assetAddress);

      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `Error getting Seamless apy on chainId ${chainId} of asset ${assetAddress} : ${error}`,
      );
      return null;
    }
  }

  async getZerolendApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const contractAddress = zerolendConfig[chainId].poolAddress;
      const contract = new ethers.Contract(
        contractAddress,
        ZEROLEND_POOL_ABI,
        provider,
      );
      const reserveData = await contract.getReserveData(assetAddress);
      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `Error getting Zerolend apy on chainId ${chainId} of asset ${assetAddress} : ${error}`,
      );
      return null;
    }
  }
}
