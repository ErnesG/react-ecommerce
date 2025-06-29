/**
 * @fileoverview Redux Store Configuration
 * 
 * Central Redux store setup using Redux Toolkit's configureStore.
 * Combines all application slices into a single store with automatic
 * middleware setup, DevTools integration, and TypeScript support.
 * 
 * @version 1.0.0
 * @see {@link https://redux-toolkit.js.org/api/configureStore} RTK configureStore Documentation
 */

import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slices/productSlice';
import cartReducer from  './slices/cartSlice';

/**
 * Redux Store Configuration
 * 
 * Creates the main Redux store using Redux Toolkit's configureStore.
 * This automatically includes several powerful features and optimizations
 * that would require manual setup in vanilla Redux.
 * 
 * 🏗️ RTK AUTOMATIC FEATURES:
 * - Redux DevTools Extension integration (development only)
 * - Thunk middleware for async operations (built-in)
 * - Immutability and serializability checks (development only)
 * - Automatic action creator generation from slices
 * - Enhanced debugging and error messages
 * 
 * 🎯 STORE ARCHITECTURE:
 * - products: Product data, categories, loading states, and filters
 * - cart: Shopping cart items, totals, and cart UI state
 * 
 * 📊 STATE STRUCTURE:
 * {
 *   products: {
 *     products: Product[],
 *     categories: string[],
 *     loading: boolean,
 *     error: string | null,
 *     selectedCategory: string
 *   },
 *   cart: {
 *     items: CartItem[],
 *     total: number,
 *     isOpen: boolean
 *   }
 * }
 * 
 * 🔧 MIDDLEWARE STACK (Automatic):
 * - Redux Thunk: Handles async actions (fetchProducts, fetchCategories)
 * - Immutability Check: Prevents accidental state mutations (dev only)
 * - Serializability Check: Ensures state can be serialized (dev only)
 * 
 * 🚀 PERFORMANCE OPTIMIZATIONS:
 * - Automatic batching of multiple dispatches
 * - Memoized selectors support via reselect
 * - Immer integration for efficient immutable updates
 * - Production optimizations (devtools and checks disabled)
 */
export const store = configureStore({
    reducer: {
        products: productReducer,    // Product management slice
        cart: cartReducer,          // Shopping cart slice
    },
    // RTK automatically adds thunk middleware and DevTools
    // Additional middleware can be added here if needed
});

/**
 * RootState Type Export
 * 
 * TypeScript type representing the complete Redux state shape.
 * Automatically inferred from the store configuration using TypeScript's
 * ReturnType utility type with the store's getState method.
 * 
 * 🎯 USAGE IN COMPONENTS:
 * - useSelector hook typing: useSelector((state: RootState) => state.products)
 * - Custom hooks: useSelector((state: RootState) => state.cart.items)
 * - Selector functions: createSelector for memoized selectors
 * 
 * 💡 BENEFITS:
 * - Full type safety for state access
 * - IntelliSense support in components
 * - Compile-time error checking
 * - Automatic updates when state shape changes
 * 
 * @example
 * // In a component
 * const products = useSelector((state: RootState) => state.products.products);
 * const cartItems = useSelector((state: RootState) => state.cart.items);
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch Type Export
 * 
 * TypeScript type for the store's dispatch function with full typing support.
 * Includes typing for async thunks and provides IntelliSense for all actions.
 * 
 * 🎯 USAGE IN COMPONENTS:
 * - useDispatch hook typing: const dispatch = useDispatch<AppDispatch>();
 * - Async thunk dispatching: dispatch(fetchProducts())
 * - Action creator dispatching: dispatch(addToCart(product))
 * 
 * 💡 BENEFITS:
 * - Type-safe action dispatching
 * - Async thunk support with proper typing
 * - IntelliSense for all available actions
 * - Compile-time validation of dispatched actions
 * 
 * @example
 * // In a component
 * const dispatch = useDispatch<AppDispatch>();
 * dispatch(fetchProducts('electronics')); // Fully typed
 * dispatch(addToCart(product)); // Type-checked
 */
export type AppDispatch = typeof store.dispatch;