export type EventDBItem = {
  event_id: string;
  region: string;
  status: string;
  claimed_by: string | null;
  claimed_at: Date | null;
}

type EventResponseItem = {
  eventId: string;
  region: string;
}

type ClaimedEventResponseItem = EventResponseItem & {
  claimedAt: string | null;
}

export type EventsResponse = {
  open: EventResponseItem[];
  claimed: ClaimedEventResponseItem[];
  assigned: EventResponseItem[];
}

function mapEventDBItemToResponseItem(item: EventDBItem): EventResponseItem {
  return {
    eventId: item.event_id,
    region: item.region,
  };
}

function mapClaimedEventDBItemToResponseItem(item: EventDBItem):
  ClaimedEventResponseItem {
  return {
    eventId: item.event_id,
    region: item.region,
    claimedAt: item.claimed_at ? item.claimed_at.toISOString() : null,
  };
}

export default function eventsResponse(
  open: EventDBItem[],
  claimed: EventDBItem[],
  assigned: EventDBItem[],
) {
  return {
    open: open.map(mapEventDBItemToResponseItem),
    claimed: claimed.map(mapClaimedEventDBItemToResponseItem),
    assigned: assigned.map(mapEventDBItemToResponseItem),
  } as EventsResponse;
}