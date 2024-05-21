import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { SquidModule } from 'src/libs/squid/squid.module';
import { AaveModule } from 'src/libs/strategies/aave/aave.module';
import { SeamlessModule } from 'src/libs/strategies/seamless/seamless.module';

@Module({
  imports: [
    SquidModule.register(),
    AaveModule.register(),
    SeamlessModule.register(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
