// Shown while a server page is loading — a lightweight skeleton instead of a blank screen.
export default function Loading() {
  return (
    <div className="page" aria-busy="true" aria-label="Loading">
      <div className="skeleton mb-3 h-4 w-28" />
      <div className="skeleton mb-2 h-9 w-72 max-w-full" />
      <div className="skeleton mb-10 h-4 w-96 max-w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="card space-y-3 p-5">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
            <div className="skeleton mt-4 h-2 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
