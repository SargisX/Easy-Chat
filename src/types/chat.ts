export interface Message {
  id: string;
  content: string;
  chatId: string;
  date: number; // ISO string
  senderId: string;
}


export interface Chat {
  id: string;
  senderId: string; // the other user you are chatting with
  receiverId:string
  lastMessageId?:string;
  messages:Message[]
}

export type InputChat = Omit<Chat,'id' | 'messages'>

export type InputMessage = Omit<Message,'id'>