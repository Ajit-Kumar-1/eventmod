export const Region = {
  ASIA: 'asia',
  EUROPE: 'eu',
  AMERICA: 'us'
} as const;

export type Region = typeof Region[keyof typeof Region];

export const Status = {
  OPEN: 'open',
  CLAIMED: 'claimed',
  ASSIGNED: 'assigned'
} as const;

export type Status = typeof Status[keyof typeof Status];

export type Event = {
  eventId: number;
  region: Region;
  status: Status;
  claimedAt: Date | null;
  claimedBy: string | null;
}

export type User = {
  userId: string;
  region: Region;
}

export type EventItem = {
  eventId: string;
  region: string;
  status: string;
  claimedBy: string | null;
  claimedAt: string | null;
}