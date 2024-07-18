import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Asset, ProtocolType } from './asset.schema';
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
          assetSupplyApys: { $push: '$assetSupplyApy' },
          assetSupplyBoostedApys: { $push: '$assetSupplyBoostedApy' },
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
          totalApys: {
            $map: {
              input: { $range: [0, { $size: '$assetSupplyApys' }] },
              as: 'idx',
              in: {
                $add: [
                  { $arrayElemAt: ['$assetSupplyApys', '$$idx'] },
                  { $arrayElemAt: ['$assetSupplyBoostedApys', '$$idx'] },
                ],
              },
            },
          },
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
          totalApys: {
            $sortArray: { input: '$totalApys', sortBy: 1 },
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

  async getAssetByProtocolType(protocolType: string) {
    const data = await this.assetModel.find({ protocolType }).lean();

    if (data.length === 0) throw new NotFoundException('No assets found');

    return data;
  }

  async getAssetById(id: string) {
    const data = await this.assetModel.findOne({ assetId: id });

    if (!data) throw new NotFoundException('No asset found');

    return data;
  }

  async getFilteredAssets(
    excludeProtocol: string,
    includeProtocolType: string,
  ) {
    let query = {};

    if (excludeProtocol) {
      query = {
        ...query,
        protocolName: { $ne: excludeProtocol },
      };
    }

    if (includeProtocolType) {
      query = {
        ...query,
        protocolType: includeProtocolType,
      };
    }

    const data = await this.assetModel.find(query);

    return data;
  }

  createAsset(asset: CreateAssetDto & { assetId: string }) {
    const newAsset = new this.assetModel(asset);

    return newAsset.save();
  }

  async isAssetSupported(
    protocolName: string,
    chainId: string,
    assetAddress: string,
    type: ProtocolType,
  ) {
    const asset = await this.assetModel.findOne({
      protocolName,
      chainId,
      assetAddress,
      protocolType: type,
    });

    return asset ? true : false;
  }
}
