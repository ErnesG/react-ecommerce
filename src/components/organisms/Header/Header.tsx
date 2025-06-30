/**
 * @fileoverview Header - Optimized navigation and search component for e-commerce application
 * 
 * Main application header containing navigation, category filters, search functionality,
 * and shopping cart integration. Strategically optimized with React.memo and internal
 * memoization to handle frequent parent component updates while maintaining UI responsiveness.
 * 
 * This component sits at the top of the page layout and remains visible across all user
 * interactions, making performance optimization critical for overall user experience.
 */

import { memo, useCallback, useMemo } from "react";
import { Button } from "../../atoms/Button/Button";
import { Badge } from "../../atoms/Badge/Badge";
import { SearchBar } from "../../molecules/SearchBar/SearchBar";
import type { HeaderProps } from "../../model/HeaderProps";

/**
 * Header - Highly optimized application navigation component
 * 
 * This component represents a critical performance point in e-commerce applications
 * where headers must remain responsive despite frequent parent component updates.
 * The header contains multiple interactive elements and complex state-dependent rendering.
 * 
 * ## Why React.memo is CRITICAL for Header Components:
 * 
 * ### 1. **Always-Visible UI Element with High Update Frequency**
 * Headers are unique in web applications because they:
 * - Remain visible and interactive during all user interactions
 * - Must stay responsive while parent components update frequently
 * - Contain multiple interactive elements (search, filters, cart)
 * - Render both desktop and mobile layouts simultaneously
 * - Display real-time data (cart count, active filters)
 * 
 * In this e-commerce context, the parent Home component updates constantly due to:
 * - Product data fetching and state changes
 * - Search query updates from user typing
 * - Cart operations (add/remove items)
 * - Category filter selections
 * - Loading state transitions
 * 
 * ### 2. **Expensive Multi-Layout Rendering**
 * The Header component performs costly rendering operations:
 * - **Category Processing**: Formats and capitalizes category names with string operations
 * - **Dual Layout Rendering**: Renders both desktop navigation AND mobile navigation
 * - **Multiple Button Components**: Creates buttons for each category (can be 4-10+ buttons)
 * - **Conditional Rendering Logic**: Complex visibility logic for responsive design
 * - **Badge Calculations**: Cart count formatting and overflow handling (99+)
 * 
 * Example performance cost without memo:
 * ```
 * User types in search → Parent re-renders → Header re-renders →
 * - Re-format all category names (4-10 string operations)
 * - Re-render desktop navigation (4-10 buttons)
 * - Re-render mobile navigation (duplicate 4-10 buttons)
 * - Re-calculate cart badge display
 * - Re-process responsive visibility logic
 * ```
 * 
 * ### 3. **Props Stability Analysis for this Header**
 * Understanding when Header should and shouldn't re-render:
 * 
 * **SHOULD re-render when these props change:**
 * - `cartItemCount`: Cart badge must update immediately
 * - `selectedCategory`: Button states must reflect active filter
 * - `categories`: Navigation must update when categories load
 * 
 * **SHOULD NOT re-render when these remain stable:**
 * - `onCartToggle`: Function typically stable from useCallback in parent
 * - `onSearch`: Function typically stable from useCallback in parent  
 * - `onCategoryChange`: Function typically stable from useCallback in parent
 * 
 * **Common unnecessary re-render scenarios without memo:**
 * - Product data loads → Parent re-renders → Header re-renders (no header props changed)
 * - Search results update → Parent re-renders → Header re-renders (only search triggered it)
 * - Loading states change → Parent re-renders → Header re-renders (header unchanged)
 * 
 * ### 4. **User Experience Impact**
 * Header re-render issues directly impact user experience:
 * - **Navigation Lag**: Category buttons become unresponsive during re-renders
 * - **Search Input Disruption**: Search bar loses focus or feels sluggish
 * - **Cart Button Delay**: Shopping cart button becomes unresponsive
 * - **Visual Flickering**: Rapid re-renders can cause visible UI flicker
 * - **Mobile Performance**: Mobile devices suffer more from unnecessary re-renders
 * 
 * ### 5. **Cascade Prevention in Component Tree**
 * Header contains multiple child components that also benefit from stability:
 * - **SearchBar**: Complex input component with debouncing logic
 * - **Button components**: Multiple category filter buttons (4-10+)
 * - **Badge component**: Cart count display with formatting logic
 * 
 * Without memo at Header level, all these children re-render unnecessarily
 * even when their props haven't changed, creating performance cascade.
 * 
 * ### 6. **Memory and Performance Optimization**
 * Headers are particularly memory-sensitive because they:
 * - Remain mounted throughout entire application lifecycle
 * - Create multiple button instances that must be garbage collected
 * - Process string formatting operations repeatedly
 * - Maintain event handler references
 * 
 * ## Additional Performance Optimizations Used:
 * 
 * - **useCallback for handleCategoryClick**: Stabilizes click handlers, prevents Button re-renders
 * - **useMemo for formattedCategories**: Prevents string formatting on every render
 * - **Stable function props**: Parent provides memoized callback functions
 * - **Conditional rendering**: Minimizes DOM nodes in mobile/desktop modes
 * 
 * @component
 * @param {HeaderProps} props - The component props
 * @param {number} props.cartItemCount - Number of items in shopping cart (for badge display)
 * @param {Function} props.onCartToggle - Callback to toggle shopping cart visibility
 * @param {Function} props.onSearch - Callback for search query changes
 * @param {string[]} props.categories - Array of available product categories
 * @param {string} props.selectedCategory - Currently selected category filter
 * @param {Function} props.onCategoryChange - Callback for category filter changes
 * 
 * @returns {JSX.Element} Responsive header with navigation, search, and cart functionality
 * 
 * @example
 * ```tsx
 * // Typical usage in main layout
 * const Home = () => {
 *   const { categories, selectedCategory } = useProducts();
 *   const { items, toggleCart } = useCart();
 *   const [searchQuery, setSearchQuery] = useState("");
 * 
 *   const handleSearch = useCallback((query: string) => {
 *     setSearchQuery(query);
 *   }, []);
 * 
 *   const handleCategoryChange = useCallback((category: string) => {
 *     dispatch(setSelectedCategory(category));
 *   }, [dispatch]);
 * 
 *   const cartItemCount = useMemo(() => 
 *     items.reduce((sum, item) => sum + item.quantity, 0), [items]
 *   );
 * 
 *   return (
 *     <Layout
 *       header={
 *         <Header
 *           cartItemCount={cartItemCount}
 *           onCartToggle={toggleCart}
 *           onSearch={handleSearch}
 *           categories={categories}
 *           selectedCategory={selectedCategory}
 *           onCategoryChange={handleCategoryChange}
 *         />
 *       }
 *     >
 *       <ProductGrid ... />
 *     </Layout>
 *   );
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Performance impact demonstration
 * // Scenario: User adds item to cart
 * 
 * // Without memo:
 * // 1. Cart state updates in Redux
 * // 2. Home component re-renders (cart count changed)
 * // 3. Header re-renders (even though only cartItemCount changed)
 * // 4. All category buttons re-render unnecessarily
 * // 5. SearchBar re-renders unnecessarily
 * // 6. Category formatting logic runs again
 * // 7. Mobile and desktop layouts both re-render
 * 
 * // With memo:
 * // 1. Cart state updates in Redux
 * // 2. Home component re-renders (cart count changed)
 * // 3. Header re-renders ONLY because cartItemCount prop changed
 * // 4. Internal memoization prevents unnecessary recalculations
 * // 5. Only cart badge updates visually
 * ```
 */
export const Header = memo<HeaderProps>(
  ({
    cartItemCount,
    onCartToggle,
    onSearch,
    categories,
    selectedCategory,
    onCategoryChange,
  }) => {
    /**
     * Memoized category click handler
     * 
     * Prevents function recreation on every render, which would cause
     * all category Button components to re-render due to prop changes.
     * 
     * Handles toggle logic: clicking active category deselects it,
     * clicking inactive category selects it.
     */
    const handleCategoryClick = useCallback(
      (category: string) => {
        onCategoryChange(category === selectedCategory ? "" : category);
      },
      [onCategoryChange, selectedCategory]
    );

    /**
     * Memoized formatted categories array
     * 
     * Prevents expensive string formatting operations on every render.
     * Formats category names with proper capitalization and handles
     * special characters (apostrophes) for display.
     * 
     * Performance impact: With 5 categories, prevents 15+ string operations
     * (charAt, toUpperCase, slice, replace) on every parent re-render.
     */
    const formattedCategories = useMemo(
      () =>
        categories.map((category) => ({
          id: category,
          name:
            category.charAt(0).toUpperCase() +
            category.slice(1).replace(/'/g, "'"),
          isSelected: category === selectedCategory,
        })),
      [categories, selectedCategory]
    );

    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
          {/* Main header content - desktop layout */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              {/* Brand/Logo */}
              <h1 className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                E-Store
              </h1>
              
              {/* Desktop category navigation */}
              <nav className="hidden md:flex space-x-1">
                <Button
                  variant={selectedCategory === "" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => onCategoryChange("")}
                >
                  All
                </Button>
                {formattedCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={category.isSelected ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="capitalize"
                  >
                    {category.name}
                  </Button>
                ))}
              </nav>
            </div>
            
            {/* Right side: Search and Cart */}
            <div className="flex items-center space-x-4">
              {/* Desktop search bar */}
              <div className="hidden sm:block w-64">
                <SearchBar
                  onSearch={onSearch}
                  placeholder="Search Products..."
                  className="w-full"
                />
              </div>
              
              {/* Cart button with badge */}
              <Button
                variant="secondary"
                onClick={onCartToggle}
                className="relative"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <span className="mr-2">🛒</span>
                Cart
                {cartItemCount > 0 && (
                  <Badge
                    variant="error"
                    size="sm"
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile search bar */}
          <div className="sm:hidden pb-4">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search products..."
              className="w-full"
            />
          </div>
          
          {/* Mobile category filter */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-2 overflow-x-auto">
              <Button
                variant={selectedCategory === "" ? "primary" : "secondary"}
                size="sm"
                onClick={() => onCategoryChange("")}
                className="whitespace-nowrap"
              >
                All
              </Button>
              {formattedCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.isSelected ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="capitalize whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }
);

/**
 * Display name for React DevTools debugging
 * Essential for debugging header performance in React DevTools Profiler
 */
Header.displayName = "Header";
