import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionModule } from './core/resources/quote/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PortalsModule } from './core/resources/portals/portals.module';
import { EnsoModule } from './core/resources/enso/enso.module';

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
    TransactionModule,
    PortalsModule,
    EnsoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
