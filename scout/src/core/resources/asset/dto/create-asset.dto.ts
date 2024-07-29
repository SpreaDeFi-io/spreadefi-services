import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProtocolType } from '../asset.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Name of the protocol',
    example: 'Aave',
  })
  @IsString()
  @IsNotEmpty()
  protocolName: string;

  @ApiProperty({
    description: 'Type of the protocol',
    enum: ProtocolType,
  })
  @IsString()
  @IsEnum(ProtocolType)
  @IsNotEmpty()
  protocolType: ProtocolType;

  @ApiProperty({
    description: 'Chain ID',
    example: '42161',
  })
  @IsString()
  @IsNotEmpty()
  chainId: string;

  @ApiProperty({
    description: 'Name of the token',
    example: 'Wrapped Ether',
  })
  @IsString()
  @IsNotEmpty()
  assetName: string;

  @ApiProperty({
    description: 'Symbol of the token',
    example: 'WETH',
  })
  @IsString()
  @IsNotEmpty()
  assetSymbol: string;

  @ApiProperty({
    description: 'Address of the token',
    example: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  })
  @IsString()
  @IsNotEmpty()
  assetAddress: string;

  @ApiProperty({
    description: 'Decimals of the token',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  assetDecimals: number;
}
