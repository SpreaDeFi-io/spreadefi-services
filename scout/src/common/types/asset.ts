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
