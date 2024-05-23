import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '../asset/asset.schema';
import { Model } from 'mongoose';
import getAaveApy from 'src/common/utils/aave-apy';

@Injectable()
export class ApyService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

  async updateApy() {
    const assets = await this.assetModel.find();
    for (const asset of assets) {
      if (asset.protocolName == 'Aave') {
        const assetApy = await getAaveApy(asset.assetAddress, asset.chainId);
        await this.assetModel.updateOne(
          { assetId: asset.assetId },
          { $set: { assetApy } },
        );
      }
    }
  }
}
