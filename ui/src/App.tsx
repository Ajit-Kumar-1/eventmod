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
import { ApiError } from './requests/client.ts';

function App() {
  const [userId, setUserId] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openEvents, setOpenEvents] = useState<EventItem[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<EventItem[]>([]);
  const [assignedEvents, setAssignedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [lastAction, setLastAction] = useState<
    | { type: 'login' }
    | { type: 'fetch' }
    | { type: 'claim'; eventId: string }
    | { type: 'assign'; eventId: string }
    | null
  >(null);

  const canSubmit = userId.trim().length > 0 && region.trim().length > 0;

  const fetchEvents = async (): Promise<void> => {
    const response = await getOpenEvents(userId);
    setOpenEvents(Array.isArray(response?.open) ? response.open : []);
    setClaimedEvents(Array.isArray(response?.claimed) ? response.claimed : []);
    setAssignedEvents(Array.isArray(response?.assigned) ? response.assigned : []);
  };

  const runWithLoading = async (task: () => Promise<void>): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    try {
      await task();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string): void => {
    setSuccessMessage(message);
    window.setTimeout(() => {
      setSuccessMessage('');
    }, 2500);
  };

  const performLogin = (): void => {
    setLastAction({ type: 'login' });
    void runWithLoading(async () => {
      await login(userId, region);
      setLoggedIn(true);
      await fetchEvents();
    });
  };

  const performFetch = (): void => {
    setLastAction({ type: 'fetch' });
    void runWithLoading(fetchEvents);
  };

  const performClaim = (eventId: string): void => {
    setLastAction({ type: 'claim', eventId });
    void runWithLoading(async () => {
      await claim({ eventId, userId });
      await fetchEvents();
      showSuccess('Event claimed successfully.');
    });
  };

  const performAssign = (eventId: string): void => {
    setLastAction({ type: 'assign', eventId });
    void runWithLoading(async () => {
      await acknowledge({ eventId, userId });
      await fetchEvents();
      showSuccess('Event assigned successfully.');
    });
  };

  const retryLastAction = (): void => {
    if (!lastAction) {
      return;
    }

    switch (lastAction.type) {
      case 'login':
        performLogin();
        break;
      case 'fetch':
        performFetch();
        break;
      case 'claim':
        performClaim(lastAction.eventId);
        break;
      case 'assign':
        performAssign(lastAction.eventId);
        break;
      default:
        break;
    }
  };

  const handleSubmit: () => void = () => {
    if (!canSubmit) {
      return;
    }

    performLogin();
  };

  const fetchEventsAction: () => void = () => {
    performFetch();
  };

  const claimEvent = (eventId: string): void => {
    performClaim(eventId);
  };

  const assignEvent = (eventId: string): void => {
    performAssign(eventId);
  };

  return <>
    {loggedIn ? <section id="center">
      <button
        className="counter"
        onClick={fetchEventsAction}
        disabled={loading}
      >
        Fetch events
      </button>
      <AvailableEventsTable
        events={openEvents}
        onClaim={claimEvent}
        isLoading={loading}
      />
      <ClaimedEventsTable
        events={claimedEvents}
        onAssign={assignEvent}
        isLoading={loading}
      />
      <AssignedEventsTable events={assignedEvents} />
    </section> : <LoginForm
      {...{ userId, setUserId, region, setRegion, handleSubmit, loading, canSubmit }}
    />}

    {errorMessage && (
      <div className="error-message" role="alert">
        <span>{errorMessage}</span>
        <button
          className="error-retry"
          type="button"
          onClick={retryLastAction}
          disabled={loading}
        >
          Retry
        </button>
      </div>
    )}

    {successMessage && (
      <p className="success-message" role="status" aria-live="polite">
        {successMessage}
      </p>
    )}

    {loading && <LoadingOverlay />}
  </>
}

export default App
