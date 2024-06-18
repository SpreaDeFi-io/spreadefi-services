import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from './asset.schema';
import { AssetRepository } from 'src/core/resources/asset/asset.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],
  providers: [AssetService, AssetRepository],
  exports: [AssetService, AssetRepository],
})
export class AssetModule {}
