import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
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

  @IsNumber()
  @IsOptional()
  @IsEnum([3, 6])
  leverage?: number; //* looping strategy leverage
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
