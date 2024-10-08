import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssetDocument = HydratedDocument<Asset>;

export enum ProtocolType {
  LENDING = 'Lending',
  YIELD = 'Yield',
  LOOPING = 'Looping',
}

@Schema({
  timestamps: true,
})
export class Asset {
  @Prop({
    type: String,
    required: true,
  })
  assetId: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  protocolName: string;

  @Prop({
    type: String,
    enum: ProtocolType,
    required: true,
  })
  protocolType: ProtocolType;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  chainId: string;

  @Prop({
    type: String,
    required: true,
  })
  assetName: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  assetSymbol: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  assetAddress: string;

  @Prop({
    type: Number,
    required: true,
  })
  assetDecimals: number;

  @Prop({
    type: Number,
    default: 0,
  })
  assetSupplyApy: number;

  @Prop({
    type: Number,
    default: 0,
  })
  assetSupplyBoostedApy?: number;

  @Prop({
    type: Number,
  })
  assetBorrowApy?: number;

  @Prop({
    type: Number,
  })
  assetBorrowBoostedApy?: number;

  @Prop({
    type: [String],
  })
  points?: string[];
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
