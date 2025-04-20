import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  books: [],
  loading: false,
  error: "",
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    getBooksStart: (state) => {
      state.loading = true;
    },
    getBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    getBooksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBookStart: (state) => {
      state.loading = true;
    },
    addBookSuccess: (state, action) => {
      state.loading = false;
      state.books.push(action.payload);
    },
    addBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateBookStart: (state) => {
      state.loading = true;
    },
    updateBookSuccess: (state, action) => {
      state.loading = false;
      state.books = state.books.map((book) =>
        book._id === action.payload._id ? action.payload : book
      );
    },
    updateBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteBookStart: (state) => {
      state.loading = true;
    },
    deleteBookSuccess: (state, action) => {
      state.loading = false;
      state.books = state.books.filter(
        (book) => book._id !== action.payload
      );
    },
    deleteBookFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

  const actions = librarySlice.actions;

export const {
  getBooksStart,
  getBooksSuccess,
  getBooksFailure,
  addBookStart,
  addBookSuccess,
  addBookFailure,
  updateBookStart,
  updateBookSuccess,
  updateBookFailure,
  deleteBookStart,
  deleteBookSuccess,
  deleteBookFailure,
} = actions;

export default librarySlice.reducer;
