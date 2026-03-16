import { useState } from 'react'
import './App.css'
import login from './requests/Login.ts';
import getOpenEvents from './requests/GetEvents.ts';
import LoginForm from './components/LoginForm.tsx';
import AvailableEventsTable from './components/AvailableEventsTable.tsx';
import ClaimedEventsTable from './components/ClaimedEventsTable.tsx';
import AssignedEventsTable from './components/AssignedEventsTable.tsx';
import LoadingOverlay from './components/LoadingOverlay.tsx';
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
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit: () => void = () => {
    setLoading(true);
    login(userId, region).then(() => {
      setLoggedIn(true);
      fetchEvents();
    }).finally(() => setLoading(false));
  };

  const fetchEvents: () => void = () => {
    setLoading(true);
    getOpenEvents(userId).then((response) => {
      setOpenEvents(Array.isArray(response?.open) ? response.open : []);
      setClaimedEvents(Array.isArray(response?.claimed) ? response.claimed : []);
      setAssignedEvents(Array.isArray(response?.assigned) ? response.assigned : [])
    }).finally(() => setLoading(false));
  };

  const claimEvent = (eventId: string): void => {
    setLoading(true);
    claim({ eventId, userId }).then(fetchEvents).finally(() => setLoading(false));
  };

  const assignEvent = (eventId: string): void => {
    setLoading(true);
    acknowledge({ eventId, userId }).then(fetchEvents).finally(() => setLoading(false));
  };

  return <>
    {loggedIn ? <section id="center">
      <button
        className="counter"
        onClick={fetchEvents}
      >
        Fetch events
      </button>
      <AvailableEventsTable events={openEvents} onClaim={claimEvent} />
      <ClaimedEventsTable events={claimedEvents} onAssign={assignEvent} />
      <AssignedEventsTable events={assignedEvents} />
    </section> : <LoginForm
      {...{ userId, setUserId, region, setRegion, handleSubmit }}
    />}

    {loading && <LoadingOverlay />}
  </>
}

export default App
