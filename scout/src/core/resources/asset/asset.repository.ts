import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset } from './asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';
import { TGetAssetListResponse } from 'src/common/types/asset';

@Injectable()
export class AssetRepository {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}

  async getAssets() {
    const data: Array<TGetAssetListResponse> = await this.assetModel.aggregate([
      {
        $group: {
          _id: { assetSymbol: '$assetSymbol', protocolType: '$protocolType' },
          points: { $addToSet: '$points' },
          chainIds: { $addToSet: '$chainId' },
          protocolNames: { $addToSet: '$protocolName' },
          assetSupplyApys: { $addToSet: '$assetSupplyApy' },
          assetSupplyBoostedApys: { $addToSet: '$assetSupplyBoostedApy' },
        },
      },
      {
        $project: {
          _id: 0,
          assetSymbol: '$_id.assetSymbol',
          protocolType: '$_id.protocolType',
          chainIds: 1,
          protocolNames: 1,
          assetSupplyApys: 1,
          assetSupplyBoostedApys: 1,
          points: 1,
        },
      },
      {
        $addFields: {
          assetSupplyApys: {
            $sortArray: { input: '$assetSupplyApys', sortBy: 1 },
          },
          assetSupplyBoostedApys: {
            $sortArray: { input: '$assetSupplyBoostedApys', sortBy: 1 },
          },
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
