import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponService } from '../services/couponService';

export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async (code, { getState, rejectWithValue }) => {
    const { cart } = getState();
    try {
      return await couponService.validate(code, cart.subtotal);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  coupon: null,
  error: null,
};

const calculateTotals = (state) => {
  state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  state.tax = state.subtotal * 0.18; // 18% GST estimate

  let discountAmount = 0;
  if (state.coupon) {
    if (state.coupon.type === 'percent') {
      discountAmount = (state.subtotal * state.coupon.value) / 100;
    } else {
      discountAmount = state.coupon.value;
    }
  }

  state.discount = Math.min(discountAmount, state.subtotal); // Can't exceed subtotal
  state.total = state.subtotal + state.tax - state.discount;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item && qty > 0) {
        item.qty = qty;
        calculateTotals(state);
      }
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.error = null;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.discount = 0;
      state.total = 0;
      state.coupon = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.coupon = action.payload;
        calculateTotals(state);
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.error = action.payload;
        state.coupon = null;
        calculateTotals(state); // re-calc to remove discount if any was stuck (though it shouldn't be)
      });
  }
});

export const { addToCart, removeFromCart, updateQuantity, removeCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
