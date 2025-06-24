import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductState } from "../../types";
import { productService } from "../../services/api";

export const fetchProducts =  createAsyncThunk (
    'products/fetchProducts',
    async (category? : string) => {
        if (category) {
            return await productService.getProductsByCategory(category)
        }
        return await productService.getAllProducts();
    }
);

export const fetchCategories = createAsyncThunk (
    'products/fetchCategories',
    async () => {
        return await productService.getCategories();
    }
);

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
    categories: [],
    selectedCategory: '',
};
const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchProducts.fulfilled, (state,action)=> {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'failed to fetch products';
        })
        .addCase(fetchCategories.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchCategories.fulfilled, (state, action)=> {
            state.loading = false;
            state.categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.error.message || 'error fetching categories';
        })
    },
});
export const {setSelectedCategory, clearError} = productsSlice.actions;
export default productsSlice.reducer;