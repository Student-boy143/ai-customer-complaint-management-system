import api from './api'

/**
 * Service to handle all API operations for complaints.
 */
export const complaintService = {
  /**
   * Fetch all complaints with pagination and filtering.
   * @param {Object} params - { skip, limit, status }
   */
  getComplaints: async (params = {}) => {
    const response = await api.get('/api/complaints', { params })
    return response.data
  },

  /**
   * Fetch a single complaint by ID.
   * @param {number|string} id
   */
  getComplaint: async (id) => {
    const response = await api.get(`/api/complaints/${id}`)
    return response.data
  },

  /**
   * Create a new complaint.
   * @param {Object} data - { title, description, customer_name, customer_email }
   */
  createComplaint: async (data) => {
    const response = await api.post('/api/complaints', data)
    return response.data
  },

  /**
   * Update a complaint.
   * @param {number|string} id
   * @param {Object} data - fields to update
   */
  updateComplaint: async (id, data) => {
    const response = await api.put(`/api/complaints/${id}`, data)
    return response.data
  },

  /**
   * Delete a complaint.
   * @param {number|string} id
   */
  deleteComplaint: async (id) => {
    const response = await api.delete(`/api/complaints/${id}`)
    return response.data
  },
}

export default complaintService
