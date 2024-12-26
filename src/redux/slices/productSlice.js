import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: [],
  reducers: {
    setProducts: (state, action) => {
      return action.payload;
    },
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex((product) => product.id === action.payload.id);
      if (index >= 0) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
  },
});

export const { setProducts, addProduct, updateProduct } = productSlice.actions;

export default productSlice.reducer;
