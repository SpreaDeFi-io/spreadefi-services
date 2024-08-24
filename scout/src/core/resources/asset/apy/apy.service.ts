import { Model } from 'mongoose';
import { ApyLogger } from './apy.logger';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Asset } from '../../asset/asset.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ethers } from 'ethers';
import {
  chainIdToChainPortals,
  chainToChainId,
  chainToChainIdPortals,
  DEFI_LLAMA_POOLS,
  DEFI_LLAMA_URI,
  PORTALS_PLATFORMS,
  PORTALS_URL,
  RPC_URLS,
} from 'src/common/constants';
import { aaveConfig } from 'src/common/constants/config/aave';
import {
  AAVE_POOL_ABI,
  SEAMLESS_POOL_ABI,
  ZEROLEND_POOL_ABI,
} from 'src/common/constants/abi';
import { seamlessConfig } from 'src/common/constants/config/seamless';
import { zerolendConfig } from 'src/common/constants/config/zerolend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApyService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private readonly apyLogger: ApyLogger,
    private readonly configService: ConfigService,
  ) {}

  async updateApy() {
    const assets = await this.assetModel.find();
    const apyPromises = assets.map((asset) => {
      if (asset.protocolName == 'Aave') {
        return this.getAaveApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Zerolend') {
        return this.getZerolendApy(asset.assetAddress, asset.chainId);
      } else if (asset.protocolName == 'Seamless') {
        return this.getSeamlessApy(asset.assetAddress, asset.chainId);
      }
    });

    const apyValues = await Promise.all(apyPromises);

    //* apy value may return null if rpc is down for some reason, filter the null values
    const bulkOperations = assets
      .map((asset, index) => {
        const apyValue = apyValues[index];
        if (
          apyValue &&
          apyValue.supplyApy !== null &&
          apyValue.borrowApy !== null
        ) {
          return {
            updateOne: {
              filter: { assetId: asset.assetId },
              update: {
                $set: {
                  assetSupplyApy: apyValue.supplyApy,
                  assetBorrowApy: apyValue.borrowApy,
                },
              },
            },
          };
        }
        return null;
      })
      .filter((op) => op !== null);

    if (bulkOperations.length > 0) {
      const data = await this.assetModel.bulkWrite(bulkOperations);
      this.apyLogger.log('Successfully updated APY');

      return data;
    } else {
      this.apyLogger.log('No APY values to updated');

      return null;
    }
  }

  async updateHopBeefyApy() {
    const apyOfTokens = await this.getHopBeefyApy();

    const bulkOperations = apyOfTokens.map((token) => ({
      updateOne: {
        filter: {
          chainId: token.chainId,
          assetSymbol: { $regex: new RegExp(`^${token.symbol}$`, 'i') },
          protocolName: 'Hop Beefy',
        },
        update: { $set: { assetSupplyApy: token.apy } },
      },
    }));

    if (bulkOperations.length > 0) {
      const data = await this.assetModel.bulkWrite(bulkOperations);
      this.apyLogger.log('Successfully updated APY');

      return data;
    } else {
      this.apyLogger.log('No APY values to updated');

      return null;
    }
  }

  async upadtePortalsApy() {
    const assets = await this.assetModel.find({}).lean();

    const portalAssets = assets.filter(
      (asset) => PORTALS_PLATFORMS.includes(asset.protocolName) && asset,
    );

    const portalAssetsIds = portalAssets.map(
      (asset) =>
        chainIdToChainPortals[asset.chainId] + '%3A' + asset.assetAddress,
    );

    const tokens = await this.getPortalsApy(portalAssetsIds);

    const bulkOperations = tokens.map((token) => ({
      updateOne: {
        filter: {
          chainId: chainToChainIdPortals[token.network],
          assetSymbol: { $regex: new RegExp(`^${token.symbol}$`, 'i') },
          protocolName: token.platform,
          assetAddress: { $regex: new RegExp(`^${token.address}$`, 'i') },
        },
        update: { $set: { assetSupplyApy: token.metrics.apy } },
      },
    }));

    if (bulkOperations.length > 0) {
      const data = await this.assetModel.bulkWrite(bulkOperations);
      this.apyLogger.log('Successfully updated APY');

      return data;
    } else {
      this.apyLogger.log('No APY values to updated');

      return null;
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS) // Adjust the cron expression as needed
  async updateApyCron() {
    try {
      await this.updateApy();
      this.apyLogger.log('[CRON] - APY updated successfully');
    } catch (error) {
      this.apyLogger.error(`[CRON] - APY updation failed: ${error}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM) //Adjust the cron expression as needed
  async updateHopBeefyApyCron() {
    try {
      await this.updateHopBeefyApy();
      this.apyLogger.log('[CRON] - APY updated successfully for Hop');
    } catch (error) {
      this.apyLogger.error(`[CRON] - APY updation failed for Hop: ${error}`);
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS) //Adjust the cron expression as needed
  async updatePortalsApyCron() {
    try {
      await this.upadtePortalsApy();
      this.apyLogger.log('[CRON] - APY updated successfully for Portals');
    } catch (error) {
      this.apyLogger.error(
        `[CRON] - APY updation failed for Portals: ${error}`,
      );
    }
  }

  async getAaveApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const aaveAddress = aaveConfig[chainId].poolAddress;
      const aaveContract = new ethers.Contract(
        aaveAddress,
        AAVE_POOL_ABI,
        provider,
      );
      const reserveData = await aaveContract.getReserveData(assetAddress);
      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `getting Aave apy on chainId ${chainId} of asset ${assetAddress} ${error}`,
      );
      return null;
    }
  }

  async getSeamlessApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const contractAddress = seamlessConfig[chainId].poolAddress;

      const contract = new ethers.Contract(
        contractAddress,
        SEAMLESS_POOL_ABI,
        provider,
      );

      const reserveData = await contract.getReserveData(assetAddress);

      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `Error getting Seamless apy on chainId ${chainId} of asset ${assetAddress} : ${error}`,
      );
      return null;
    }
  }

  async getZerolendApy(assetAddress: string, chainId: string) {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URLS[chainId]);
      const contractAddress = zerolendConfig[chainId].poolAddress;
      const contract = new ethers.Contract(
        contractAddress,
        ZEROLEND_POOL_ABI,
        provider,
      );
      const reserveData = await contract.getReserveData(assetAddress);
      const liquidityRateRay: bigint = reserveData[2];
      const borrowRateRay: bigint = reserveData[4];

      const supplyApy = Number(liquidityRateRay) / 1e25;
      const borrowApy = Number(borrowRateRay) / 1e25;

      return { supplyApy, borrowApy };
    } catch (error) {
      this.apyLogger.error(
        `Error getting Zerolend apy on chainId ${chainId} of asset ${assetAddress} : ${error}`,
      );
      return null;
    }
  }

  async getHopBeefyApy() {
    const response = await fetch(`${DEFI_LLAMA_URI}/pools`);

    const data = await response.json();

    if (data.status !== 'success')
      throw new InternalServerErrorException('Defi Llama API call failed!');

    const hopBeefyPoolsData = data.data.filter((poolData) =>
      DEFI_LLAMA_POOLS.some((poolInfo) => poolInfo.pool === poolData.pool),
    );

    const formattedInfo = hopBeefyPoolsData.map((data) => {
      return {
        ...data,
        chainId: chainToChainId[data.chain],
      };
    });

    return formattedInfo;
  }

  //!they also have a paging problem so figure that out as well
  //!max paging limit is 250 -> so we can handle the rest later
  async getPortalsApy(assetIds: Array<string>) {
    const ids = assetIds.join('%2C');

    //!add types later
    const data = await fetch(`${PORTALS_URL}/tokens?ids=${ids}&limit=250`, {
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('PORTALS_BEARER_TOKEN')}`,
      },
    });

    const response = await data.json();

    if (data.status !== 200)
      throw new InternalServerErrorException('API call failed!');

    return response.tokens;
  }
}
