import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subjects: [],
  loading: false,
  error: "",
};

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    getSubjectsStart: (state) => {
      state.loading = true;
    },
    getSubjectsSuccess: (state, action) => {
      state.loading = false;
      state.subjects = action.payload;
    },
    getSubjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addSubjectStart: (state) => {
      state.loading = true;
    },
    addSubjectSuccess: (state, action) => {
      state.loading = false;
      state.subjects.push(action.payload);
    },
    addSubjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateSubjectStart: (state) => {
      state.loading = true;
    },
    updateSubjectSuccess: (state, action) => {
      state.loading = false;
      state.subjects = state.subjects.map((subject) =>
        subject._id === action.payload._id ? action.payload : subject
      );
    },
    updateSubjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteSubjectStart: (state) => {
      state.loading = true;
    },
    deleteSubjectSuccess: (state, action) => {
      state.loading = false;
      state.subjects = state.subjects.filter(
        (subject) => subject._id !== action.payload
      );
    },
    deleteSubjectFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

const actions = subjectSlice.actions;

export const {
  getSubjectsStart,
  getSubjectsSuccess,
  getSubjectsFailure,
  addSubjectStart,
  addSubjectSuccess,
  addSubjectFailure,
  updateSubjectStart,
  updateSubjectSuccess,
  updateSubjectFailure,
  deleteSubjectStart,
  deleteSubjectSuccess,
  deleteSubjectFailure,
} = actions;

export default subjectSlice.reducer;
