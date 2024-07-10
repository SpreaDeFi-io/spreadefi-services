import { ApiProperty } from '@nestjs/swagger';
import { ScoutResponse } from 'src/common/interfaces/scout-response.interface';
import { BalanceListResponse } from 'src/common/types/balance';

export class BalanceResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Fetched all assets balance of this address successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: [
      {
        assetAddress: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
        protocolName: 'Aave',
        chainId: '10',
        currentATokenBalance: '10000000',
        currentStableDebt: '0',
        currentVariableDebt: '1232334',
      },
    ],
  })
  data: BalanceListResponse;
}

export class SpecificProtocolBalanceResponseDto implements ScoutResponse {
  @ApiProperty({
    description: 'Response status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example:
      'Fetched all assets balance of a specific chain of a protocol successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
    example: {
      filteredBalances: [
        {
          asset: {
            points: [],
            _id: '664734fe953fc462e9535d64',
            assetId: 'Aave-WETH-10',
            protocolName: 'Aave',
            chainId: '10',
            assetName: 'Wrapped Ether',
            assetSymbol: 'WETH',
            assetAddress: '0x4200000000000000000000000000000000000006',
            createdAt: '2024-05-17T10:44:14.707Z',
            updatedAt: '2024-07-04T12:31:10.231Z',
            __v: 0,
            protocolType: 'Lending',
            assetSupplyApy: 1.5088122770908226,
            assetSupplyBoostedApy: 0,
            assetBorrowApy: 2.307643776993542,
          },
          currentATokenBalance: '0',
          currentStableDebt: '0',
          currentVariableDebt: '15845011664377910762',
        },
      ],
      supplied: [
        {
          asset: {
            points: [],
            _id: '6647267ac3ad53f41c05cfce',
            protocolName: 'Aave',
            chainId: '42161',
            assetName: 'Wrapped BTC',
            assetSymbol: 'WBTC',
            assetAddress: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
            createdAt: '2024-05-17T09:42:18.288Z',
            updatedAt: '2024-07-10T04:00:00.844Z',
            __v: 0,
            assetId: 'Aave-WBTC-42161',
            protocolType: 'Lending',
            assetSupplyApy: 0.030620580018151967,
            assetSupplyBoostedApy: 0,
            assetBorrowApy: 0.5832912367491518,
          },
          currentATokenBalance: '45551479',
          currentStableDebt: '0',
          currentVariableDebt: '0',
        },
      ],
      borrowed: [
        {
          asset: {
            points: [],
            _id: '664734fe953fc462e9535d64',
            assetId: 'Aave-WETH-10',
            protocolName: 'Aave',
            chainId: '10',
            assetName: 'Wrapped Ether',
            assetSymbol: 'WETH',
            assetAddress: '0x4200000000000000000000000000000000000006',
            createdAt: '2024-05-17T10:44:14.707Z',
            updatedAt: '2024-07-04T12:31:10.231Z',
            __v: 0,
            protocolType: 'Lending',
            assetSupplyApy: 1.5088122770908226,
            assetSupplyBoostedApy: 0,
            assetBorrowApy: 2.307643776993542,
          },
          currentATokenBalance: '0',
          currentStableDebt: '0',
          currentVariableDebt: '15845011664377910762',
        },
      ],
      assets: [
        {
          points: [],
          _id: '664734d6953fc462e9535d62',
          assetId: 'Aave-USDC-10',
          protocolName: 'Aave',
          chainId: '10',
          assetName: 'USD Coin',
          assetSymbol: 'USDC',
          assetAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
          createdAt: '2024-05-17T10:43:34.853Z',
          updatedAt: '2024-07-04T12:31:10.231Z',
          __v: 0,
          protocolType: 'Lending',
          assetSupplyApy: 6.1206285403630405,
          assetSupplyBoostedApy: 3.27,
          assetBorrowApy: 8.24663469433511,
        },
      ],
      chainBalanceData: {
        '0x078f358208685046a11c85e8ad32895ded33a249': '$26,442.37',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': '$49.03',
        '0xaf88d065e77c8cc2239327c5edb3a432268e5831': '$6.70',
      },
    },
  })
  data: BalanceListResponse;
}
