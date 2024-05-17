export type StrategyArgs = {
  fundToken: string;
  fundAmount: string;
  contracts: {
    target: string;
    params: Array<string | number>;
  }[];
};
