export interface Task {
  id: number;
  skill: string;
  status: "complete" | "pending" | "error";
  result: any;
  dependent_task_ids: number[];
  parentId: number;
  referenceId: number;
  isDependentTasksComplete?: boolean;
}

export interface Wallet {
  name: string;
  address: string;
  balance?: string;
  transactions?: PaymentType[];
}

export type WalletType = "Sender" | "Receiver";

export interface DashboardReduxState {
  reservedWallets: {
    Sender: Wallet[];
    Receiver: Wallet[];
  };
  wallets: {
    Sender: Wallet[];
    Receiver: Wallet[];
  };
  status: {
    [key: string]: "idle" | "pending" | "succeeded" | "failed";
  };
  transactions: CommonTransaction[];
}
export interface AiBotSliceReduxState {
  messages: ChatMessageType[];
  tasks: {
    [key: number]: Task;
  };
  taskGroupIndex: number;
  protocolLogs: PaymentType[];
  protocolLogsV2: any;
  status: {
    botThinking: boolean;
  };
  shouldScrollToBottom: boolean;
  error: {
    fetchAll: string | null;
  };
}

export type ChatMessageType = {
  uuid?: string;
  type: "chat" | "dataset" | "tasklist" | "websearch" | "videosearch";
  direction?: "left" | "right";
  avatarUrl: string;
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
};

export type Prompt = {
  userUuid: string;
  promptType: "chat" | "tasklist" | "dataset";
  logs: PaymentType[];
};

export type PaymentType = {
  userUuid: string;
  status: "SUCCESS" | "DENIED";
  network: string;
  currency: string;
  destinationAddress: string;
  destinationName: string;
  generatedDate: string;
  sourceAddress: string;
  sourceName: string;
  amount: string;
  message: string;
};

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
