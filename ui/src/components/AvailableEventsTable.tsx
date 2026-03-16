import type { EventItem } from '../Types.ts';

type AvailableEventsTableProps = {
  events: EventItem[];
  onClaim: (eventId: string) => void;
}

export default function AvailableEventsTable({
  events,
  onClaim,
}: AvailableEventsTableProps) {
  return <>
    <h3>Available Events</h3>
    <table className="events-table">
      <thead>
        <tr>
          <th>Event ID</th>
          <th>Region</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.length > 0 ? (
          events.map((event) => (
            <tr key={event.eventId}>
              <td>{event.eventId}</td>
              <td>{event.region}</td>
              <td>
                <button
                  className="row-action"
                  type="button"
                  onClick={() => onClaim(event.eventId)}
                >
                  Claim
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No available events yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  </>;
}
