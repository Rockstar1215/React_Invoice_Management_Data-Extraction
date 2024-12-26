import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customers',
  initialState: [],
  reducers: {
    setCustomers: (state, action) => {
      return action.payload;
    },
    addCustomer: (state, action) => {
      state.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.findIndex((customer) => customer.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { setCustomers, addCustomer, updateCustomer } = customerSlice.actions;

export default customerSlice.reducer;
