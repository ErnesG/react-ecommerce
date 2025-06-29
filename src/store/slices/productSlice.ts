/**
 * @fileoverview Product Management Redux Slice
 * 
 * Redux Toolkit slice managing product data, categories, and async operations.
 * Handles API calls for products and categories using RTK async thunks with
 * comprehensive loading and error state management. Async thunks enable proper
 * asynchronous operations in Redux while keeping the UI responsive during API calls.
 * 
 * 🔍 WHY USE ASYNC THUNKS?:
 * 
 * 1. 🏗️ **Redux Async Integration**
 *    - Redux only handles synchronous actions by default
 *    - Async thunks bridge the gap between async operations and Redux state
 *    - Provides standardized way to handle async logic in Redux applications
 *    - Maintains Redux's predictable state flow even with async operations
 * 
 * 2. 🎯 **UI Responsiveness & User Experience**
 *    - Prevents UI freezing during network requests
 *    - Allows user interactions while API calls are in progress
 *    - Enables smooth loading states and progress indicators
 *    - Maintains application responsiveness during data fetching
 * 
 * 3. 📊 **Automatic Lifecycle Management**
 *    - Automatically generates pending/fulfilled/rejected action types
 *    - Handles three states of async operations without manual coding
 *    - Provides consistent pattern for all async operations
 *    - Reduces boilerplate code for async state management
 * 
 * 4. 🛡️ **Built-in Error Handling**
 *    - Automatic error catching and state updates
 *    - Standardized error handling across all async operations
 *    - Provides error.message for user-friendly error display
 *    - Enables retry mechanisms and error recovery patterns
 * 
 * 5. 🔄 **Loading State Management**
 *    - Automatic loading state updates (true/false)
 *    - Consistent loading indicators across the application
 *    - Prevents duplicate requests during ongoing operations
 *    - Enables skeleton loading and progress states
 * 
 * 6. 🎪 **State Integration & Normalization**
 *    - Direct integration with Redux store and selectors
 *    - Seamless state updates after async operations complete
 *    - Maintains single source of truth for application data
 *    - Enables optimistic updates and cache management
 * 
 * 7. 🔧 **Type Safety & Developer Experience**
 *    - Full TypeScript support with typed payloads
 *    - IntelliSense and auto-completion in IDEs
 *    - Compile-time error checking for async operations
 *    - Consistent API across all async thunks
 * 
 * 8. 🧪 **Testing & Debugging**
 *    - Redux DevTools integration for async action tracking
 *    - Easy to mock and test async operations
 *    - Clear action history for debugging
 *    - Predictable state changes for unit testing
 * 
 * 9. 🏛️ **Architecture & Code Organization**
 *    - Centralizes async logic in Redux slices
 *    - Separates business logic from UI components
 *    - Reusable async operations across components
 *    - Maintains clean component code focused on presentation
 * 
 * 10. 🚀 **Performance & Optimization**
 *     - Prevents unnecessary re-renders during async operations
 *     - Enables request deduplication and caching strategies  
 *     - Supports conditional fetching based on current state
 *     - Allows for request cancellation and cleanup
 * 
 * @version 1.0.0
 * @see {@link https://redux-toolkit.js.org/api/createAsyncThunk} RTK Async Thunk Documentation
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductState } from "../../types";
import { productService } from "../../services/api";

/**
 * Async Thunk - Fetch Products
 * 
 * RTK async thunk for fetching products with optional category filtering.
 * Handles both "all products" and "category-specific" API calls automatically.
 * 
 * @param category - Optional category filter to fetch products by specific category
 * @returns Promise<Product[]> - Array of products from API
 * 
 * 🔄 ASYNC FLOW:
 * - Pending: Sets loading to true, clears errors
 * - Fulfilled: Updates products array, sets loading to false
 * - Rejected: Sets error message, stops loading
 * 
 * 🎯 BUSINESS LOGIC:
 * - If category provided: fetch category-specific products
 * - If no category: fetch all products
 * - Automatically handled by extraReducers
 * 
 * @example
 * // Fetch all products
 * dispatch(fetchProducts())
 * 
 * // Fetch products by category
 * dispatch(fetchProducts('electronics'))
 */
export const fetchProducts =  createAsyncThunk (
    'products/fetchProducts',
    async (category? : string) => {
        if (category) {
            return await productService.getProductsByCategory(category)
        }
        return await productService.getAllProducts();
    }
);

/**
 * Async Thunk - Fetch Categories
 * 
 * RTK async thunk for fetching all available product categories.
 * Used to populate category filters in the UI for product browsing.
 * 
 * @returns Promise<string[]> - Array of category names from API
 * 
 * 🔄 ASYNC FLOW:
 * - Pending: Sets loading to true
 * - Fulfilled: Updates categories array, sets loading to false
 * - Rejected: Sets error message, stops loading
 * 
 * 💡 UI INTEGRATION:
 * - Categories used for filter buttons in header
 * - Enables category-based product browsing
 * - Fetched once on app initialization
 * 
 * @example
 * dispatch(fetchCategories())
 */
export const fetchCategories = createAsyncThunk (
    'products/fetchCategories',
    async () => {
        return await productService.getCategories();
    }
);

/**
 * Initial Product State
 * 
 * Defines the default state when the application starts.
 * Includes arrays for data, loading states, and UI state tracking.
 * 
 * @type {ProductState}
 */
const initialState: ProductState = {
    products: [],           // Empty products array
    loading: false,         // No loading initially
    error: null,           // No errors initially
    categories: [],        // Empty categories array
    selectedCategory: '',  // No category filter selected
};

/**
 * Products Slice - Product Data & Category Management
 * 
 * Creates a Redux slice using Redux Toolkit's createSlice with async thunk support.
 * Combines synchronous reducers with extraReducers for async action handling.
 * 
 * 🔧 RTK FEATURES USED:
 * - createAsyncThunk for API calls with automatic action generation
 * - extraReducers for handling async thunk lifecycle
 * - Immutable updates via Immer integration 👀: Immer allows readable immutable updates
 * - Type-safe action creators and state updates
 * 
 * 📊 STATE MANAGEMENT:
 * - Products: Array of product data from API
 * - Categories: Array of available categories for filtering
 * - Loading: Boolean for UI loading indicators
 * - Error: String for error messages (null when no error)
 * - SelectedCategory: Current filter selection
 */
const productsSlice = createSlice({
    name: 'products',
    initialState,
    /**
     * Synchronous Reducers
     * 
     * Handle immediate state updates without async operations.
     * These actions are dispatched directly from UI components.
     */
    reducers: {
        /**
         * Set Selected Category Action
         * 
         * Updates the selected category for product filtering.
         * Triggers re-fetch of products when category changes via useEffect in useProducts hook.
         * 
         * @param state - Current product state (mutable via Immer)
         * @param action - Action with category string payload
         * 
         * 🎯 BUSINESS LOGIC:
         * - Updates selectedCategory in state
         * - Empty string means "all categories"
         * - Triggers product re-fetch via useProducts hook
         * 
         * @example
         * dispatch(setSelectedCategory('electronics'))  // Filter by electronics
         * dispatch(setSelectedCategory(''))             // Show all products
         */
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },

        /**
         * Clear Error Action
         * 
         * Resets error state to null for UI error handling.
         * Used when user dismisses error messages or retries operations.
         * 
         * @param state - Current product state (mutable via Immer)
         * 
         * 🧹 ERROR HANDLING:
         * - Clears any existing error messages
         * - Allows UI to hide error notifications
         * - Prepares for retry operations
         * 
         * @example
         * dispatch(clearError())
         */
        clearError: (state) => {
            state.error = null;
        }
    },
    /**
     * Extra Reducers - Async Thunk Lifecycle Handling
     * 
     * Handles the three states of async thunks: pending, fulfilled, rejected.
     * RTK automatically generates these action types from async thunk names.
     * 
     * 🔄 ASYNC PATTERN:
     * - Pending: Set loading state, clear errors
     * - Fulfilled: Update data, clear loading
     * - Rejected: Set error message, clear loading
     */
    extraReducers: (builder) => {
        builder
        /**
         * Fetch Products Async Handlers
         * 
         * Handles all three states of the fetchProducts async thunk.
         * Manages loading state and error handling for product fetching.
         */
        // Products fetch started
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;    // Clear previous errors
        })
        // Products fetch successful
        .addCase(fetchProducts.fulfilled, (state,action)=> {
            state.loading = false;
            state.products = action.payload;  // Replace entire products array
        })
        // Products fetch failed
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'failed to fetch products';
        })

        /**
         * Fetch Categories Async Handlers
         * 
         * Handles all three states of the fetchCategories async thunk.
         * Categories are typically fetched once on app initialization.
         */
        // Categories fetch started
        .addCase(fetchCategories.pending, (state) => {
            state.loading = true;  // Shared loading state with products
        })
        // Categories fetch successful
        .addCase(fetchCategories.fulfilled, (state, action)=> {
            state.loading = false;
            state.categories = action.payload;  // Replace entire categories array
        })
        // Categories fetch failed
        .addCase(fetchCategories.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.error.message || 'error fetching categories';
        })
    },
});

/**
 * Export Synchronous Action Creators
 * 
 * RTK automatically generates typed action creators from reducer names.
 * These handle immediate state updates without async operations.
 * 
 * @exports setSelectedCategory - Action to set the selected category filter
 * @exports clearError - Action to clear error state for UI error handling
 */
export const {setSelectedCategory, clearError} = productsSlice.actions;

/**
 * Export Products Reducer
 * 
 * Default export is the reducer function for store configuration.
 * Combined with cart reducer in src/store/index.ts for complete app state.
 * 
 * @exports productsSlice.reducer - The complete reducer handling both sync and async actions
 */
export default productsSlice.reducer;