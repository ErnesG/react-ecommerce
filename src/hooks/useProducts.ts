/**
 * @fileoverview Custom React hook for managing product-related state and operations
 * Handles fetching products, categories, and managing selected category state
 * Uses Redux - RTK for state management and automatically fetches data on component mount
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";

/**
 * Custom hook for managing products and categories state
 * 
 * This hook automatically:
 * - Fetches all available categories on initial mount
 * - Fetches products based on the selected category (or all products if no category selected)
 * - Re-fetches products when the selected category changes
 * 
 * @returns {Object} Object containing product state and data
 * @returns {Product[]} returns.products - Array of products based on current selection
 * @returns {boolean} returns.loading - Loading state for async operations
 * @returns {string | null} returns.error - Error message if any operation fails
 * @returns {string[]} returns.categories - Array of available product categories
 * @returns {string | null} returns.selectedCategory - Currently selected category filter
 * 
 * @example
 * ```tsx
 * const { products, loading, error, categories, selectedCategory } = useProducts();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <div>
 *     <select onChange={(e) => dispatch(setSelectedCategory(e.target.value))}>
 *       {categories.map(category => (
 *         <option key={category} value={category}>{category}</option>
 *       ))}
 *     </select>
 *     {products.map(product => <ProductCard key={product.id} product={product} />)}
 *   </div>
 * );
 * ```
 */
export const useProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {products, loading, error, categories, selectedCategory} = useSelector(
        (state: RootState) => state.products
    );

    /**
     * Effect to fetch all available categories on component mount
     * Runs only once when the hook is first used
     */
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    /**
     * Effect to fetch products based on selected category
     * Runs when the selected category changes or on initial mount
     * If no category is selected, fetches all products
     */
    useEffect(()=>{
        dispatch(fetchProducts(selectedCategory || undefined));
    }, [dispatch, selectedCategory]);

    return {
        products,
        loading,
        error,
        categories,
        selectedCategory,
    };
};
