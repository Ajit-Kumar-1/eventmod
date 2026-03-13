import type { Event } from "../data/Types.ts";

export const claimedBySomeoneElse = (event: Event, user_id: string): boolean => !!event
  && event.claimedBy !== user_id
  && !!event.claimedAt
  && new Date().getTime() - new Date(event.claimedAt).getTime() < 15 * 60 * 1000;
;