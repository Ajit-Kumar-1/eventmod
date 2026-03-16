export default function LoadingOverlay() {
  return <div className="loading-overlay" role="status" aria-live="polite">
    <div className="loading-overlay-content">
      <span className="loading-spinner" aria-hidden="true" />
      <p>Loading...</p>
    </div>
  </div>;
}
