import type { EventItem } from '../Types.ts';
import AvailableEventsTable from './AvailableEventsTable.tsx';
import ClaimedEventsTable from './ClaimedEventsTable.tsx';
import AssignedEventsTable from './AssignedEventsTable.tsx';

type EventsDashboardProps = {
  loading: boolean;
  openEvents: EventItem[];
  claimedEvents: EventItem[];
  assignedEvents: EventItem[];
  onFetchEvents: () => void;
  onClaimEvent: (eventId: string) => void;
  onAssignEvent: (eventId: string) => void;
}

export default function EventsDashboard({
  loading,
  openEvents,
  claimedEvents,
  assignedEvents,
  onFetchEvents,
  onClaimEvent,
  onAssignEvent,
}: EventsDashboardProps) {
  return <section id="center">
    <button
      className="counter"
      onClick={onFetchEvents}
      disabled={loading}
    >
      Fetch events
    </button>
    <AvailableEventsTable
      events={openEvents}
      onClaim={onClaimEvent}
      isLoading={loading}
    />
    <ClaimedEventsTable
      events={claimedEvents}
      onAssign={onAssignEvent}
      isLoading={loading}
    />
    <AssignedEventsTable events={assignedEvents} />
  </section>;
}
