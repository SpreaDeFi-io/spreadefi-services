import { ProtocolType } from 'src/core/resources/asset/asset.schema';

export type TGetAssetListResponse = {
  points: Array<Array<string>>;
  chainIds: Array<string>;
  protocolNames: Array<string>;
  assetSupplyApys: Array<number>;
  assetSupplyBoostedApys: Array<number>;
  assetSymbol: string;
  protocolType: ProtocolType;
};

export type GetAssetBySymbolListResponse = Array<{
  _id: string;
  assetId: string;
  protocolName: string;
  chainId: string;
  assetName: string;
  assetSymbol: string;
  assetAddress: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  protocolType: string;
  assetSupplyApy: number;
  assetSupplyBoostedApy: number;
  assetBorrowApy: number;
  assetBorrowBoostedApy: number;
  points: Array<string>;
}>;

export type GetAssetByIdResponse = {
  _id: string;
  assetId: string;
  protocolName: string;
  chainId: string;
  assetName: string;
  assetSymbol: string;
  assetAddress: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  protocolType: string;
  assetSupplyApy: number;
  assetSupplyBoostedApy: number;
  assetBorrowApy: number;
  assetBorrowBoostedApy: number;
  points: Array<string>;
};
