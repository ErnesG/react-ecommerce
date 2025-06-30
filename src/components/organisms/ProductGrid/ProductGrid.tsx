/**
 * @fileoverview ProductGrid - Optimized product display component with comprehensive performance optimizations
 * 
 * This component renders a responsive grid of product cards with advanced filtering, loading states,
 * and empty state handling. Heavily optimized using React.memo and multiple memoization strategies
 * to handle frequent parent updates in e-commerce scenarios.
 * 
 * Used primarily in the Home page where parent component updates frequently due to:
 * - Redux state changes (products, cart, categories)
 * - Search query updates from user input
 * - Category filter changes
 * - Cart operations (add/remove items)
 * - Loading state transitions during API calls
 */

import { memo, useMemo, useCallback } from "react";
import { ProductCard } from "../../molecules/ProductCard/ProductCard";
import type { ProductGridProps } from "../../model/ProductGridProps";

/**
 * ProductSkeleton - Memoized loading skeleton component
 * 
 * Separate memoized component to prevent re-creation of skeleton elements
 * during loading states. Provides consistent loading UI that matches
 * the actual ProductCard layout.
 */
const ProductSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  </div>
));

/**
 * ProductGrid - Highly optimized product display component
 * 
 * This component represents a critical performance bottleneck in e-commerce applications
 * where product grids can contain dozens or hundreds of items, and parent components
 * update frequently due to user interactions and state changes.
 * 
 * ## Why React.memo is ESSENTIAL for ProductGrid:
 * 
 * ### 1. **High-Impact Component in Component Tree**
 * Based on codebase analysis, ProductGrid is used in the Home component which:
 * - Manages multiple Redux states (products, cart, search, categories)
 * - Updates frequently due to user interactions (search, filter, cart operations)
 * - Contains complex state management with useProducts and useCart hooks
 * - Re-renders on every product fetch, cart change, or category selection
 * 
 * Without memo, ProductGrid would re-render on EVERY parent state change, even when
 * its own props (products, loading, cartItems, searchQuery) haven't changed.
 * 
 * ### 2. **Expensive Rendering Operations**
 * ProductGrid performs computationally expensive operations:
 * - **Product Filtering**: Searches through entire product array with string matching
 * - **Cart Status Checking**: Verifies cart status for each product (O(n²) without optimization)
 * - **Component Tree Creation**: Renders multiple ProductCard components (each also memoized)
 * - **DOM Reconciliation**: Large lists cause expensive Virtual DOM diffing
 * 
 * Example: With 20 products, without memo, every search keystroke would:
 * - Re-filter all products unnecessarily
 * - Re-check cart status for all products
 * - Re-render all 20 ProductCard components
 * - Perform expensive DOM reconciliation
 * 
 * ### 3. **Frequent Parent Updates in E-commerce Context**
 * In the Home component, ProductGrid receives updates from multiple sources:
 * - **Search Updates**: Every keystroke in search bar (even with debouncing)
 * - **Category Changes**: User selecting different product categories
 * - **Cart Operations**: Adding/removing items updates cartItems prop
 * - **Loading States**: API calls trigger loading state changes
 * - **Redux State**: Product fetching, error states, category loading
 * 
 * ### 4. **Cascade Prevention**
 * ProductGrid contains multiple child ProductCard components (also memoized).
 * Without memo at the ProductGrid level, all child ProductCards would re-render
 * unnecessarily, creating a performance cascade throughout the product display.
 * 
 * ### 5. **Search Query Optimization**
 * Search functionality creates particularly challenging performance scenarios:
 * - User types in search box → Parent re-renders → Without memo: ProductGrid re-renders
 * - With memo: ProductGrid only re-renders when searchQuery prop actually changes
 * - Prevents redundant filtering operations during parent state updates
 * 
 * ### 6. **Cart Integration Performance**
 * Cart operations frequently update parent component state:
 * - Adding item to cart updates Redux cart state
 * - Parent (Home) re-renders due to cart state change
 * - Without memo: ProductGrid would re-render even though products haven't changed
 * - With memo: Only re-renders when cartItems prop changes (for cart status indicators)
 * 
 * ## Additional Performance Optimizations Used:
 * 
 * - **useMemo for filteredProducts**: Prevents re-filtering when products/searchQuery unchanged
 * - **useCallback for isProductInCart**: Prevents function recreation, stabilizes ProductCard props
 * - **useMemo for productCards**: Prevents re-creation of ProductCard elements
 * - **useMemo for skeletonCards**: Static skeleton array, created once
 * - **Memoized ProductSkeleton**: Prevents skeleton component re-creation
 * 
 * @component
 * @param {ProductGridProps} props - The component props
 * @param {Product[]} props.products - Array of products to display in the grid
 * @param {boolean} props.loading - Loading state for showing skeleton placeholders
 * @param {Function} props.onAddToCart - Callback function when user adds product to cart
 * @param {number[]} [props.cartItems=[]] - Array of product IDs currently in cart (for status indicators)
 * @param {string} [props.searchQuery=""] - Search query for filtering products
 * 
 * @returns {JSX.Element} Responsive product grid with loading and empty states
 * 
 * @example
 * ```tsx
 * // Typical usage in Home page component
 * const Home = () => {
 *   const { products, loading } = useProducts();
 *   const { addToCart, items } = useCart();
 *   const [searchQuery, setSearchQuery] = useState("");
 *   
 *   const cartItemIds = useMemo(() => items.map(item => item.id), [items]);
 *   
 *   return (
 *     <ProductGrid
 *       products={products}
 *       loading={loading}
 *       onAddToCart={addToCart}
 *       cartItems={cartItemIds}
 *       searchQuery={searchQuery}
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Performance comparison illustration
 * // ❌ Without memo: Re-renders on every parent update
 * // ✅ With memo: Only re-renders when props actually change
 * 
 * // Scenario: User types in search box
 * // Parent updates: searchQuery changes from "phone" to "phones"
 * // Without memo: Full component re-render + all children
 * // With memo: Only re-renders because searchQuery prop changed (expected)
 * 
 * // Scenario: User adds item to cart
 * // Parent updates: cart state changes, but products array unchanged
 * // Without memo: Full component re-render despite same products
 * // With memo: Only re-renders if cartItems prop changes (for cart indicators)
 * ```
 */
export const ProductGrid = memo<ProductGridProps>(
  ({ products, loading, onAddToCart, cartItems = [], searchQuery = "" }) => {
    /**
     * Memoized product filtering based on search query
     * 
     * Prevents expensive re-filtering operations when products and searchQuery
     * haven't changed. Searches across title, description, and category fields.
     * 
     * Performance impact: With 100 products, prevents ~300 string operations
     * on every parent re-render when search hasn't changed.
     */
    const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return products;

      const query = searchQuery.toLowerCase();
      return products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }, [products, searchQuery]);

    /**
     * Memoized cart status checker function
     * 
     * Prevents function recreation on every render, which would cause
     * ProductCard components to re-render unnecessarily due to prop changes.
     * 
     * Optimization: Stabilizes the isInCart prop passed to ProductCard,
     * allowing ProductCard's own memo to work effectively.
     */
    const isProductInCart = useCallback(
      (productId: number) => cartItems.includes(productId),
      [cartItems]
    );

    /**
     * Memoized ProductCard components array
     * 
     * Prevents re-creation of ProductCard elements when filteredProducts,
     * onAddToCart, or isProductInCart haven't changed. This is crucial
     * because creating new JSX elements breaks React's reconciliation
     * optimization and forces child re-renders.
     */
    const productCards = useMemo(
      () =>
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isInCart={isProductInCart(product.id)}
          />
        )),
      [filteredProducts, onAddToCart, isProductInCart]
    );

    /**
     * Memoized skeleton loading components
     * 
     * Creates skeleton array once and reuses it. Prevents array recreation
     * during loading state transitions, which would cause unnecessary
     * re-renders of skeleton components.
     */
    const skeletonCards = useMemo(
      () =>
        Array.from({ length: 8 }, (_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        )),
      []
    );

    // Loading state with skeleton grid
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonCards}
        </div>
      );
    }

    // Empty state for search results
    if (filteredProducts.length === 0 && searchQuery) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            No products match your search for "{searchQuery}". Try different
            keywords.
          </p>
        </div>
      );
    }

    // Empty state for no products
    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products available
          </h3>
          <p className="text-gray-600">Check back later for new products.</p>
        </div>
      );
    }

    // Main product grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productCards}
      </div>
    );
  }
);

/**
 * Display name for React DevTools debugging
 * Helps identify the component in React DevTools profiler and component tree
 */
ProductGrid.displayName = "ProductGrid";
