import type { Event } from "../data/Types.ts";

export const claimValid = (event: Event): boolean => !!event?.claimedAt
  && new Date().getTime() - new Date(event.claimedAt).getTime() < 15 * 60 * 1000;

export const claimedByMe = (event: Event, user_id: string): boolean => claimValid(event)
  && event.claimedBy === user_id;