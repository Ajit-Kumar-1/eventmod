import { useState } from 'react';
import type { EventItem } from '../Types.ts';
import login from '../requests/Login.ts';
import getOpenEvents from '../requests/GetEvents.ts';
import claim from '../requests/Claim.ts';
import acknowledge from '../requests/Acknowledge.ts';
import { ApiError } from '../requests/client.ts';

type LastAction =
  | { type: 'login' }
  | { type: 'fetch' }
  | { type: 'claim'; eventId: string }
  | { type: 'assign'; eventId: string }
  | null;

export default function useModeratorApp() {
  const [userId, setUserId] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [openEvents, setOpenEvents] = useState<EventItem[]>([]);
  const [claimedEvents, setClaimedEvents] = useState<EventItem[]>([]);
  const [assignedEvents, setAssignedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isErrorClosing, setIsErrorClosing] = useState<boolean>(false);
  const [isSuccessClosing, setIsSuccessClosing] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<LastAction>(null);

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
      setIsErrorClosing(false);
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const dismissError = (): void => {
    setIsErrorClosing(true);
    window.setTimeout(() => {
      setErrorMessage('');
      setIsErrorClosing(false);
    }, 180);
  };

  const dismissSuccess = (): void => {
    setIsSuccessClosing(true);
    window.setTimeout(() => {
      setSuccessMessage('');
      setIsSuccessClosing(false);
    }, 180);
  };

  const showSuccess = (message: string): void => {
    setIsSuccessClosing(false);
    setSuccessMessage(message);
    window.setTimeout(() => {
      dismissSuccess();
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

  return {
    userId,
    setUserId,
    region,
    setRegion,
    loggedIn,
    openEvents,
    claimedEvents,
    assignedEvents,
    loading,
    errorMessage,
    successMessage,
    isErrorClosing,
    isSuccessClosing,
    canSubmit,
    handleSubmit,
    fetchEventsAction: performFetch,
    claimEvent: performClaim,
    assignEvent: performAssign,
    retryLastAction,
    dismissError,
    dismissSuccess,
  };
}
