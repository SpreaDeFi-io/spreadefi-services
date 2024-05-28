import { Module } from '@nestjs/common';
import { ApyService } from './apy.service';
import { ApyController } from './apy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from '../asset/asset.schema';
import { AssetModule } from '../asset/asset.module';
import { ApyLogger } from './apy.logger';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    AssetModule,
  ],
  controllers: [ApyController],
  providers: [ApyService, ApyLogger],
  exports: [ApyService],
})
export class ApyModule {}
