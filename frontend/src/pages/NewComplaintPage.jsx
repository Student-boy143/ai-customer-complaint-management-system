import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createComplaint, clearSuccess, clearError } from '../redux/slices/complaintsSlice'
import { ROUTES } from '../utils/constants'

function NewComplaintPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, success } = useSelector((state) => state.complaints)

  // Local form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_name: '',
    customer_email: '',
  })

  const [validationErrors, setValidationErrors] = useState({})

  // Clear states when component mounts/unmounts
  useEffect(() => {
    dispatch(clearSuccess())
    dispatch(clearError())
    return () => {
      dispatch(clearSuccess())
      dispatch(clearError())
    }
  }, [dispatch])

  // Redirect on success
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
    // Clear validation error when typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(createComplaint(formData))
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Submit a Complaint</h1>
          <p className="mt-1 text-sm text-slate-500">
            Provide the details of your issue below to log a new complaint.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.COMPLAINTS)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Details Group */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Your Name
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
                placeholder="e.g. John Doe"
              />
              {validationErrors.customer_name && (
                <p className="mt-1.5 text-xs text-rose-600">{validationErrors.customer_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
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
                placeholder="e.g. john@example.com"
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
              placeholder="Brief summary of the issue"
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
              rows={5}
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 transition-all resize-y ${
                validationErrors.description
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200/50'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200/50'
              }`}
              placeholder="Describe the problem in detail so our support staff can investigate it..."
            />
            {validationErrors.description && (
              <p className="mt-1.5 text-xs text-rose-600">{validationErrors.description}</p>
            )}
          </div>

          {/* Submit Button */}
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
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default NewComplaintPage
