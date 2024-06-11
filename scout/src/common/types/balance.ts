export type BalanceListResponse = Array<{
  assetAddress: string;
  protocolName: string;
  chainId: string;
  currentATokenBalance: string;
  currentStableDebt: string;
  currentVariableDebt: string;
}>;
