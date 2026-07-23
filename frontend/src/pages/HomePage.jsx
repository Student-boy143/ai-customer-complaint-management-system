import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'

/**
 * Landing page with a brief overview and quick navigation links.
 */
function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          AI-Powered Customer Complaint Management
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Streamline customer complaint handling with intelligent categorization,
          priority scoring, and automated response suggestions powered by AI.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.COMPLAINTS}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            View Complaints
          </Link>
          <Link
            to={ROUTES.NEW_COMPLAINT}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Submit a Complaint
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomePage
