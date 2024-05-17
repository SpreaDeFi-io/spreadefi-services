import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset } from './asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';

@Injectable()
export class AssetRepository {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

  createAsset(asset: CreateAssetDto & { assetId: string }) {
    const newAsset = new this.assetModel(asset);

    return newAsset.save();
  }
}
