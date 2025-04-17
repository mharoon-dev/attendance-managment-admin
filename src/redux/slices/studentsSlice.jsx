import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
  loading: false,
  error: "",
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    getStudentsStart: (state) => {
      state.loading = true;
    },
    getStudentsSuccess: (state, action) => {
      state.loading = false;
      state.students = action.payload;
    },
    getStudentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addStudentStart: (state) => {
      state.loading = true;
    },
    addStudentSuccess: (state, action) => {
      state.loading = false;
      state.students.push(action.payload);
    },
    addStudentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateStudentStart: (state) => {
      state.loading = true;
    },
    updateStudentSuccess: (state, action) => {
      state.loading = false;
      state.students = state.students.map((student) =>
        student._id === action.payload._id ? action.payload : student
      );
    },
    updateStudentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteStudentStart: (state) => {
      state.loading = true;
    },
    deleteStudentSuccess: (state, action) => {
      state.loading = false;
      state.students = state.students.filter(
        (student) => student._id !== action.payload
      );
    },
    deleteStudentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = studentsSlice.actions;

export const {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailure,
  addStudentStart,
  addStudentSuccess,
  addStudentFailure,
  updateStudentStart,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudentStart,
  deleteStudentSuccess,
  deleteStudentFailure,
} = actions;

export default studentsSlice.reducer;
