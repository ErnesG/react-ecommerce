/**
 * @fileoverview HeaderProps - Type definitions for Header component properties
 * 
 * Defines the comprehensive props interface for the application header component,
 * enabling navigation, search functionality, category filtering, and cart management.
 * These props are specifically designed to support React.memo optimization patterns
 * and efficient header operations in high-frequency e-commerce scenarios where
 * headers must remain responsive during frequent state updates.
 */

/**
 * Props interface for the Header component
 * 
 * @performance Critical Performance Advantages
 * 
 * **1. Always-Visible Component Optimization**
 * - Header remains mounted throughout entire application lifecycle
 * - React.memo prevents unnecessary re-renders from parent state changes
 * - Essential for maintaining smooth navigation experience
 * - Critical for user experience as header is constantly visible
 * 
 * **2. High-Frequency Update Management**
 * - Cart count updates on every add/remove operation
 * - Search queries trigger frequent onSearch calls
 * - Category changes affect entire product display
 * - Optimized props prevent cascade re-renders throughout app
 * 
 * **3. Callback Function Memoization Support**
 * - All handler props designed for useCallback optimization
 * - Prevents SearchBar and CategoryFilter child re-renders
 * - Critical for responsive user interactions (search, category selection)
 * - Maintains stable references for event handlers
 * 
 * **4. Primitive Props Stability**
 * - `cartItemCount` and `selectedCategory` provide stable comparisons
 * - Enables efficient shallow comparison in React.memo
 * - Prevents unnecessary DOM updates for unchanged values
 * - Supports animation stability for cart badge
 * 
 * **5. Search Performance Optimization**
 * - Props structure supports debounced search implementations
 * - Stable callback references prevent search input re-renders
 * - Essential for real-time search user experience
 * - Enables efficient API call management
 * 
 * **6. Multi-Layout Rendering Efficiency**
 * - Header renders both desktop and mobile layouts
 * - Optimized props prevent double rendering on responsive breakpoints
 * - Memory efficient for components with complex responsive logic
 * - Critical for mobile performance and battery life
 * 
 
 * @interface HeaderProps
 */
export interface HeaderProps {
    /** 
     * Total number of items in the shopping cart
     * @performance Used for cart badge display, should be memoized calculation
     * @example const cartItemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
     */
    cartItemCount: number;
    
    /** 
     * Handler function to toggle cart visibility
     * @performance Should be wrapped in useCallback for memo optimization
     * @example const onCartToggle = useCallback(() => setCartOpen(prev => !prev), [])
     */
    onCartToggle: () => void;
    
    /** 
     * Handler function for search input changes
     * @performance Critical callback for useCallback memoization, supports debouncing
     * @param query - Search query string entered by user
     * @example const onSearch = useCallback(debounce((query) => dispatch(searchProducts(query)), 300), [dispatch])
     */
    onSearch: (query: string) => void;
    
    /** 
     * Array of available product categories
     * @performance Should be stable array reference, use useMemo if derived
     * @example const categories = useMemo(() => [...uniqueCategories], [products])
     */
    categories: string[];
    
    /** 
     * Currently selected category for filtering
     * @performance Primitive string enables efficient shallow comparison
     * @example Drives category filter UI state and product filtering
     */
    selectedCategory: string;
    
    /** 
     * Handler function for category selection changes
     * @performance Should be memoized to prevent CategoryFilter re-renders
     * @param category - Selected category name
     * @example const onCategoryChange = useCallback((cat) => dispatch(setCategory(cat)), [dispatch])
     */
    onCategoryChange: (category: string) => void;
}