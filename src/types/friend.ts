import { User } from "./user";

export interface Friend {
    id: string;       // relation ID
    userId: string;   // the owner of this friend
    friendId: string; // the friend user
  }
  
  export interface FriendRequest {
    relation: Friend; // contains the request ID
    user: User;       // contains the profile info
  }