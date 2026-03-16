import { useState } from 'react'
import './App.css'
import login from './requests/Login.ts';
import getOpenEvents from './requests/GetEvents.ts';
import LoginForm from './components/LoginForm.tsx';
import AvailableEventsTable from './components/AvailableEventsTable.tsx';
import ClaimedEventsTable from './components/ClaimedEventsTable.tsx';
import AssignedEventsTable from './components/AssignedEventsTable.tsx';
import claim from './requests/Claim.ts';
import type { EventItem } from './Types.ts';
import acknowledge from './requests/Acknowledge.ts';

function App() {
  const [userId, setUserId] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openEvents, setOpenEvents] = useState<EventItem[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<EventItem[]>([]);
  const [assignedEvents, setAssignedEvents] = useState<EventItem[]>([]);

  const handleSubmit: () => void = () => {
    login(userId, region).then(() => {
      setLoggedIn(true);
    });
  };

  const fetchEvents: () => void = () => {
    getOpenEvents(userId).then((response) => {
      setOpenEvents(Array.isArray(response?.open) ? response.open : []);
      setClaimedEvents(Array.isArray(response?.claimed) ? response.claimed : []);
      setAssignedEvents(Array.isArray(response?.assigned) ? response.assigned : [])
    });
  };

  const claimEvent = (eventId: string): void => {
    claim({ eventId, userId }).then(fetchEvents);
  };

  const assignEvent = (eventId: string): void => {
    acknowledge({ eventId, userId }).then(fetchEvents);
  };

  return loggedIn ? <section id="center">
    <div>
      <button
        className="counter"
        onClick={fetchEvents}
      >
        Fetch events
      </button>
      <AvailableEventsTable events={openEvents} onClaim={claimEvent} />
      <ClaimedEventsTable events={claimedEvents} onAssign={assignEvent} />
      <AssignedEventsTable events={assignedEvents} />
    </div>
  </section> : <LoginForm
    {...{ userId, setUserId, region, setRegion, handleSubmit }}
  />
}

export default App
