export interface Task {
  id: number;
  skill: string;
  status: "complete" | "pending" | "error";
  result: any;
  dependent_task_ids: number[];
  parentId: number;
  referenceId: number;
  objective: string;
  isDependentTasksComplete?: boolean;
}

export interface Wallet {
  name: string;
  address: string;
  transactions?: PaymentType[];
  network?: string;
  createdAt?: string;
  type?: string;
  balance?: {
    escrow: {
      total: number;
      available: number;
    };
    claims: {
      received: number;
      sent: number;
    };
    total: number;
  };
}

export interface Receiver {
  id: string;
  skyfireUser: {
    id: string;
    username: string;
    email: string;
    walletType: "Sender" | "Receiver";
    walletAddress: string;
  };
  cost: number;
  currency: string;
  createdDate: string;
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
  claims: CommonTransaction[];
  receivers: Receiver[];
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
  id: string;
  txId: string;
  txType: string;
  userId: string;
  type:
    | "CLAIM"
    | "PAYMENT"
    | "TRANSFER"
    | "MINTS"
    | "BURNS"
    | "WITHDRAWAL"
    | "ACQUISITION"
    | "ADJUSTMENT"
    | "PAYMENT_CLAIM"
    | "REDEMPTION";
  token?: {
    tokenId?: string;
    tokenAddress?: string;
    network?: string;
  };
  clientId?: string;
  txHash?: string | null;
  status: string;
  createdAt: string;
  redemption?: {
    sourceAddress: string;
    sourceName?: string;
    destinationAddress: string;
    amounts: {
      currency: string;
      fee: string;
      subtotal: string;
      total: string;
    };
    destinationName?: string;
  };
  redemptionId?: string;
  payment?: {
    sourceAddress?: string;
    destinationAddress?: string;
    value?: string;
    currency?: string;
    sourceName?: string;
    destinationName?: string;
  };
  paymentId?: string;
  claim?: {
    sourceAddress: string;
    sourceName?: string;
    destinationAddress: string;
    value: string;
    currency: string;
    destinationName?: string;
  };
  claimId?: string;
}

export interface AuthenticationReduxState {
  user?: {
    email?: string;
    username?: string;
    id: string;
    walletType: "Sender" | "Receiver";
    updatedDate: string;
    createdDate: string;
    avatar?: string;
  };
  userBalance?: {
    escrow: {
      total: number;
      available: number;
    };
    claims: {
      received: number;
      sent: number;
    };
    total: number;
  } | null;
  init: boolean;
  status: {
    [key: string]: "idle" | "pending" | "succeeded" | "failed";
  };
}
