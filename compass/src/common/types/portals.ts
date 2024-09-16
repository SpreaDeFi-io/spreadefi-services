// Define the Order type
type Order = {
  inputToken: string;
  inputAmount: string;
  outputToken: string;
  minOutputAmount: string;
  recipient: string;
};

// Define the SignedOrder type
type SignedOrder = {
  order: Order;
  routeHash: string;
  sender: string;
  deadline: string;
  nonce: string;
};

// Define the Context type
type TransactionContext = {
  orderId: string;
  minOutputAmount: string;
  minOutputAmountUsd: number;
  minOutputAmountSignedOrder: string;
  minOutputAmountUsdSignedOrder: number;
  slippageTolerancePercentage: number;
  gasLimit: string;
  inputAmount: string;
  inputAmountUsd: number;
  inputToken: string;
  outputToken: string;
  outputAmount: string;
  outputAmountUsd: number;
  outputAmountSignedOrder: string;
  outputAmountUsdSignedOrder: number;
  partner: string;
  feeToken: string;
  feeAmount: string;
  feeAmountUsd: number;
  feeAmountSignedOrder: string;
  feeAmountUsdSignedOrder: number;
  sender: string;
  recipient: string;
  target: string;
  value: string;
  route: string[];
  steps: string[];
  stepsSignedOrder: string[];
  routeHash: string;
};

// Define the Tx type
type Tx = {
  data: string;
  to: string;
  from: string;
  value: string;
  gasLimit: string;
};

export type FailedTransaction = {
  statusCode: number;
  message: string;
};

export type SuccessPortalsTransaction = {
  tx: Tx;
  context: TransactionContext;
  signedOrder: SignedOrder;
};

// Define the main structure that includes Tx, Context, and SignedOrder
export type PortalsTransaction = SuccessPortalsTransaction | FailedTransaction;
