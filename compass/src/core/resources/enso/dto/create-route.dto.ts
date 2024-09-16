import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  sender: string;

  @IsString()
  chainId: string;

  @IsString()
  receiver: string;

  @IsString()
  inputToken: string;

  @IsString()
  inputAmount: string;

  @IsString()
  outputToken: string;

  @IsBoolean()
  toEOA: boolean;

  @IsNumber()
  @IsOptional()
  slippage?: number;
}
