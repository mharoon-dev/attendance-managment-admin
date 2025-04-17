import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  classes: [],
  loading: false,
  error: "",
};

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    getClassesStart: (state) => {
      state.loading = true;
    },
    getClassesSuccess: (state, action) => {
      state.loading = false;
      state.classes = action.payload;
    },
    getClassesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addClassStart: (state) => {
      state.loading = true;
    },
    addClassSuccess: (state, action) => {
      state.loading = false;
      state.classes.push(action.payload);
    },
    addClassFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateClassStart: (state) => {
      state.loading = true;
    },
    updateClassSuccess: (state, action) => {
      state.loading = false;
      state.classes = state.classes.map((cla) =>
        cla._id === action.payload._id ? action.payload : cla
      );
    },
    updateClassFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteClassStart: (state) => {
      state.loading = true;
    },
    deleteClassSuccess: (state, action) => {
      state.loading = false;
      state.classes = state.classes.filter(
        (cla) => cla._id !== action.payload
      );
    },
    deleteClassFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = classesSlice.actions;

export const {
  getClassesStart,
  getClassesSuccess,
  getClassesFailure,
  addClassStart,
  addClassSuccess,
  addClassFailure,
  updateClassStart,
  updateClassSuccess,
  updateClassFailure,
  deleteClassStart,
  deleteClassSuccess,
  deleteClassFailure,
} = actions;

export default classesSlice.reducer;
