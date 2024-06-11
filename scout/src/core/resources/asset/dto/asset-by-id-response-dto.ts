import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { GetAssetByIdResponse } from 'src/common/types/asset';

export class AssetByIdResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched asset successfully by id',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      _id: '664f1aeefea8f9c7fd567056',
      assetId: 'Zerolend-WETH-59144',
      protocolName: 'Zerolend',
      chainId: '59144',
      assetName: 'Wrapped Ether',
      assetSymbol: 'WETH',
      assetAddress: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
      createdAt: '2024-05-23T10:31:10.982Z',
      updatedAt: '2024-06-07T12:32:50.325Z',
      __v: 0,
      protocolType: 'Lending',
      assetSupplyApy: 2.703240476393604,
      assetSupplyBoostedApy: 0.77,
      assetBorrowApy: 3.9876577795770283,
      assetBorrowBoostedApy: 5.35,
      points: ['2x ZERO Gravity Points', '1x LXP-L Points', '1x Turtle Points'],
    },
  })
  data: GetAssetByIdResponse;
}
