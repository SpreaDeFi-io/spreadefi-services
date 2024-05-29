import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetModule } from './core/resources/asset/asset.module';
import { ApyModule } from './core/resources/apy/apy.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BalanceModule } from './core/resources/user/balance/balance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ??
          'mongodb://localhost:27017/spreadefi',
      }),
    }),
    ScheduleModule.forRoot(),
    AssetModule,
    ApyModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
