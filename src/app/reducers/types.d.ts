export interface AiBotSliceReduxState {
  messages: ChatMessageType[];
  tasks: {
    [key: number]: any;
  };
  protocolLogs: PaymentType[];
  status: {
    botThinking: boolean;
  };
  error: {
    fetchAll: string | null;
  };
}

export type ChatMessageType = {
  type: "chat" | "dataset" | "tasklist" | "websearch" | "videosearch";
  direction?: "left" | "right";
  avatarUrl: string;
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
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
