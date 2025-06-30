/**
 * @fileoverview Badge - Optimized atomic component for displaying status indicators and labels
 * 
 * Atomic badge component that renders small labeled indicators with different visual variants.
 * Features strategic CSS class memoization to optimize styling computations and prevent
 * unnecessary string concatenation operations on frequent re-renders.
 * 
 * This component is heavily used throughout the application for:
 * - Cart item counts in headers and shopping cart
 * - Product category labels on product cards
 * - Status indicators and notifications
 * - UI state visual feedback
 */

import { useMemo } from "react";
import type { BadgeProps } from "../../model/BadgeProps";

/**
 * Badge - Highly optimized atomic component for status indicators
 * 
 * This component demonstrates the importance of **styling memoization** in React applications.
 * While Badge is a simple component, it's used extensively throughout the application,
 * making CSS class computation optimization critical for overall performance.
 * 
 * ## Why Styling Memoization is CRITICAL for Badge Components:
 * 
 * ### 1. **High-Frequency Rendering Component**
 * Badge components are rendered in multiple high-traffic locations:
 * - **Cart Badges**: Update on every cart operation (add/remove/quantity change)
 * - **Product Category Labels**: Rendered for every product in ProductGrid (20+ instances)
 * - **Notification Indicators**: Update with real-time application state changes
 * - **Status Displays**: Frequently updated based on user interactions
 * 
 * ### 2. **Expensive String Concatenation Operations**
 * Without memoization, every render triggers costly operations:
 * - **Object Property Lookups**: Accessing variantClasses[variant] and sizeClasses[size]
 * - **String Concatenation**: Combining 4+ className strings with template literals
 * - **Conditional Logic Processing**: Evaluating variant and size combinations
 * - **Memory Allocation**: Creating new strings for className on every render
 * 
 * Example performance cost without memoization:
 * ```javascript
 * // EVERY render would execute:
 * const variantClasses = { default: "bg-gray-100 text-gray-800", ... }; // Object creation
 * const sizeClasses = { sm: "px-2 py-1 text-xs", ... }; // Object creation  
 * const result = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`; // String concatenation
 * ```
 * 
 * ### 3. **CSS-in-JS Performance Impact**
 * Styling computations in modern React apps have significant performance implications:
 * - **Runtime CSS Generation**: Dynamic className strings trigger style recalculations
 * - **DOM Style Updates**: Browser must recompute styles when className changes
 * - **Memory Pressure**: Frequent string allocation increases garbage collection
 * - **Bundle Size Impact**: Large style objects in memory during runtime
 * 
 * ### 4. **Cascade Effect in Component Trees**
 * Badge components often render multiple times in lists:
 * - **ProductGrid**: 20+ product cards each with category badges
 * - **Cart Items**: Multiple quantity badges in shopping cart
 * - **Navigation**: Category filter badges in header
 * 
 * Without memoization: 20 badges × string concatenation = 20 unnecessary operations per parent re-render
 * With memoization: Only badges with changed props trigger className recalculation
 * 
 * ## Styling Memoization Strategy Analysis:
 * 
 * ### **useMemo Dependency Array: [variant, size, className]**
 * 
 * **✅ INCLUDES variant**: 
 * - Different variants require different color schemes (success=green, error=red, etc.)
 * - Variant changes must trigger className recalculation
 * - Object lookup: `variantClasses[variant]` depends on this value
 * 
 * **✅ INCLUDES size**: 
 * - Different sizes require different padding and font-size classes
 * - Size changes must trigger className recalculation  
 * - Object lookup: `sizeClasses[size]` depends on this value
 * 
 * **✅ INCLUDES className**: 
 * - Custom className prop allows additional styling
 * - Changes to custom classes must trigger recalculation
 * - String concatenation includes this value in final result
 * 
 * **❌ EXCLUDES children**: 
 * - Badge content doesn't affect CSS classes
 * - Text content is independent of styling computation
 * - Children changes shouldn't trigger className recalculation
 * 
 * **❌ EXCLUDES static objects (baseClasses, variantClasses, sizeClasses)**:
 * - These are defined inline and don't change between renders
 * - Including them would cause unnecessary recalculations
 * - They're created fresh on each render but have stable values
 * 
 * ## Performance Optimization Benefits:
 * 
 * ### **Before Memoization (Inefficient)**:
 * ```javascript
 * // Every render, even when variant/size/className unchanged:
 * 1. Create variantClasses object
 * 2. Create sizeClasses object  
 * 3. Perform object lookups: variantClasses[variant], sizeClasses[size]
 * 4. Concatenate 4 strings: baseClasses + variant + size + className
 * 5. Allocate memory for new string
 * ```
 * 
 * ### **After Memoization (Optimized)**:
 * ```javascript
 * // Only when variant, size, or className actually changes:
 * 1. Compare dependencies with previous values
 * 2. If unchanged: return cached className string (O(1) operation)
 * 3. If changed: perform computation and cache result
 * ```
 * 
 * ## Real-World Performance Impact:
 * 
 * **Scenario**: ProductGrid with 20 product cards, each with a category badge
 * 
 * **Without styling memoization**:
 * - User searches for products → Parent re-renders → 20 badges recalculate classes
 * - 20 × (object creation + lookups + string concatenation) = Significant CPU overhead
 * - Each badge performs ~4-5 operations unnecessarily
 * 
 * **With styling memoization**:
 * - User searches for products → Parent re-renders → Badges check dependencies
 * - 20 × O(1) dependency comparison = Minimal CPU overhead
 * - Only badges with changed variant/size/className perform computation
 * 
 * @component
 * @param {BadgeProps} props - The component props
 * @param {React.ReactNode} props.children - Content to display inside the badge
 * @param {"default" | "success" | "warning" | "error" | "info"} [props.variant="default"] - Visual style variant
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Size variant affecting padding and font size
 * @param {string} [props.className=""] - Additional CSS classes to apply
 * 
 * @returns {JSX.Element} Styled badge element
 * 
 * @example
 * ```tsx
 * // Cart item count badge (updates frequently)
 * <Badge variant="error" size="sm" className="absolute -top-2 -right-2">
 *   {cartItemCount > 99 ? "99+" : cartItemCount}
 * </Badge>
 * ```
 * 
 * @example
 * ```tsx
 * // Product category badge (rendered in lists)
 * <Badge variant="info" size="sm" className="absolute top-2 left-2">
 *   {product.category}
 * </Badge>
 * ```
 * 
 * @example
 * ```tsx
 * // Performance comparison
 * // High-frequency component (cart badge updates on every cart operation)
 * 
 * // Without memoization:
 * // Cart state changes → Header re-renders → Badge recalculates classes
 * // Even when variant="error", size="sm", className remain unchanged
 * 
 * // With memoization:  
 * // Cart state changes → Header re-renders → Badge checks dependencies
 * // variant, size, className unchanged → Returns cached className string
 * // Only cartItemCount (children) changed → Badge renders with same classes
 * ```
 */
export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) => {
  /**
   * Memoized CSS classes computation
   * 
   * Optimizes the expensive process of combining multiple className strings
   * and performing object lookups for variant and size-based styling.
   * 
   * COMPUTATION BREAKDOWN:
   * 1. **Base Classes**: Common styling applied to all badges
   * 2. **Variant Classes**: Color scheme based on badge type (success, error, etc.)
   * 3. **Size Classes**: Padding and font-size based on size prop
   * 4. **Custom Classes**: Additional styling from className prop
   * 
   * DEPENDENCY ARRAY: [variant, size, className]
   * - **variant**: Changes trigger different color schemes
   * - **size**: Changes trigger different padding/font-size
   * - **className**: Changes include additional custom styling
   * 
   * PERFORMANCE OPTIMIZATION:
   * - Prevents object recreation on every render
   * - Avoids redundant string concatenation operations
   * - Reduces memory allocation for className strings
   * - Optimizes object property lookups (variantClasses[variant])
   * 
   * @example
   * // variant="success", size="lg", className="custom"
   * // Result: "inline-flex items-center font-medium rounded-full bg-green-100 text-green-800 px-4 py-2 text-base custom"
   */
  const classes = useMemo(() => {
    // Base styling applied to all badge variants
    const baseClasses = "inline-flex items-center font-medium rounded-full";
    
    // Color schemes for different badge types
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };
    
    // Size-based padding and font sizing
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1 text-sm", 
      lg: "px-4 py-2 text-base",
    };
    
    // Combine all classes into final className string
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  }, [variant, size, className]); // Only recalculate when styling props change

  return <span className={classes}>{children}</span>;
};

/**
 * Display name for React DevTools debugging
 * Helps identify badge performance patterns in React DevTools Profiler
 */
Badge.displayName = "Badge";
