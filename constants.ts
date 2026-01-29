import { Duck, DuckRarity, Task, TaskStatus } from './types';

export const MOCK_DUCKS_DB: Omit<Duck, 'id' | 'obtainedAt'>[] = [
  // Common
  { name: 'Rubber Ducky', rarity: DuckRarity.COMMON, imageUrl: 'https://picsum.photos/seed/duck1/200', description: 'Just a classic yellow friend.', stars: 1 },
  { name: 'Puddle Duck', rarity: DuckRarity.COMMON, imageUrl: 'https://picsum.photos/seed/duck2/200', description: 'Loves rainy days.', stars: 1 },
  { name: 'Baker Duck', rarity: DuckRarity.COMMON, imageUrl: 'https://picsum.photos/seed/duck3/200', description: 'Always smells like bread.', stars: 1 },
  
  // Rare
  { name: 'Pilot Duck', rarity: DuckRarity.RARE, imageUrl: 'https://picsum.photos/seed/duck4/200', description: 'Ready for takeoff.', stars: 1 },
  { name: 'Ninja Duck', rarity: DuckRarity.RARE, imageUrl: 'https://picsum.photos/seed/duck5/200', description: 'Silent but quacky.', stars: 1 },
  
  // Epic
  { name: 'Wizard Duck', rarity: DuckRarity.EPIC, imageUrl: 'https://picsum.photos/seed/duck6/200', description: 'Casts spells of breadcrumbs.', stars: 1 },
  { name: 'Cyborg Duck', rarity: DuckRarity.EPIC, imageUrl: 'https://picsum.photos/seed/duck7/200', description: 'Half machine, full quack.', stars: 1 },
  
  // Legendary
  { name: 'King Golden Duck', rarity: DuckRarity.LEGENDARY, imageUrl: 'https://picsum.photos/seed/duck8/200', description: 'The ruler of the pond.', stars: 1 },
];

export const RARITY_COLORS = {
  [DuckRarity.COMMON]: 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300',
  [DuckRarity.RARE]: 'bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
  [DuckRarity.EPIC]: 'bg-purple-50 border-purple-300 text-purple-600 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
  [DuckRarity.LEGENDARY]: 'bg-yellow-50 border-yellow-300 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300',
};

export const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    userId: 'demo',
    text: 'Welcome to DuckDo!',
    description: 'Complete this task to get your first ticket.',
    deadline: new Date().toISOString(),
    status: TaskStatus.PENDING,
    createdAt: new Date().toISOString(),
    rewardClaimed: false
  }
];