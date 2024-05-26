import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProtocolType } from '../asset.schema';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  protocolName: string;

  @IsString()
  @IsEnum(ProtocolType)
  @IsNotEmpty()
  protocolType: ProtocolType;

  @IsString()
  @IsNotEmpty()
  chainId: string;

  @IsString()
  @IsNotEmpty()
  assetName: string;

  @IsString()
  @IsNotEmpty()
  assetSymbol: string;

  @IsString()
  @IsNotEmpty()
  assetAddress: string;
}
