export const Region = {
  ASIA: 'asia',
  EUROPE: 'eu',
  AMERICA: 'us'
} as const;

export type Region = typeof Region[keyof typeof Region];

export const Status = {
  OPEN: 'open',
  CLAIMED: 'claimed',
  LOCKED: 'locked'
} as const;

export type Status = typeof Status[keyof typeof Status];

export type Event = {
  id: number;
  region: Region;
  status: Status;
  claimedAt: Date | null;
  claimedBy: string | null;
}