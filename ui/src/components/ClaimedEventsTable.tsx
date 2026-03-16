import type { EventItem } from '../Types.ts';

type ClaimedEventsTableProps = {
  events: EventItem[];
  onAssign: (eventId: string) => void;
}

export default function ClaimedEventsTable({
  events, onAssign,
}: ClaimedEventsTableProps) {
  return <>
    <h3>Claimed Events</h3>
    <table className="events-table">
      <thead>
        <tr>
          <th>Event ID</th>
          <th>Region</th>
          <th>Claimed At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.length > 0 ? (
          events.map((event) => (
            <tr key={`claimed-${event.eventId}`}>
              <td>{event.eventId}</td>
              <td>{event.region}</td>
              <td>{event.claimedAt ? new Date(event.claimedAt).toLocaleString() : '-'}</td>
              <td>
                <button
                  className="row-action"
                  type="button"
                  onClick={() => onAssign(event.eventId)}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>No claimed events yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  </>;
}
