import { createSlice } from '@reduxjs/toolkit';

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: [],
  reducers: {
    setInvoices: (state, action) => {
      return action.payload;
    },
    addInvoice: (state, action) => {
      state.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex((invoice) => invoice.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { setInvoices, addInvoice, updateInvoice } = invoiceSlice.actions;

export default invoiceSlice.reducer;
