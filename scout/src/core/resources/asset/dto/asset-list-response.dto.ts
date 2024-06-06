import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { TGetAssetListResponse } from 'src/common/types/asset';

export class AssetListResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched asset successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data: TGetAssetListResponse; //!it should be a class only
}
