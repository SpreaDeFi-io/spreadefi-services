import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { AssetModule } from '../../asset/asset.module';
import { BalanceLogger } from './balance.logger';
import { Asset, AssetSchema } from '../../asset/asset.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CovalentService } from 'src/libs/covalent/covalent.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    AssetModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceLogger, CovalentService],
  exports: [BalanceService],
})
export class BalanceModule {}
