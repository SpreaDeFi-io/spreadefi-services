import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSquidQuoteDto {
  @IsString()
  @IsNotEmpty()
  fromChain: string;

  @IsString()
  @IsNotEmpty()
  fromAmount: string;

  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  fromToken: string;

  @IsString()
  @IsNotEmpty()
  toChain: string;

  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  toToken: string;

  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  fromAddress: string;

  @IsString()
  @Length(42, 42)
  @IsNotEmpty()
  toAddress: string;
}
