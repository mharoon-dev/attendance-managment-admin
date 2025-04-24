import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomes: [],
  loading: false,
  error: "",
};

const incomesSlice = createSlice({
  name: "incomes",
  initialState,
  reducers: {
    getIncomesStart: (state) => {
      state.loading = true;
    },
    getIncomesSuccess: (state, action) => {
      state.loading = false;
      state.incomes = action.payload;
    },
    getIncomesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addIncomeStart: (state) => {
      state.loading = true;
    },
    addIncomeSuccess: (state, action) => {
      state.loading = false;
      state.incomes.push(action.payload);
    },
    addIncomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateIncomeStart: (state) => {
      state.loading = true;
    },
    updateIncomeSuccess: (state, action) => {
      state.loading = false;
      state.incomes = state.incomes.map((inc) =>
        inc._id === action.payload._id ? action.payload : inc
      );
    },
    updateIncomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteIncomeStart: (state) => {
      state.loading = true;
    },
    deleteIncomeSuccess: (state, action) => {
      state.loading = false;
      state.incomes = state.incomes.filter(
        (inc) => inc._id !== action.payload
      );
    },
    deleteIncomeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const actions = incomesSlice.actions;

export const {
  getIncomesStart,
  getIncomesSuccess,
  getIncomesFailure,
  addIncomeStart,
  addIncomeSuccess,
  addIncomeFailure,
  updateIncomeStart,
  updateIncomeSuccess,
  updateIncomeFailure,
  deleteIncomeStart,
  deleteIncomeSuccess,
  deleteIncomeFailure,
} = actions;

export default incomesSlice.reducer;
