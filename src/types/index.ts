/**
 * @fileoverview TypeScript Type Definitions
 * 
 * Central type definitions for the React E-commerce State Management.
 * Provides type safety for products, cart functionality, and RTK - Redux Toolkit state.
 */

/**
 * Product interface - Core product data structure from API
 * Matches the structure from fakestoreapi.com
 */
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;        // Rating value (0-5)
        count: number;       // Number of reviews
    }
}

/**
 * CartItem interface - Product with quantity for cart functionality
 * Extends Product with quantity tracking for shopping cart
 */
export interface CartItem extends Product {
    quantity: number;        // Items count in cart
}

/**
 * CartState interface - Redux cart slice state
 * Manages shopping cart state including items, total, and UI state
 */
export interface CartState {
    items: CartItem[];       // Array of cart items
    total: number;           // Calculated total price
    isOpen: boolean;         // Cart modal visibility
}

/**
 * ProductState interface - Redux product slice state  
 * Manages product data, loading states, and category filtering
 */
export interface ProductState {
    products: Product[];     // Product list from API
    loading: boolean;        // API loading state
    error: string | null;    // Error message if any
    categories: string[];    // Available categories
    selectedCategory: string; // Current filter category
}