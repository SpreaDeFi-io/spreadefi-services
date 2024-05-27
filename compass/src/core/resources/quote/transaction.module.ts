import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SquidModule } from 'src/libs/squid/squid.module';
import { AaveModule } from 'src/libs/strategies/aave/aave.module';
import { SeamlessModule } from 'src/libs/strategies/seamless/seamless.module';
import { ZerolendModule } from 'src/libs/strategies/zerolend/zerolend.module';
import { AaveSeamlessModule } from 'src/libs/strategies/aave-seamless/aave-seamless.module';
import { AaveZerolendModule } from 'src/libs/strategies/aave-zerolend/aave-zerolend.module';

@Module({
  imports: [
    SquidModule.register(),
    AaveModule.register(),
    ZerolendModule.register(),
    SeamlessModule.register(),
    AaveSeamlessModule.register(),
    AaveZerolendModule.register(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
