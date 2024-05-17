export type HookArgs = {
  fundToken: string;
  fundAmount: string;
  description: string;
  calls: {
    target: string;
    callData: string;
    estimatedGas?: string;
  }[];
};
