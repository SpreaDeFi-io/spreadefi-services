import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Asset } from '../asset/asset.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApyService {
  constructor(@InjectModel(Asset.name) private assetModel: Model<Asset>) {}
}
