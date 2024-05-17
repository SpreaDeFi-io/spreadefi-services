import { Injectable } from '@nestjs/common';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async createAsset(createAssetDto: CreateAssetDto) {
    const data = await this.assetRepository.createAsset(createAssetDto);

    return data;
  }
}
