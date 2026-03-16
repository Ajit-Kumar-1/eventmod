import type { EventItem } from '../Types.ts';

type AssignedEventsTableProps = {
  events: EventItem[];
}

export default function AssignedEventsTable({
  events,
}: AssignedEventsTableProps) {
  return <>
    <h3>Assigned Events</h3>
    <table className="events-table">
      <thead>
        <tr>
          <th>Event ID</th>
          <th>Region</th>
        </tr>
      </thead>
      <tbody>
        {events.length > 0 ? (
          events.map((event) => (
            <tr key={`assigned-${event.eventId}`}>
              <td>{event.eventId}</td>
              <td>{event.region}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={2}>No assigned events yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  </>;
}
