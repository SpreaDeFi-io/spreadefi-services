import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';
import { CreateAssetDto } from 'src/core/resources/asset/dto/create-asset.dto';
import { ProtocolType } from './asset.schema';
import { loopingConfig } from 'src/common/constants/config/looping';
import { getAddress } from 'ethers';
import { chainToChainIdPortals, PORTALS_URL } from 'src/common/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly configService: ConfigService,
  ) {}

  async getAssets() {
    const data = await this.assetRepository.getAssets();

    return data;
  }

  async getAssetBySymbol(symbol: string) {
    const data = await this.assetRepository.getAssetBySymbol(
      decodeURIComponent(symbol),
    );

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

  async createPortalsAsset(network: string, platform: string) {
    const data = await fetch(
      `${PORTALS_URL}/tokens?networks=${network}&platforms=${platform}`,
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
        },
      },
    );

    const response = await data.json();

    if (data.status !== 200)
      throw new InternalServerErrorException('Failed to fetch tokens');

    const assets = response.tokens.map((token) => {
      const tokenData = {
        protocolName: platform,
        protocolType: ProtocolType.YIELD,
        chainId: chainToChainIdPortals[network],
        assetName: token.name,
        assetSymbol: token.symbol,
        assetAddress: getAddress(token.address),
        assetDecimals: token.decimals,
      };

      const assetId = this.generateAssetId(tokenData);

      const asset = {
        assetId,
        ...tokenData,
      };

      return asset;
    });

    const assetData = await this.assetRepository.createAssets(assets);

    return assetData;
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
