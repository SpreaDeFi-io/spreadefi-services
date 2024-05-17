import { Injectable } from '@nestjs/common';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async createAsset(createAssetDto: CreateAssetDto) {
    const assetId = this.generateAssetId(createAssetDto);

    const asset = {
      assetId,
      ...createAssetDto,
    };

    const data = await this.assetRepository.createAsset(asset);

    return data;
  }

  private generateAssetId(createAssetDto: CreateAssetDto) {
    const assetId =
      createAssetDto.protocolName +
      '-' +
      createAssetDto.assetSymbol +
      '-' +
      createAssetDto.chainId;

    return assetId;
  }
}
