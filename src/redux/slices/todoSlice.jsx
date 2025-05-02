import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    getTodosStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTodosSuccess: (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    },
    getTodosFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTodoSuccess: (state, action) => {
      state.todos.unshift(action.payload);
    },
    updateTodoSuccess: (state, action) => {
      const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodoSuccess: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
  },
});

export const {
  getTodosStart,
  getTodosSuccess,
  getTodosFailure,
  addTodoSuccess,
  updateTodoSuccess,
  deleteTodoSuccess,
} = todoSlice.actions;

export default todoSlice.reducer; 