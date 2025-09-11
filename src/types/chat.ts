export interface Message {
  id: number;
  content: string;
  date: number; // ISO string
  senderId: number;
  receiverId: number;
}


export interface Chat {
  id: number;
  userId: number; // the other user you are chatting with
  lastMessageId?: number;
  messages: Message[];
}

export type InputChat = Omit<Chat,'id'>

export type InputMessage = Omit<Message,'id'>