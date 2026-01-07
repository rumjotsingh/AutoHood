import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosInstance";

// Async thunks
export const sendInquiry = createAsyncThunk(
  "inquiries/sendInquiry",
  async ({ carId, message, phone }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/inquiries/car/${carId}`, {
        message,
        phone,
      });
      return response.data.inquiry;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send inquiry"
      );
    }
  }
);

export const fetchSentInquiries = createAsyncThunk(
  "inquiries/fetchSentInquiries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/inquiries/sent");
      return response.data.inquiries;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sent inquiries"
      );
    }
  }
);

export const fetchReceivedInquiries = createAsyncThunk(
  "inquiries/fetchReceivedInquiries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/inquiries/received");
      return response.data.inquiries;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch received inquiries"
      );
    }
  }
);

export const replyToInquiry = createAsyncThunk(
  "inquiries/replyToInquiry",
  async ({ inquiryId, reply }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/v1/inquiries/reply/${inquiryId}`, {
        reply,
      });
      return response.data.inquiry;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reply to inquiry"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "inquiries/markAsRead",
  async (inquiryId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/v1/inquiries/read/${inquiryId}`);
      return response.data.inquiry;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "inquiries/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/v1/inquiries/unread-count");
      return response.data.unreadCount;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

const initialState = {
  sentInquiries: [],
  receivedInquiries: [],
  unreadCount: 0,
  sendingInquiry: false,
  loadingSent: false,
  loadingReceived: false,
  replyingTo: null,
  error: null,
  successMessage: null,
};

const inquiriesSlice = createSlice({
  name: "inquiries",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send inquiry
      .addCase(sendInquiry.pending, (state) => {
        state.sendingInquiry = true;
        state.error = null;
      })
      .addCase(sendInquiry.fulfilled, (state, action) => {
        state.sendingInquiry = false;
        state.sentInquiries.unshift(action.payload);
        state.successMessage = "Inquiry sent successfully!";
      })
      .addCase(sendInquiry.rejected, (state, action) => {
        state.sendingInquiry = false;
        state.error = action.payload;
      })

      // Fetch sent inquiries
      .addCase(fetchSentInquiries.pending, (state) => {
        state.loadingSent = true;
        state.error = null;
      })
      .addCase(fetchSentInquiries.fulfilled, (state, action) => {
        state.loadingSent = false;
        state.sentInquiries = action.payload;
      })
      .addCase(fetchSentInquiries.rejected, (state, action) => {
        state.loadingSent = false;
        state.error = action.payload;
      })

      // Fetch received inquiries
      .addCase(fetchReceivedInquiries.pending, (state) => {
        state.loadingReceived = true;
        state.error = null;
      })
      .addCase(fetchReceivedInquiries.fulfilled, (state, action) => {
        state.loadingReceived = false;
        state.receivedInquiries = action.payload;
      })
      .addCase(fetchReceivedInquiries.rejected, (state, action) => {
        state.loadingReceived = false;
        state.error = action.payload;
      })

      // Reply to inquiry
      .addCase(replyToInquiry.pending, (state) => {
        state.error = null;
      })
      .addCase(replyToInquiry.fulfilled, (state, action) => {
        const index = state.receivedInquiries.findIndex(
          (inq) => inq._id === action.payload._id
        );
        if (index !== -1) {
          state.receivedInquiries[index] = action.payload;
        }
        state.replyingTo = null;
        state.successMessage = "Reply sent successfully!";
      })
      .addCase(replyToInquiry.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.receivedInquiries.findIndex(
          (inq) => inq._id === action.payload._id
        );
        if (index !== -1) {
          state.receivedInquiries[index] = action.payload;
        }
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, setReplyingTo } =
  inquiriesSlice.actions;

export default inquiriesSlice.reducer;
