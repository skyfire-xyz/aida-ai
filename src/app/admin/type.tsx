export enum TransactionType {
  Acquisition = "ACQUISITION",
  Adjustment = "ADJUSTMENT",
  Withdrawal = "WITHDRAWAL",
  Mint = "MINTS",
  Burn = "BURNS",
  Transfer = "TRANSFER",
  Payment = "PAYMENT",
}

export interface CommonTransaction {
  type: TransactionType;
  token: {
    tokenId?: string;
    tokenAddress?: string;
    network?: string;
  };
  clientId?: string;
  txHash?: string | null;
  status: string;
  createdAt: string;
  paymentId?: string;
  payment?: {
    sourceAddress?: string;
    destinationAddress?: string;
    value?: string;
    currency?: string;
    sourceName?: string;
    destinationName?: string;
  };
}
