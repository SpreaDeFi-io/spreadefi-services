import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Asset } from '../asset/asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import getAaveApy from 'src/common/utils/apy/aave';
import getZerolendApy from 'src/common/utils/apy/zerolend';
import getSeamlessApy from 'src/common/utils/apy/seamless';

@Injectable()
export class ApyService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

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
      await this.assetModel.bulkWrite(bulkOperations);
      console.log('APY values updated successfully');
    } else {
      console.log('No APY values to update');
    }
  }
}
