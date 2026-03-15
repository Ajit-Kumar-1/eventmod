import React, { useState } from 'react'
import './App.css'

function App() {
  const [userId, setUserId] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log({ user_id: userId, region })
  }

  return (
    <>
      <section id="center">
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
      </section>

      <div className="ticks"></div>
    </>
  )
}

export default App
