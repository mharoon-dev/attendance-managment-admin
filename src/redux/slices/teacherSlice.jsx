import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachers: [],
  loading: false,
  error: "",
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    getTeachersStart: (state) => {
      state.loading = true;
    },
    getTeachersSuccess: (state, action) => {
      state.loading = false;
      state.teachers = action.payload;
    },
    getTeachersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTeacherStart: (state) => {
      state.loading = true;
    },
    addTeacherSuccess: (state, action) => {
      state.loading = false;
      state.teachers.push(action.payload);
    },
    addTeacherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateTeacherStart: (state) => {
      state.loading = true;
    },
    updateTeacherSuccess: (state, action) => {
      state.loading = false;
      state.teachers = state.teachers.map((teacher) =>
        teacher._id === action.payload._id ? action.payload : teacher
      );
    },
    updateTeacherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteTeacherStart: (state) => {
      state.loading = true;
    },
    deleteTeacherSuccess: (state, action) => {
      state.loading = false;
      state.teachers = state.teachers.filter(
        (teacher) => teacher._id !== action.payload
      );
    },
    deleteTeacherFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = teacherSlice.actions;

export const {
  getTeachersStart,
  getTeachersSuccess,
  getTeachersFailure,
  addTeacherStart,
  addTeacherSuccess,
  addTeacherFailure,
  updateTeacherStart,
  updateTeacherSuccess,
  updateTeacherFailure,
  deleteTeacherStart,
  deleteTeacherSuccess,
  deleteTeacherFailure,
} = actions;

export default teacherSlice.reducer;
