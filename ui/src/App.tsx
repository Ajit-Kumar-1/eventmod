import { useState } from 'react'
import './App.css'
import login from './requests/Login.ts';
import getOpenEvents from './requests/GetEvents.ts';
import LoginForm from './components/LoginForm.tsx';
import claim from './requests/Claim.ts';

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

  const claimEvent = (eventId: string) => {
    claim({ eventId, userId }).then(fetchEvents);
  };

  return loggedIn ? <section id="center">
    <div>
      <button
        className="counter"
        onClick={fetchEvents}
      >
        Fetch events
      </button>
      <>
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
            {openEvents.map((event) => (
              <tr key={event.eventId}>
                <td>{event.eventId}</td>
                <td>{event.region}</td>
                <td>
                  <button
                    className="row-action"
                    type="button"
                    onClick={() => claimEvent(event.eventId)}
                  >
                    {'Claim'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Claimed Events</h3>
        <table className="events-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Region</th>
              <th>Claimed At</th>
            </tr>
          </thead>
          <tbody>
            {claimedEvents.length > 0 ? (
              claimedEvents.map((event) => (
                <tr key={`claimed-${event.eventId}`}>
                  <td>{event.eventId}</td>
                  <td>{event.region}</td>
                  <td>{event.claimedAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No claimed events yet.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>Assigned Events</h3>
        <table className="events-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {assignedEvents.length > 0 ? (
              assignedEvents.map((event) => (
                <tr key={`assigned-${event.eventId}`}>
                  <td>{event.eventId}</td>
                  <td>{event.region}</td>
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
    </div>
  </section> : <LoginForm
    {...{ userId, setUserId, region, setRegion, handleSubmit }}
  />
}

export default App
