import React, { useState } from 'react'
import './App.css'
import login from './requests/Login';
import { getEvents } from './requests/GetEvents';

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
  const [events, setEvents] = useState<EventItem[]>([]);

  const handleSubmit = () => {
    login(userId, region).then((response: { success: boolean }) => {
      if (response.success) {
        setLoggedIn(true);
      }
    });
  };

  const fetchEvents = () => {
    getEvents(userId).then((response) => {
      setEvents(Array.isArray(response) ? response : []);
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
          {events.length > 0 ? (
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Region</th>
                  <th>Status</th>
                  <th>Claimed By</th>
                  <th>Claimed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.eventId}>
                    <td>{event.eventId}</td>
                    <td>{event.region}</td>
                    <td>{event.status.charAt(0).toUpperCase() + event.status.slice(1).toLowerCase()}</td>
                    <td>{event.claimedBy ?? '-'}</td>
                    <td>{event.claimedAt ?? '-'}</td>
                    <td>
                      <button className="row-action" type="button">
                        {event.status === 'open' && 'Claim'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
