/**
 * @fileoverview API service for interacting with the Fake Store API
 * Provides methods for fetching products, categories, and product details
 * Uses axios for HTTP requests with proper TypeScript typing
 */

import axios from "axios";
import type { Product } from "../types";

/** Base URL for the Fake Store API */
const API_BASE_URL = "https://fakestoreapi.com"

/** Configured axios instance with base URL and timeout */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000 // 10 seconds timeout
});

/**
 * Product service containing all product-related API methods
 */
export const productService = {
    /**
     * Fetches all products from the API
     * @returns {Promise<Product[]>} Promise that resolves to an array of all products
     * @throws {Error} Throws error if API request fails
     */
    getAllProducts: async (): Promise<Product[]> => {
        const response = await api.get<Product[]>('/products');
        return response.data;
    },

    /**
     * Fetches a single product by its ID
     * @param {number} id - The unique identifier of the product
     * @returns {Promise<Product>} Promise that resolves to the product details
     * @throws {Error} Throws error if product not found or API request fails
     */
    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get<Product>(`/products/${id}`);
        return response.data;
    },

    /**
     * Fetches all available product categories
     * @returns {Promise<string[]>} Promise that resolves to an array of category names
     * @throws {Error} Throws error if API request fails
     */
    getCategories: async (): Promise<string[]> => {
        const response = await api.get<string[]>('/products/categories');
        return response.data;
    },

    /**
     * Fetches all products belonging to a specific category
     * @param {string} category - The category name to filter products by
     * @returns {Promise<Product[]>} Promise that resolves to an array of products in the specified category
     * @throws {Error} Throws error if category not found or API request fails
     */
    getProductsByCategory: async (category: string): Promise<Product[]> => {
        const response = await api.get<Product[]>(`/products/category/${category}`);
        return response.data;
    },

}
