export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  AWAY = "away",
}

export interface User {
  id: string;
  username: string;
  password: string;

  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role?: UserRole | null;
  status?: UserStatus | null;
  lastSeen?: number | null;
  createdAt?: number | null;
}


export type EditUser = Omit<User,'id' | 'password'>