import type { Event } from "../Types.ts";

export const claimValid = (event: Event): boolean => !!event?.claimedAt
  && new Date().getTime() - new Date(event.claimedAt).getTime() < 15 * 60 * 1000;

export const claimedByMe = (event: Event, userId: string): boolean => claimValid(event)
  && event.claimedBy === userId;