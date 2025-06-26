import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const bookParcel = createAsyncThunk("parcel/book", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post("/parcels", data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const getMyParcels = createAsyncThunk("parcel/myParcels", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/parcels/my");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const parcelSlice = createSlice({
  name: "parcel",
  initialState: {
    myParcels: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookParcel.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Parcel booked successfully!";
        state.myParcels.push(action.payload);
      })
      .addCase(bookParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMyParcels.fulfilled, (state, action) => {
        state.myParcels = action.payload;
      });
  },
});

export const { clearMessages } = parcelSlice.actions;
export default parcelSlice.reducer;
