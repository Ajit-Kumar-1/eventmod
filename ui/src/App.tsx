import React, { useState } from 'react'
import './App.css'
import login from './requests/Login.js';
import { getEvents } from './requests/GetEvents.js';

function App() {
  const [userId, setUserId] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);

  const handleSubmit = () => {
    login(userId, region).then((response) => {
      if (response.success) {
        setLoggedIn(true);
      }
    });
  };

  const fetchEvents = () => {
    getEvents(userId).then((response) => {
      setEvents(response);
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
          {events?.map((event) => <div key={event.id}>{event.eventId}</div>)}
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
