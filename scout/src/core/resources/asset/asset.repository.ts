import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset } from './asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';

@Injectable()
export class AssetRepository {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

  createAsset(createAssetDto: CreateAssetDto) {
    const newAsset = new this.assetModel(createAssetDto);

    return newAsset.save();
  }
}
