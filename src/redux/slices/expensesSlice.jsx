import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  loading: false,
  error: "",
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    getExpensesStart: (state) => {
      state.loading = true;
    },
    getExpensesSuccess: (state, action) => {
      state.loading = false;
      state.expenses = action.payload;
    },
    getExpensesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addExpenseStart: (state) => {
      state.loading = true;
    },
    addExpenseSuccess: (state, action) => {
      state.loading = false;
      state.expenses.push(action.payload);
    },
    addExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateExpenseStart: (state) => {
      state.loading = true;
    },
    updateExpenseSuccess: (state, action) => {
      state.loading = false;
      state.expenses = state.expenses.map((exp) =>
        exp._id === action.payload._id ? action.payload : exp
      );
    },
    updateExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteExpenseStart: (state) => {
      state.loading = true;
    },
    deleteExpenseSuccess: (state, action) => {
      state.loading = false;
      state.expenses = state.expenses.filter(
        (exp) => exp._id !== action.payload
      );
    },
    deleteExpenseFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = expensesSlice.actions;

export const {
  getExpensesStart,
  getExpensesSuccess,
  getExpensesFailure,
  addExpenseStart,
  addExpenseSuccess,
  addExpenseFailure,
  updateExpenseStart,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpenseStart,
  deleteExpenseSuccess,
  deleteExpenseFailure,
} = actions;

export default expensesSlice.reducer;
