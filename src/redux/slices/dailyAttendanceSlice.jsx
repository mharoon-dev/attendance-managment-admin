import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dailyAttendance: [],
  loading: false,
  error: "",
};

const dailyAttendanceSlice = createSlice({
  name: "dailyAttendance",
  initialState,
  reducers: {
    getDailyAttendanceStart: (state) => {
      state.loading = true;
    },
    getDailyAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.dailyAttendance = action.payload;
    },
    getDailyAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addDailyAttendanceStart: (state) => {
      state.loading = true;
    },
    addDailyAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.dailyAttendance.push(action.payload);
    },
    addDailyAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateDailyAttendanceStart: (state) => {
      state.loading = true;
    },
    updateDailyAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.dailyAttendance = state.dailyAttendance.map((dailyAttendance) =>
        dailyAttendance._id === action.payload._id ? action.payload : dailyAttendance
      );
    },
    updateDailyAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteDailyAttendanceStart: (state) => {
      state.loading = true;
    },
    deleteDailyAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.dailyAttendance = state.dailyAttendance.filter(
        (dailyAttendance) => dailyAttendance._id !== action.payload
      );
    },
    deleteDailyAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = dailyAttendanceSlice.actions;

export const {
  getDailyAttendanceStart,
  getDailyAttendanceSuccess,
  getDailyAttendanceFailure,
  addDailyAttendanceStart,
  addDailyAttendanceSuccess,
  addDailyAttendanceFailure,
  updateDailyAttendanceStart,
  updateDailyAttendanceSuccess,
  updateDailyAttendanceFailure,
  deleteDailyAttendanceStart,
  deleteDailyAttendanceSuccess,
  deleteDailyAttendanceFailure,
} = actions;

export default dailyAttendanceSlice.reducer;
