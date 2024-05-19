import { StrategyArgs } from './strategy';

export type TransactionData = {
  protocolName: string;
  action: string;
  txData: StrategyArgs;
};
