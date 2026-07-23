/**
 * Complaints listing page.
 * Business logic and data fetching will be implemented in a future milestone.
 */
function ComplaintsPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
        <p className="mt-1 text-slate-600">
          View and manage all customer complaints in one place.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <p className="text-slate-500">No complaints to display yet.</p>
        <p className="mt-1 text-sm text-slate-400">
          Complaint data will appear here once the backend is connected.
        </p>
      </div>
    </section>
  )
}

export default ComplaintsPage
