export type HookArgs = {
  fundToken?: string;
  fundAmount?: string;
  contracts: {
    target: string;
    params: Array<string | number>;
  }[];
};

export type HookBuilderArgs = {
  fundToken: string;
  fundAmount: string;
  description: string;
  calls: {
    target: string;
    callData: string;
    estimatedGas?: string;
  }[];
};
