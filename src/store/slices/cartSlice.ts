/**
 * @fileoverview Shopping Cart Redux Slice
 * 
 * Redux Toolkit slice managing shopping cart state and operations.
 * Handles cart items, totals calculation, and cart UI state using immutable updates.
 * 
 * @version 1.0.0
 * @see {@link https://redux-toolkit.js.org/api/createSlice} RTK createSlice Documentation
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartState, Product } from "../../types";

/**
 * Initial Cart State
 * 
 * Defines the default state when the application starts.
 * Cart starts empty with no items and closed modal state.
 */
const initialState: CartState = {
    items: [],          // Empty cart items array
    total: 0,          // Zero total price
    isOpen: false,     // Cart modal closed by default
};

/**
 * Cart Slice - Shopping Cart State Management
 * 
 * Creates a Redux slice using Redux Toolkit's createSlice.
 * Automatically generates action creators and action types.
 * Uses Immer under the hood for immutable state updates.
 * 
 * 🔧 RTK FEATURES USED: 
 * - Automatic action creators generation
 * - Immutable updates via Immer integration 👀: Immer is a library that allows us to write immutable code in a more readable way.
 * - Type-safe PayloadAction typing
 * - Simplified reducer syntax
 */
const cartSlice = createSlice({
    name: 'cart',              // Slice name for Redux DevTools
    initialState, 
    reducers: {
        /**
         * Add Product to Cart Action
         * 
         * Adds a product to the cart or increments quantity if already exists.
         * Automatically recalculates the total price after modification.
         * 
         * @param state - Current cart state (mutable via Immer)
         * @param action - PayloadAction containing Product to add
         * 
         * 🛍️ BUSINESS LOGIC:
         * - Check if product already exists in cart by ID
         * - If exists: increment quantity by 1
         * - If new: add with quantity 1 (spread operator creates new CartItem)
         * - Recalculate total price for all items
         */
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                // Product exists - increment quantity
                existingItem.quantity += 1;
            } else {
                // New product - add with quantity 1
                state.items.push({...action.payload, quantity: 1});
            }
            // Recalculate total price
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        /**
         * Remove Product from Cart Action
         * 
         * Completely removes a product from the cart regardless of quantity.
         * Recalculates total after removal.
         * 
         * @param state - Current cart state (mutable via Immer)  
         * @param action - PayloadAction containing product ID to remove
         * 
         * 🗑️ BUSINESS LOGIC:
         * - Filter out item by ID (removes completely)
         * - Recalculate total for remaining items
         */
        removeFromCart: (state, action: PayloadAction<number>) =>{
            state.items = state.items.filter( item => item.id !== action.payload);
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        /**
         * Update Item Quantity Action
         * 
         * Updates the quantity of a specific cart item.
         * Used for quantity controls in cart UI (+/- buttons).
         * 
         * @param state - Current cart state (mutable via Immer)
         * @param action - PayloadAction with {id: number, quantity: number}
         * 
         * 🔢 BUSINESS LOGIC:
         * - Find item by ID
         * - Update quantity to exact value (not increment)
         * - Recalculate total price
         * - Handles both increase and decrease operations
         */
        updateQuantity: (state, action: PayloadAction<{id: number, quantity:  number}>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            }
        },

        /**
         * Toggle Cart Modal Action
         * 
         * Toggles the visibility of the shopping cart modal/drawer.
         * Simple boolean state flip for UI control.
         */
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },

        /**
         * Clear Cart Action
         * 
         * Empties the entire cart and resets total to zero.
         * Used for checkout completion or manual cart clearing.
         * 
         * 🧹 CLEANUP LOGIC:
         * - Reset items to empty array
         * - Reset total to 0
         * - Keep modal state unchanged
         */
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

/**
 * Export Action Creators
 * 
 * RTK automatically generates typed action creators from reducer names.
 * These can be dispatched directly in components via useDispatch hook.
 */
export const { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } = cartSlice.actions;

/**
 * Export Reducer
 * 
 * Default export is the reducer function for store configuration.
 * Combined with other slices in src/store/index.ts
 */
export default cartSlice.reducer;