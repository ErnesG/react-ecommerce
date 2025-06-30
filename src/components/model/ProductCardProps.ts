/**
 * @fileoverview ProductCardProps - Type definitions for ProductCard component properties
 * 
 * Defines the props interface for individual product display cards with
 * cart integration, loading states, and user interaction support.
 */

import type { Product } from "../../types";

/**
 * Props interface for the ProductCard component
 * 
 * @performance Key Performance Benefits
 * - onAddToCart callback supports useCallback memoization
 * - isInCart boolean enables conditional rendering optimization
 * - isLoading state prevents duplicate API calls
 * - Product object reference stability for React.memo
 * 
 * @example Basic ProductCard Usage
 * ```tsx
 * <ProductCard 
 *   product={product}
 *   onAddToCart={handleAddToCart}
 *   isInCart={cartItems.some(item => item.id === product.id)}
 *   isLoading={addingToCart}
 * />
 * ```
 * 

 * @interface ProductCardProps
 */
export interface ProductCardProps {
  /** 
   * Product data to display in the card
   * @performance Stable object reference enables React.memo optimization
   */
  product: Product;
  
  /** 
   * Handler function called when user adds product to cart
   * @performance Should be wrapped in useCallback for memo optimization
   */
  onAddToCart: (product: Product) => void;
  
  /** 
   * Optional flag indicating if product is already in cart
   * @performance Enables conditional button styling and behavior
   */
  isInCart?: boolean;
  
  /** 
   * Optional loading state for add-to-cart operations
   * @performance Prevents duplicate API calls and provides user feedback
   */
  isLoading?: boolean;
}