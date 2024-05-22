import { Module } from '@nestjs/common';
import { ApyService } from './apy.service';
import { ApyController } from './apy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asset, AssetSchema } from '../asset/asset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],
  controllers: [ApyController],
  providers: [ApyService],
})
export class ApyModule {}
