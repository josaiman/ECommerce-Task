import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services/productService';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async () => await productService.getAll()
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (product, { rejectWithValue }) => {
        try {
            return await productService.create(product);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await productService.delete(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async (product, { rejectWithValue }) => {
        try {
            return await productService.update(product);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export default productSlice.reducer;
