export function Issues() {
  return (
    <>
      <h2>What's wrong with this?</h2>
      <details>
        <summary>Plain SPA Issues</summary>
        <ol>
          <li>Slow connection or slow backend means slow UX</li>
          <li>
            Must implement loading state because of #1, or use optimistic UI
            which is tedious and error prone
          </li>
          <li>No offline support</li>
          <li>May be viewing stale data</li>
          <li>No conflict handling. Last in quietly wins.</li>
          <li>No cross-browser tab syncing</li>
        </ol>
      </details>
    </>
  );
}
