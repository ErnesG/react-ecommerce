/**
 * @fileoverview Custom React hook for managing shopping cart state and operations
 * Provides methods for adding, removing, updating cart items and managing cart visibility
 * Uses Redux for state management and useCallback for performance optimization
 */

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } from "../store/slices/cartSlice";

import type { Product } from "../types";

/**
 * Custom hook for managing shopping cart operations and state
 * 
 * This hook provides a complete interface for cart management including:
 * - Adding products to cart
 * - Removing products from cart
 * - Updating product quantities
 * - Toggling cart visibility
 * - Clearing entire cart
 * - Accessing cart state (items, total, visibility)
 * 
 * All handler functions are memoized using useCallback for optimal performance
 * and to prevent unnecessary re-renders in child components.
 * 
 * @returns {Object} Object containing cart state and handler functions
 * @returns {CartItem[]} returns.items - Array of items currently in the cart
 * @returns {number} returns.total - Total price of all items in the cart
 * @returns {boolean} returns.isOpen - Whether the cart panel/modal is currently open
 * @returns {Function} returns.addToCart - Function to add a product to the cart
 * @returns {Function} returns.removeFromCart - Function to remove a product from the cart
 * @returns {Function} returns.updateQuantity - Function to update quantity of a cart item
 * @returns {Function} returns.toggleCart - Function to toggle cart visibility
 * @returns {Function} returns.clearCart - Function to remove all items from the cart
 * 
 * @example
 * ```tsx
 * const CartComponent = () => {
 *   const {
 *     items,
 *     total,
 *     isOpen,
 *     addToCart,
 *     removeFromCart,
 *     updateQuantity,
 *     toggleCart,
 *     clearCart
 *   } = useCart();
 * 
 *   const handleAddProduct = (product: Product) => {
 *     addToCart(product);
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={toggleCart}>
 *         Cart ({items.length}) - ${total.toFixed(2)}
 *       </button>
 *       {isOpen && (
 *         <div className="cart-panel">
 *           {items.map(item => (
 *             <div key={item.id}>
 *               <span>{item.title}</span>
 *               <input
 *                 type="number"
 *                 value={item.quantity}
 *                 onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
 *               />
 *               <button onClick={() => removeFromCart(item.id)}>Remove</button>
 *             </div>
 *           ))}
 *           <button onClick={clearCart}>Clear Cart</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {items, total, isOpen} = useSelector(
        (state: RootState)=> state.cart
    );

    /**
     * Adds a product to the shopping cart
     * If the product already exists, increases its quantity by 1
     * 
     * @param {Product} product - The product object to add to the cart
     */
    const handleAddToCart = useCallback((product: Product) => {
        dispatch(addToCart(product))
    }, [dispatch]);

    /**
     * Removes a product completely from the shopping cart
     * 
     * @param {number} id - The unique identifier of the product to remove
     */
    const handleRemoveFromCart = useCallback((id: number) => {
        dispatch(removeFromCart(id))
    }, [dispatch]);

    /**
     * Updates the quantity of a specific product in the cart
     * If quantity is 0 or less, the item will be removed from the cart
     * 
     * @param {number} id - The unique identifier of the product
     * @param {number} quantity - The new quantity for the product
     */
    const handleUpdateQuantity = useCallback((id:number, quantity: number)=>{
        dispatch(updateQuantity({id, quantity}))
    }, [dispatch]);

    /**
     * Toggles the visibility of the shopping cart panel/modal
     * Switches between open and closed states
     */
    const handleToggleCart = useCallback(()=>{
        dispatch(toggleCart());
    }, [dispatch]);

    /**
     * Removes all items from the shopping cart
     * Resets the cart to an empty state
     */
    const handleClearCart = useCallback(()=> {
        dispatch(clearCart());
    }, [dispatch]);

    return {
        items,
        total,
        isOpen,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateQuantity: handleUpdateQuantity,
        toggleCart: handleToggleCart,
        clearCart: handleClearCart
    };
};