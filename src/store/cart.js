import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  basketData: {
    total_price_in_basket: 0,
    total_price_final_in_basket: 0,
    total_discount_in_basket: 0,
    shipping: 0,
    total_basket_quantity: 0,
  },
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBasketData: (state, action) => {
      const { data, basket_data } = action.payload;
      state.items = data || [];
      state.basketData = basket_data || initialState.basketData;
      state.error = null;
    },
    updateBasketData: (state, action) => {
      state.basketData = { ...state.basketData, ...action.payload };
    },
    addItem: (state, action) => {
      const { data, basket_data } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === data.id);
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex] = data;
      } else {
        state.items.push(data);
      }
      
      if (basket_data) {
        state.basketData = basket_data;
      }
    },
    removeItem: (state, action) => {
      const { productId, basket_data } = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      if (basket_data) {
        state.basketData = basket_data;
      }
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity, basket_data } = action.payload;
      
      if (quantity === 0) {
        state.items = state.items.filter(item => item.uuid !== productId);
      } else {
        const itemIndex = state.items.findIndex(item => item.uuid === productId);
        if (itemIndex >= 0) {
          state.items[itemIndex] = {
            ...state.items[itemIndex],
            basket_quantity: quantity,
            price_in_basket: state.items[itemIndex].price * quantity,
            price_final_in_basket: state.items[itemIndex].price_final * quantity,
          };
        }
      }
      
      if (basket_data) {
        state.basketData = basket_data;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.basketData = initialState.basketData;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setBasketData,
  updateBasketData,
  addItem,
  removeItem,
  updateItemQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectBasketData = (state) => state.cart.basketData;
export const selectTotalItems = (state) => state.cart.basketData.total_basket_quantity;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;

