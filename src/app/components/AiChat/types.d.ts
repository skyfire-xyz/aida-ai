export type ChatMessageType = {
  type: 'chat' | 'dataset' | 'websearch';
  direction: 'left' | 'right';
  avatarUrl: string;
  textMessage: string;
  data?: any;
  contentImageUrl?: string;
};

export type PaymentType = {
  userUuid: string;
  status: 'SUCCESS' | 'DENIED';
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
