import { Model } from 'mongoose';
import { ApyLogger } from './apy.logger';
import { Injectable } from '@nestjs/common';
import { Asset } from '../asset/asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import getAaveApy from 'src/common/utils/apy/aave';
import { Cron, CronExpression } from '@nestjs/schedule';
import getZerolendApy from 'src/common/utils/apy/zerolend';
import getSeamlessApy from 'src/common/utils/apy/seamless';

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
        return getAaveApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Zerolend') {
        return getZerolendApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Seamless') {
        return getSeamlessApy(asset.assetAddress, asset.chainId);
      }
    });

    const apyValues = await Promise.all(apyPromises);

    //* apy value may return null if rpc is down for some reason, filter the null values
    const bulkOperations = assets
      .map((asset, index) => {
        const assetApy = apyValues[index];
        if (assetApy !== null) {
          return {
            updateOne: {
              filter: { assetId: asset.assetId },
              update: { $set: { assetApy } },
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
}
