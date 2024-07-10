import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { AssetModule } from '../../asset/asset.module';
import { BalanceLogger } from './balance.logger';
import { Asset, AssetSchema } from '../../asset/asset.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CovalentModule } from 'src/libs/covalent/covalent.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    AssetModule,
    CovalentModule.register(),
  ],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceLogger],
  exports: [BalanceService],
})
export class BalanceModule {}
