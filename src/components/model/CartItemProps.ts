import type { CartItem } from "../../types";

/**
 * Props interface for the CartItem molecular component
 * 
 * Defines the complete API for rendering and managing individual items within
 * the shopping cart. Focuses on user interactions (quantity updates, removal)
 * and efficient data handling for cart state management.
 * 
 * ## Performance Considerations:
 * - Callback functions should be memoized in parent components (useCallback)
 * - CartItem components are typically rendered in lists (multiple instances)
 * - Stable function references prevent unnecessary CartItem re-renders
 * - ID-based operations enable efficient cart state updates
 * 
 * ## User Experience:
 * - Immediate visual feedback for quantity changes
 * - Clear removal actions with confirmation patterns
 * - Optimistic updates for responsive cart interactions
 * 
 * @interface CartItemProps
 */
export interface CartItemProps {
  /**
   * Cart item data containing product information and quantity
   * 
   * Contains all necessary data to render the cart item including product details,
   * current quantity, calculated totals, and unique identifiers for state management.
   * 
   * **Included Properties (from CartItem type):**
   * - `id`: Unique product identifier for cart operations
   * - `title`: Product name for display
   * - `price`: Individual item price
   * - `quantity`: Current quantity in cart
   * - `image`: Product image URL for visual display
   * - `category`: Product category for additional context
   * 
   * @example
   * ```tsx
   * const cartItem: CartItem = {
   *   id: 1,
   *   title: "iPhone 14 Pro",
   *   price: 999.99,
   *   quantity: 2,
   *   image: "https://...",
   *   category: "Electronics"
   * };
   * 
   * <CartItem item={cartItem} ... />
   * ```
   * 
   * @performance
   * Changes to item data trigger CartItem re-render. Use stable references
   * when possible to minimize unnecessary updates.
   */
  item: CartItem;

  /**
   * Callback function to update item quantity in the cart
   * 
   * Handles quantity changes for cart items, enabling users to increase or decrease
   * item quantities. Should implement validation for minimum quantities and
   * maximum stock limits.
   * 
   * **Function Signature:**
   * - `id`: Product identifier to locate the specific cart item
   * - `quantity`: New quantity value (should be positive integer)
   * 
   * **Expected Behavior:**
   * - If quantity > 0: Update item quantity in cart state
   * - If quantity ≤ 0: Remove item from cart (or prevent invalid quantity)
   * - Validate against stock availability if applicable
   * - Update cart totals and item counts
   * 
   * @param id - Unique product identifier
   * @param quantity - New quantity value (positive integer)
   * 
   * @example
   * ```tsx
   * const handleQuantityUpdate = useCallback((id: number, quantity: number) => {
   *   if (quantity <= 0) {
   *     // Remove item or prevent invalid quantity
   *     dispatch(removeFromCart(id));
   *   } else {
   *     // Update quantity in cart state
   *     dispatch(updateQuantity({ id, quantity }));
   *   }
   * }, [dispatch]);
   * 
   * <CartItem 
   *   item={item}
   *   onUpdateQuantity={handleQuantityUpdate}
   *   onRemove={handleRemove}
   * />
   * ```
   * 
   * @performance
   * Should be memoized with useCallback in parent component to prevent
   * unnecessary CartItem re-renders when parent state changes.
   * 
   * @validation
   * - Ensure quantity is positive integer
   * - Validate against available stock limits
   * - Handle edge cases (quantity = 0, negative values)
   */
  onUpdateQuantity: (id: number, quantity: number) => void;

  /**
   * Callback function to remove item completely from the cart
   * 
   * Handles complete removal of cart items, providing users with a way to
   * eliminate items they no longer want. Should update cart state immediately
   * and provide appropriate user feedback.
   * 
   * **Function Signature:**
   * - `id`: Product identifier to locate and remove the specific cart item
   * 
   * **Expected Behavior:**
   * - Remove item completely from cart state
   * - Update cart totals and item counts
   * - Provide user feedback (toast notification, visual confirmation)
   * - Consider undo functionality for improved UX
   * 
   * @param id - Unique product identifier of item to remove
   * 
   * @example
   * ```tsx
   * const handleItemRemoval = useCallback((id: number) => {
   *   // Remove item from cart state
   *   dispatch(removeFromCart(id));
   *   
   *   // Optional: Show confirmation toast
   *   toast.success("Item removed from cart");
   *   
   *   // Optional: Provide undo functionality
   *   showUndoOption(() => dispatch(addToCart(removedItem)));
   * }, [dispatch]);
   * 
   * <CartItem 
   *   item={item}
   *   onUpdateQuantity={handleQuantityUpdate}
   *   onRemove={handleItemRemoval}
   * />
   * ```
   * 
   * @performance
   * Should be memoized with useCallback in parent component to prevent
   * unnecessary CartItem re-renders when parent state changes.
   * 
   * @accessibility
   * Ensure removal actions are clearly labeled and accessible via keyboard.
   * Consider confirmation dialogs for destructive actions.
   * 
   * @userexperience
   * - Provide immediate visual feedback
   * - Consider confirmation for expensive items
   * - Implement undo functionality where appropriate
   * - Update cart totals smoothly with animations
   */
  onRemove: (id: number) => void;
}