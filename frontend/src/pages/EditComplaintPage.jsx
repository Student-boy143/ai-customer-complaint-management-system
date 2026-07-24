import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
  fetchComplaintById,
  updateComplaint,
  clearSuccess,
  clearError,
} from '../redux/slices/complaintsSlice'
import { ROUTES } from '../utils/constants'

function EditComplaintPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { selectedComplaint, loading, error, success } = useSelector((state) => state.complaints)

  // Local form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_name: '',
    customer_email: '',
    status: 'pending',
    priority: '',
    category: '',
    ai_summary: '',
    ai_suggested_response: '',
  })

  const [validationErrors, setValidationErrors] = useState({})

  // Fetch complaint details on mount/ID change
  useEffect(() => {
    dispatch(clearSuccess())
    dispatch(clearError())
    if (id) {
      dispatch(fetchComplaintById(id))
    }
  }, [dispatch, id])

  // Populate form state when complaint is fetched
  useEffect(() => {
    if (selectedComplaint) {
      setFormData({
        title: selectedComplaint.title || '',
        description: selectedComplaint.description || '',
        customer_name: selectedComplaint.customer_name || '',
        customer_email: selectedComplaint.customer_email || '',
        status: selectedComplaint.status || 'pending',
        priority: selectedComplaint.priority || '',
        category: selectedComplaint.category || '',
        ai_summary: selectedComplaint.ai_summary || '',
        ai_suggested_response: selectedComplaint.ai_suggested_response || '',
      })
    }
  }, [selectedComplaint])

  // Redirect on successful update
  useEffect(() => {
    if (success) {
      navigate(ROUTES.COMPLAINTS)
    }
  }, [success, navigate])

  const validate = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = 'Title is required'
    else if (formData.title.length > 255) errors.title = 'Title cannot exceed 255 characters'

    if (!formData.description.trim()) errors.description = 'Description is required'

    if (!formData.customer_name.trim()) errors.customer_name = 'Customer name is required'
    else if (formData.customer_name.length > 150) errors.customer_name = 'Name cannot exceed 150 characters'

    if (!formData.customer_email.trim()) {
      errors.customer_email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      errors.customer_email = 'Please enter a valid email address'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Transform empty strings for optional fields into null values for database compatibility
    const submissionData = {
      ...formData,
      priority: formData.priority || null,
      category: formData.category || null,
      ai_summary: formData.ai_summary || null,
      ai_suggested_response: formData.ai_suggested_response || null,
    }

    dispatch(updateComplaint({ id, data: submissionData }))
  }

  if (loading && !selectedComplaint) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium text-slate-500">Loading complaint details...</span>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Complaint #{id}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Modify the complaint fields and workflow status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.COMPLAINTS)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main form area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {error && (
              <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Customer Details */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.customer_name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200/50'
                    }`}
                  />
                  {validationErrors.customer_name && (
                    <p className="mt-1.5 text-xs text-rose-600">{validationErrors.customer_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="customer_email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    id="customer_email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 transition-all ${
                      validationErrors.customer_email
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200/50'
                    }`}
                  />
                  {validationErrors.customer_email && (
                    <p className="mt-1.5 text-xs text-rose-600">{validationErrors.customer_email}</p>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Complaint Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    validationErrors.title
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200/50'
                  }`}
                />
                {validationErrors.title && (
                  <p className="mt-1.5 text-xs text-rose-600">{validationErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 transition-all resize-y ${
                    validationErrors.description
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200/50'
                  }`}
                />
                {validationErrors.description && (
                  <p className="mt-1.5 text-xs text-rose-600">{validationErrors.description}</p>
                )}
              </div>

              {/* AI Summary (Optional) */}
              <div>
                <label htmlFor="ai_summary" className="block text-sm font-medium text-slate-700 mb-1.5">
                  AI Summary
                </label>
                <textarea
                  id="ai_summary"
                  name="ai_summary"
                  rows={3}
                  value={formData.ai_summary}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all resize-y"
                  placeholder="AI generated summary will appear here"
                />
              </div>

              {/* AI Suggested Response (Optional) */}
              <div>
                <label htmlFor="ai_suggested_response" className="block text-sm font-medium text-slate-700 mb-1.5">
                  AI Suggested Response
                </label>
                <textarea
                  id="ai_suggested_response"
                  name="ai_suggested_response"
                  rows={4}
                  value={formData.ai_suggested_response}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all resize-y"
                  placeholder="AI suggested response will appear here"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.COMPLAINTS)}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar for settings/metadata */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Status & Assignment
            </h2>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1.5">
                Complaint Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1.5">
                Priority Urgency
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all cursor-pointer"
              >
                <option value="">-- Not Assigned --</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
                Classification Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50 transition-all cursor-pointer"
              >
                <option value="">-- Not Categorized --</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Date Details */}
            {selectedComplaint && (
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                <div>
                  <span className="font-medium text-slate-700">Created: </span>
                  {new Date(selectedComplaint.created_at).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium text-slate-700">Last Updated: </span>
                  {new Date(selectedComplaint.updated_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default EditComplaintPage
