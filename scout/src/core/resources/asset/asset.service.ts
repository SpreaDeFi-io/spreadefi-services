import { Injectable } from '@nestjs/common';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';
import { ProtocolType } from './asset.schema';
import { loopingConfig } from 'src/common/constants/config/looping';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async getAssets() {
    const data = await this.assetRepository.getAssets();

    return data;
  }

  async getAssetBySymbol(symbol: string) {
    const data = await this.assetRepository.getAssetBySymbol(symbol);

    return data;
  }
  async getAssetByProtocolType(protocolType: string) {
    const data =
      await this.assetRepository.getAssetByProtocolType(protocolType);

    if ((protocolType = ProtocolType.LOOPING)) {
      const dataWithLeverage = data.map((d) => {
        const leverage =
          loopingConfig[d.protocolName][d.chainId][d.assetAddress].leverage;

        return {
          ...d,
          leverage,
        };
      });
      return dataWithLeverage;
    }

    return data;
  }

  async getFilteredAssets(
    excludeProtocol: string,
    includeProtocolType: string,
  ) {
    console.log('aaa', excludeProtocol, includeProtocolType);
    const data = await this.assetRepository.getFilteredAssets(
      excludeProtocol,
      includeProtocolType,
    );

    return data;
  }

  async getAssetById(id: string) {
    const data = await this.assetRepository.getAssetById(id);

    return data;
  }

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
