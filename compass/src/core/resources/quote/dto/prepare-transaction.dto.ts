import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CreateSquidQuoteDto } from './create-squid-quote.dto';
import { Type } from 'class-transformer';
import { StrategyName, Action } from 'src/common/types';

export class TransactionDetailsDto extends CreateSquidQuoteDto {
  @IsString()
  @Length(42, 42)
  @IsOptional()
  fundToken?: string;

  @IsString()
  @IsOptional()
  fundAmount?: string;
}

export class PrepareTransactionDto {
  @IsEnum(StrategyName)
  @IsString()
  @IsNotEmpty()
  strategyName: StrategyName;

  @IsEnum(Action)
  @IsString()
  @IsNotEmpty()
  action: Action;

  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDetailsDto)
  @IsNotEmpty()
  txDetails: TransactionDetailsDto;
}
