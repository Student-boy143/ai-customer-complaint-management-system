import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import complaintService from '../../services/complaintService'

// Async Thunks
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await complaintService.getComplaints(params)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchComplaintById = createAsyncThunk(
  'complaints/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await complaintService.getComplaint(id)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createComplaint = createAsyncThunk(
  'complaints/create',
  async (data, { rejectWithValue }) => {
    try {
      return await complaintService.createComplaint(data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateComplaint = createAsyncThunk(
  'complaints/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await complaintService.updateComplaint(id, data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteComplaint = createAsyncThunk(
  'complaints/delete',
  async (id, { rejectWithValue }) => {
    try {
      await complaintService.deleteComplaint(id)
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  selectedComplaint: null,
  loading: false,
  error: null,
  success: false, // flag for redirecting or showing success messages
}

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearSelectedComplaint: (state) => {
      state.selectedComplaint = null
    },
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Fetch by ID
      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedComplaint = null
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedComplaint = action.payload
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create
      .addCase(createComplaint.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.items.unshift(action.payload)
        state.total += 1
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Update
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.selectedComplaint = action.payload
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        )
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete
      .addCase(deleteComplaint.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.total -= 1
        if (state.selectedComplaint?.id === action.payload) {
          state.selectedComplaint = null
        }
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearSelectedComplaint, clearError, clearSuccess } = complaintsSlice.actions
export default complaintsSlice.reducer
