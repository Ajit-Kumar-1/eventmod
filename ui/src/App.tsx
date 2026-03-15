import { useState } from 'react'
import './App.css'
import login from './requests/Login.ts';
import { getOpenEvents } from './requests/GetOpenEvents.ts';
import { getAssignments } from './requests/GetAssignments.js';

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
  const [assignedEvents, setAssignedEvents] = useState<EventItem[]>([]);

  const handleSubmit = () => {
    login(userId, region).then(() => {
      setLoggedIn(true);
    });
  };

  const fetchEvents = () => {
    getOpenEvents(userId).then((response: EventItem[]) => {
      setOpenEvents(Array.isArray(response) ? response : []);
    });
    getAssignments(userId).then((response: EventItem[]) => {
      setAssignedEvents(Array.isArray(response) ? response : []);
    });
  };

  return (
    <>
      {loggedIn ? <section id="center">
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
      </section> : <section id="center">
        <div>
          <h2>Get started</h2>
          <p>Enter your moderator details below.</p>
        </div>

        <div className="input-grid">
          <label className="input-field" htmlFor="user_id">
            <span>user_id</span>
            <input
              id="user_id"
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter moderator ID"
            />
          </label>

          <label className="input-field" htmlFor="region">
            <span>region</span>
            <input
              id="region"
              type="text"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              placeholder="Enter region"
            />
          </label>
        </div>

        <button
          className="counter"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </section>}

      <div className="ticks"></div>
    </>
  )
}

export default App
