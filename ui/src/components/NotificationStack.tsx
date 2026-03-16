type NotificationStackProps = {
  errorMessage: string;
  successMessage: string;
  isErrorClosing: boolean;
  isSuccessClosing: boolean;
  loading: boolean;
  onRetry: () => void;
  onDismissError: () => void;
  onDismissSuccess: () => void;
}

export default function NotificationStack({
  errorMessage,
  successMessage,
  isErrorClosing,
  isSuccessClosing,
  loading,
  onRetry,
  onDismissError,
  onDismissSuccess,
}: NotificationStackProps) {
  if (!errorMessage && !successMessage) {
    return null;
  }

  return <div className="notification-stack" aria-live="polite">
    {errorMessage && (
      <div
        className={`notification error-message${isErrorClosing ? ' is-closing' : ''}`}
        role="alert"
      >
        <span>{errorMessage}</span>
        <div className="notification-actions">
          <button
            className="error-retry"
            type="button"
            onClick={onRetry}
            disabled={loading}
          >
            Retry
          </button>
          <button
            className="notification-dismiss"
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error message"
          >
            Dismiss
          </button>
        </div>
      </div>
    )}

    {successMessage && (
      <div
        className={`notification success-message${isSuccessClosing ? ' is-closing' : ''}`}
        role="status"
      >
        <span>{successMessage}</span>
        <button
          className="notification-dismiss"
          type="button"
          onClick={onDismissSuccess}
          aria-label="Dismiss success message"
        >
          Dismiss
        </button>
      </div>
    )}
  </div>;
}
