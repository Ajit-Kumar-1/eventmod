import './App.css'
import LoginForm from './components/LoginForm.tsx';
import EventsDashboard from './components/EventsDashboard.tsx';
import LoadingOverlay from './components/LoadingOverlay.tsx';
import NotificationStack from './components/NotificationStack.tsx';
import useModeratorApp from './hooks/useModeratorApp.ts';

function App() {
  const {
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
    fetchEventsAction,
    claimEvent,
    assignEvent,
    retryLastAction,
    dismissError,
    dismissSuccess,
  } = useModeratorApp();

  return <>
    {loggedIn ? <EventsDashboard
      loading={loading}
      openEvents={openEvents}
      claimedEvents={claimedEvents}
      assignedEvents={assignedEvents}
      onFetchEvents={fetchEventsAction}
      onClaimEvent={claimEvent}
      onAssignEvent={assignEvent}
    /> : <LoginForm
      {...{ userId, setUserId, region, setRegion, handleSubmit, loading, canSubmit }}
    />}

    <NotificationStack
      errorMessage={errorMessage}
      successMessage={successMessage}
      isErrorClosing={isErrorClosing}
      isSuccessClosing={isSuccessClosing}
      loading={loading}
      onRetry={retryLastAction}
      onDismissError={dismissError}
      onDismissSuccess={dismissSuccess}
    />

    {loading && <LoadingOverlay />}
  </>
}

export default App
