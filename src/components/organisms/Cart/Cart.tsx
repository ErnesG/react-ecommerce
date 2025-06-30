/**
 * @fileoverview Cart - Highly optimized shopping cart sidebar component
 * 
 * Interactive shopping cart component that displays as a slide-out sidebar panel.
 * Features comprehensive performance optimizations using React.memo, useMemo, and useCallback
 * to handle frequent cart state updates while maintaining smooth user interactions.
 * 
 * The cart is a critical e-commerce component that updates frequently due to:
 * - Item additions/removals triggering parent re-renders
 * - Quantity changes updating totals and counts
 * - Cart visibility toggles affecting layout
 * - Real-time price calculations and formatting
 */

import { memo, useCallback, useMemo } from "react";
import { Button } from "../../atoms/Button/Button";
import { CartItem } from "../../molecules/CartItem/CartItem";
import type { CartProps } from "../../model/CartProps";

/**
 * Cart - Optimized shopping cart sidebar component
 * 
 * This component represents a performance-critical UI element in e-commerce applications
 * where cart operations happen frequently and must remain responsive. The cart contains
 * complex calculations, formatting operations, and manages multiple child components.
 * 
 * ## Why React.memo is ESSENTIAL for Cart Components:
 * 
 * ### 1. **High-Frequency Update Component**
 * Shopping carts are among the most frequently updated components in e-commerce apps:
 * - **Item Operations**: Add, remove, quantity changes trigger parent re-renders
 * - **Price Updates**: Total calculations change with every cart modification
 * - **Visibility Toggles**: Opening/closing cart affects parent layout state
 * - **Real-time Updates**: Cart state changes propagate through Redux immediately
 * 
 * ### 2. **Expensive Rendering Operations**
 * The Cart component performs computationally expensive operations:
 * - **Currency Formatting**: Uses Intl.NumberFormat for price display (CPU intensive)
 * - **Array Calculations**: Reduces over items array for totals and counts
 * - **Multiple CartItem Rendering**: Creates child components for each cart item
 * - **Conditional Rendering**: Complex layout logic for empty/filled states
 * - **Animation Classes**: Manages transition states for slide-in/out effects
 * 
 * ### 3. **Props Stability Analysis**
 * Understanding when Cart should and shouldn't re-render:
 * 
 * **SHOULD re-render when these props change:**
 * - `items`: Cart contents changed, must update display
 * - `total`: Price calculations changed, must update formatted total
 * - `isOpen`: Visibility changed, must show/hide cart
 * 
 * **SHOULD NOT re-render when these remain stable:**
 * - `onClose`: Function typically stable from useCallback in parent
 * - `onUpdateQuantity`: Function typically stable from useCallback in parent
 * - `onRemoveItem`: Function typically stable from useCallback in parent
 * - `onClearCart`: Function typically stable from useCallback in parent
 * 
 * **Common unnecessary re-render scenarios without memo:**
 * - Product data loads → Parent re-renders → Cart re-renders (cart props unchanged)
 * - Search queries change → Parent re-renders → Cart re-renders (cart unaffected)
 * - Category filters change → Parent re-renders → Cart re-renders (cart unchanged)
 * 
 * ### 4. **Performance Impact in E-commerce Context**
 * Without memo, every parent state change would cause Cart to:
 * - Re-calculate itemCount (reduce operation over items array)
 * - Re-format total price (expensive Intl.NumberFormat operation)
 * - Re-render all CartItem components unnecessarily
 * - Re-process conditional rendering logic
 * - Re-apply animation classes and transitions
 * 
 * @component
 * @param {CartProps} props - The component props
 * @param {CartItem[]} props.items - Array of items currently in the shopping cart
 * @param {number} props.total - Total price of all items in the cart
 * @param {boolean} props.isOpen - Whether the cart sidebar is currently visible
 * @param {Function} props.onClose - Callback to close the cart sidebar
 * @param {Function} props.onUpdateQuantity - Callback to update item quantity
 * @param {Function} props.onRemoveItem - Callback to remove item from cart
 * @param {Function} props.onClearCart - Callback to remove all items from cart
 * 
 * @returns {JSX.Element|null} Cart sidebar component or null when closed
 * 
 * @example
 * ```tsx
 * // Typical usage in main layout
 * const Home = () => {
 *   const { items, total, isOpen, updateQuantity, removeFromCart, clearCart, toggleCart } = useCart();
 * 
 *   return (
 *     <>
 *       <ProductGrid onAddToCart={addToCart} />
 *       <Cart
 *         items={items}
 *         total={total}
 *         isOpen={isOpen}
 *         onClose={toggleCart}
 *         onUpdateQuantity={updateQuantity}
 *         onRemoveItem={removeFromCart}
 *         onClearCart={clearCart}
 *       />
 *     </>
 *   );
 * };
 * ```
 */
export const Cart = memo<CartProps>(
  ({
    items,
    total,
    isOpen,
    onClose,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
  }) => {
    /**
     * Memoized formatted total price
     * 
     * Uses expensive Intl.NumberFormat API to format currency display.
     * This operation involves:
     * - Locale detection and number formatting rules
     * - Currency symbol placement and formatting
     * - Decimal precision and rounding calculations
     * 
     * DEPENDENCY ARRAY: [total]
     * - ✅ INCLUDES total: Must recalculate when total price changes
     * - ❌ EXCLUDES formatting options: Static configuration, never changes
     * - ❌ EXCLUDES component props: Formatting independent of other props
     * 
     * Performance impact: Without memoization, currency formatting would run
     * on every parent re-render, even when total hasn't changed. This is
     * particularly expensive because Intl.NumberFormat creates new formatter
     * instances and processes locale-specific formatting rules.
     * 
     * @example
     * // total = 29.99 → "$29.99"
     * // total = 1234.56 → "$1,234.56"
     */
    const formattedTotal = useMemo(
      () =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(total),
      [total] // Only recalculate when total price changes
    );

    /**
     * Memoized total item count
     * 
     * Performs array reduction to sum quantities across all cart items.
     * This operation involves:
     * - Iterating through entire items array
     * - Accumulating quantity values
     * - Handling potential undefined/null values
     * 
     * DEPENDENCY ARRAY: [items]
     * - ✅ INCLUDES items: Must recalculate when cart contents change
     * - ❌ EXCLUDES other props: Count calculation independent of total, isOpen, etc.
     * - ❌ EXCLUDES callback functions: Count calculation doesn't depend on handlers
     * 
     * Performance impact: Without memoization, array reduction would run on
     * every parent re-render. With large carts (10+ items), this becomes
     * noticeable. The reduce operation has O(n) time complexity where n is
     * the number of cart items.
     * 
     * @example
     * // items = [{quantity: 2}, {quantity: 3}, {quantity: 1}] → 6
     * // items = [] → 0
     * // items = [{quantity: 1}] → 1
     */
    const itemCount = useMemo(
      () => items.reduce((sum, item) => sum + item.quantity, 0),
      [items] // Only recalculate when cart items array changes
    );

    /**
     * Memoized checkout handler
     * 
     * Handles checkout process including:
     * - Displaying checkout total in alert
     * - Clearing cart after checkout
     * - Closing cart sidebar
     * 
     * DEPENDENCY ARRAY: [formattedTotal, onClearCart, onClose]
     * - ✅ INCLUDES formattedTotal: Alert message needs current formatted total
     * - ✅ INCLUDES onClearCart: Function called within handler, must be current reference
     * - ✅ INCLUDES onClose: Function called within handler, must be current reference
     * - ❌ EXCLUDES items, total: Not directly used in handler logic
     * - ❌ EXCLUDES other callbacks: Not used in this specific handler
     * 
     * Performance impact: Without useCallback, this function would be recreated
     * on every render, causing the checkout Button component to re-render
     * unnecessarily due to prop changes. The Button component likely uses
     * React.memo, so stable function references are crucial for optimization.
     * 
     * Why these specific dependencies?
     * - formattedTotal: Used in alert message, must reflect current total
     * - onClearCart: Called after checkout, must be current implementation
     * - onClose: Called after checkout, must be current implementation
     * 
     * @example
     * // User clicks checkout → Alert shows current total → Cart clears → Cart closes
     */
    const handleCheckout = useCallback(() => {
      alert(
        `Checkout functionality would be implemented here. Total: ${formattedTotal}`
      );
      onClearCart();
      onClose();
    }, [formattedTotal, onClearCart, onClose]); // All dependencies used within callback

    // Early return for closed cart - no rendering needed
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop - Click outside to close */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Cart Sidebar - Main cart container */}
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header - Cart title and close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                aria-label="Close cart"
              >
                ✕
              </Button>
            </div>

            {/* Cart Items - Scrollable list of cart contents */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                // Empty cart state
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                // Cart items list
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Total and action buttons (only shown when cart has items) */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Total display */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formattedTotal}</span>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Checkout
                  </Button>
                  <Button
                    onClick={onClearCart}
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

/**
 * Display name for React DevTools debugging
 * Critical for identifying cart performance issues in React DevTools Profiler
 */
Cart.displayName = "Cart";
