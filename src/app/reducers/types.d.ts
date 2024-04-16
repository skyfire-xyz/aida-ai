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

export interface AiBotSliceReduxState {
  messages: ChatMessageType[];
  tasks: {
    [key: number]: Task;
  };
  taskGroupIndex: number;
  protocolLogs: PaymentType[];
  status: {
    botThinking: boolean;
  };
  shouldScrollToBottom: boolean;
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
