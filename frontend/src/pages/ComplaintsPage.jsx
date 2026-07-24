import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchComplaints, deleteComplaint, clearError } from '../redux/slices/complaintsSlice'
import { ROUTES } from '../utils/constants'

// Helper to determine status badge styles
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'open':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'in_progress':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'closed':
      return 'bg-zinc-100 text-zinc-600 border-zinc-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

// Helper to determine priority badge styles
const getPriorityBadgeStyle = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-slate-50 text-slate-600 border-slate-200'
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'high':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'critical':
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
    default:
      return 'bg-slate-50 text-slate-400 border-slate-200'
  }
}

// Helper to determine category badge styles
const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case 'billing':
      return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'technical':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'service':
      return 'bg-teal-50 text-teal-700 border-teal-200'
    case 'product':
      return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'
    case 'other':
      return 'bg-slate-50 text-slate-600 border-slate-200'
    default:
      return 'bg-slate-50 text-slate-400 border-slate-200'
  }
}

function ComplaintsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, loading, error } = useSelector((state) => state.complaints)

  // Local state for search and status filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [complaintToDelete, setComplaintToDelete] = useState(null) // store ID for confirmation dialog

  // Fetch complaints on mount and when filter changes
  useEffect(() => {
    dispatch(clearError())
    const statusParam = selectedStatusFilter === 'all' ? null : selectedStatusFilter
    dispatch(fetchComplaints({ limit: 100, status: statusParam }))
  }, [dispatch, selectedStatusFilter])

  const handleDeleteConfirm = () => {
    if (complaintToDelete) {
      dispatch(deleteComplaint(complaintToDelete))
      setComplaintToDelete(null)
    }
  }

  // Filter items in memory by search query (for customer name, email, or title)
  const filteredItems = items.filter((item) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      item.title.toLowerCase().includes(query) ||
      item.customer_name.toLowerCase().includes(query) ||
      item.customer_email.toLowerCase().includes(query) ||
      item.id.toString().includes(query)
    )
  })

  // Calculate status counts for stats cards
  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === 'pending').length,
    open: items.filter((i) => i.status === 'open').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    resolved: items.filter((i) => i.status === 'resolved').length,
    closed: items.filter((i) => i.status === 'closed').length,
  }

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor, prioritize, and manage customer issues in real-time.
          </p>
        </div>
        <Link
          to={ROUTES.NEW_COMPLAINT}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          New Complaint
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700 flex items-center justify-between">
          <div>
            <span className="font-semibold">Error:</span> {error}
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-rose-500 hover:text-rose-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'All Complaints', count: stats.total, color: 'border-indigo-500 text-indigo-700 bg-indigo-50/30' },
          { label: 'Pending', count: stats.pending, color: 'border-slate-300 text-slate-700 bg-slate-50/30' },
          { label: 'Open', count: stats.open, color: 'border-blue-500 text-blue-700 bg-blue-50/30' },
          { label: 'In Progress', count: stats.inProgress, color: 'border-amber-500 text-amber-700 bg-amber-50/30' },
          { label: 'Resolved', count: stats.resolved, color: 'border-emerald-500 text-emerald-700 bg-emerald-50/30' },
          { label: 'Closed', count: stats.closed, color: 'border-zinc-400 text-zinc-700 bg-zinc-50/30' },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 shadow-xs transition-all duration-200 hover:shadow-md ${card.color}`}
          >
            <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              {card.label}
            </span>
            <span className="mt-2 block text-2xl font-bold tracking-tight">
              {loading ? '...' : card.count}
            </span>
          </div>
        ))}
      </div>

      {/* Filters and Search Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by ID, title, email, name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200/50 transition-all"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'open', label: 'Open' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusFilter(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedStatusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Table Grid */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <tr>
                <th scope="col" className="px-6 py-4">ID</th>
                <th scope="col" className="px-6 py-4">Complaint / Customer</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Priority</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Submitted</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-slate-500 font-medium">Fetching complaints...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-semibold">No complaints found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Try adjusting your filters or search keywords, or submit a new complaint.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">#{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 line-clamp-1">{item.title}</span>
                        <span className="mt-0.5 text-xs text-slate-500">
                          {item.customer_name} ({item.customer_email})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold capitalize ${getStatusBadgeStyle(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${getPriorityBadgeStyle(item.priority)}`}>
                        {item.priority || 'Not Set'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${getCategoryBadgeStyle(item.category)}`}>
                        {item.category || 'Unclassified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(ROUTES.EDIT_COMPLAINT.replace(':id', item.id))}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setComplaintToDelete(item.id)}
                          className="text-rose-600 hover:text-rose-900 font-semibold text-sm transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal overlay */}
      {complaintToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100 transition-all scale-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900">Delete Complaint</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to permanently delete complaint <strong className="text-slate-700">#{complaintToDelete}</strong>? This will also remove any associated attachments and AI analysis logs.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setComplaintToDelete(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ComplaintsPage
