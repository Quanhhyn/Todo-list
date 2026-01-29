export interface User {
  id: string;
  name: string; // Display name
  email: string; // Unique
  password?: string; // Hashed (simulated)
  image?: string; // Avatar
  tickets: number; // Roll tickets
  eggs: number; // Weekly reward eggs
  eggProgress: number; // 0-100% progress for the current egg
  streak: number;
  pityCounter: number; // Tracks rolls since last Legendary
}

export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done',
}

export interface Task {
  id: string;
  userId: string;
  text: string; // Content of the task
  description?: string;
  deadline: string; // ISO String
  status: TaskStatus;
  finishedTime?: string; // ISO String, if status is done
  createdAt: string;
  rewardClaimed?: boolean; // Prevents infinite farming of tickets by toggling status
}

export enum DuckRarity {
  COMMON = 'Common',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary',
}

export interface Duck {
  id: string;
  name: string;
  rarity: DuckRarity;
  imageUrl: string;
  description: string;
  obtainedAt: string;
  stars: number; // Star level (1 by default, increments on duplicate)
}

export interface GachaResult {
  duck: Duck;
  isNew: boolean;
}