/**
 * @fileoverview Custom React hook for debouncing values
 * Provides a way to delay the updating of a value until after a specified delay period
 * Useful for optimizing search inputs, API calls, and other frequently changing values
 */

import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value, delaying its update until after a specified delay
 * 
 * This hook is particularly useful for:
 * - Search input fields to avoid excessive API calls
 * - Form validation that shouldn't trigger on every keystroke  
 * - Optimizing performance when dealing with frequently changing values
 * - Preventing rapid successive function calls
 * 
 * @template T The type of the value being debounced
 * @param {T} value - The value to debounce (can be string, number, object, etc.)
 * @param {number} delay - The delay in milliseconds before updating the debounced value
 * @returns {T} The debounced value that updates after the specified delay
 * 
 * @example
 * ```tsx
 * // Debouncing a search input
 * const SearchComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // This will only run 500ms after the user stops typing
 *       performSearch(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 * 
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search products..."
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Debouncing a numeric value
 * const [count, setCount] = useState(0);
 * const debouncedCount = useDebounce(count, 1000);
 * 
 * // debouncedCount will only update 1 second after count stops changing
 * ```
 */
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        /**
         * Set up a timer to update the debounced value after the specified delay
         * If the value changes before the timer completes, the timer is cleared and reset
         */
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        /**
         * Cleanup function to clear the timeout if the value changes
         * This prevents the previous timeout from executing if a new one is set
         */
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};