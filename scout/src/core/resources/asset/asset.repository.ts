import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset } from './asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';

@Injectable()
export class AssetRepository {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

  async getAssets() {
    const data = await this.assetModel.aggregate([
      {
        $group: {
          _id: '$assetSymbol',
          chainIds: { $addToSet: '$chainId' },
          protocolNames: { $addToSet: '$protocolName' },
          assetApys: { $addToSet: '$assetApy' },
          boostedApys: { $addToSet: '$boostedApy' },
        },
      },
      {
        $project: {
          _id: 0,
          assetSymbol: '$_id',
          chainIds: 1,
          protocolNames: 1,
          assetApys: 1,
          boostedApys: 1,
        },
      },
      {
        $addFields: {
          assetApys: { $sortArray: { input: '$assetApys', sortBy: 1 } },
          boostedApys: { $sortArray: { input: '$boostedApys', sortBy: 1 } },
        },
      },
    ]);

    return data;
  }

  async getAssetBySymbol(symbol: string) {
    const data = await this.assetModel.find({ assetSymbol: symbol });

    if (data.length === 0) throw new NotFoundException('No asset found');

    return data;
  }

  async getAssetById(id: string) {
    const data = await this.assetModel.findOne({ assetId: id });

    if (!data) throw new NotFoundException('No asset found');

    return data;
  }

  createAsset(asset: CreateAssetDto & { assetId: string }) {
    const newAsset = new this.assetModel(asset);

    return newAsset.save();
  }
}
