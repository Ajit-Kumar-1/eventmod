import { useState } from 'react'
import './App.css'
import login from './requests/Login.ts';
import { getOpenEvents } from './requests/GetEvents.ts';
import Login from './components/Login.tsx';

type EventItem = {
  eventId: string;
  region: string;
  status: string;
  claimedBy: string | null;
  claimedAt: string | null;
};

function App() {
  const [userId, setUserId] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openEvents, setOpenEvents] = useState<EventItem[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<EventItem[]>([]);
  const [assignedEvents, setAssignedEvents] = useState<EventItem[]>([]);

  const handleSubmit = () => {
    login(userId, region).then(() => {
      setLoggedIn(true);
    });
  };

  const fetchEvents = () => {
    getOpenEvents(userId).then((response) => {
      setOpenEvents(Array.isArray(response?.open) ? response.open : []);
      setClaimedEvents(Array.isArray(response?.claimed) ? response.claimed : []);
      setAssignedEvents(Array.isArray(response?.assigned) ? response.assigned : [])
    });
  };

  return loggedIn ? <section id="center">
    <div>
      <button
        className="counter"
        onClick={fetchEvents}
      >
        Fetch events
      </button>
      {openEvents.length > 0 ? (
        <>
          <h3>Available Events</h3>
          <table className="events-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Region</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {openEvents.map((event) => (
                <tr key={event.eventId}>
                  <td>{event.eventId}</td>
                  <td>{event.region}</td>
                  <td>{event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase()}</td>
                  <td>
                    <button className="row-action" type="button">
                      {event.status === 'open' && 'Claim'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Assigned Events</h3>
          <table className="events-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Region</th>
                <th>Claimed At</th>
              </tr>
            </thead>
            <tbody>
              {assignedEvents.length > 0 ? (
                assignedEvents.map((event) => (
                  <tr key={`assigned-${event.eventId}`}>
                    <td>{event.eventId}</td>
                    <td>{event.region}</td>
                    <td>{event.claimedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No assigned events yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>No events loaded yet.</p>
      )}
    </div>
  </section> : <Login
    {...{ userId, setUserId, region, setRegion, handleSubmit }}
  />
}

export default App
