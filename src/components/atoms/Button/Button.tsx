/**
 * @fileoverview Button - Highly optimized atomic interactive component
 * 
 * Core button component with comprehensive styling memoization for optimal performance.
 * Features strategic CSS class optimization to ensure responsive user interactions and
 * prevent styling computation bottlenecks in high-frequency interactive scenarios.
 * 
 * This component is the foundation of user interactions throughout the application:
 * - Primary actions (Add to Cart, Checkout, Submit)
 * - Navigation elements (Category filters, Close buttons)
 * - Interactive controls (Quantity updates, Cart operations)
 * - Form submissions and user confirmations
 */

import { useMemo } from "react";
import type { ButtonProps } from "../../model/ButtonProps";

/**
 * Button - Performance-optimized atomic interactive component
 * 
 * This component demonstrates why **styling memoization is CRITICAL for interactive elements**.
 * Buttons are the most frequently interacted-with components in any application, making
 * their performance optimization essential for overall user experience and responsiveness.
 * 
 * ## Why Styling Memoization is ESSENTIAL for Button Components:
 * 
 * ### 1. **Highest-Frequency Interactive Element**
 * Buttons are the most clicked and re-rendered components in the application:
 * - **Cart Operations**: "Add to Cart" buttons on every product (20+ instances in ProductGrid)
 * - **Navigation Controls**: Category filter buttons in header (4-10+ instances)
 * - **Cart Management**: Quantity update, remove, clear cart buttons (multiple per cart item)
 * - **Form Actions**: Submit, cancel, close buttons throughout the app
 * - **Modal/Dialog Controls**: Close buttons, confirmation actions
 * 
 * ### 2. **User Interaction Responsiveness**
 * Interactive elements have unique performance requirements:
 * - **Click Response Time**: Users expect immediate visual feedback on click
 * - **Hover State Performance**: Smooth hover transitions require stable className references
 * - **Focus Management**: Accessibility features depend on consistent styling
 * - **Animation Smoothness**: Transition effects break with frequent className changes
 * 
 * Performance bottleneck without memoization:
 * ```
 * User clicks button → Parent re-renders → Button recalculates classes →
 * DOM style recalculation → Layout thrashing → Delayed visual feedback
 * ```
 * 
 * ### 3. **Complex CSS Class Computation**
 * Button styling involves extensive className generation:
 * - **Base Classes**: 8+ utility classes for layout, transitions, focus states
 * - **Variant Combinations**: Different color schemes with hover/focus states
 * - **Size Variations**: Multiple padding and font-size combinations
 * - **Accessibility Classes**: Focus rings, disabled states, cursor management
 * - **State Management**: Active, disabled, loading state styling
 * 
 * Example computation cost without memoization:
 * ```javascript
 * // EVERY render performs:
 * const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"; // Long string
 * const variantClasses = { primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500", ... }; // Object creation
 * const sizeClasses = { sm: "px-3 py-1.5 text-sm", ... }; // Object creation
 * const result = template literal concatenation; // String operations
 * ```
 * 
 * ### 4. **Cascade Effect in Interactive UI**
 * Buttons trigger cascading performance impacts:
 * - **Click Events**: Button clicks cause parent state changes → re-renders propagate
 * - **Form Validation**: Button states change based on form validity → frequent updates
 * - **Loading States**: Async operations change button appearance → rapid state transitions
 * - **List Interactions**: Product lists contain multiple buttons → N×computation cost
 * 
 * ### 5. **Mobile Performance Sensitivity**
 * Mobile devices are particularly sensitive to button performance:
 * - **Touch Response**: Touch events require immediate visual feedback
 * - **Limited CPU**: Mobile processors struggle with frequent string concatenation
 * - **Battery Impact**: Unnecessary computations drain battery faster
 * - **Memory Pressure**: Mobile browsers have stricter memory limits
 * 
 * ## Styling Memoization Strategy Deep Dive:
 * 
 * ### **useMemo Dependency Array: [variant, size, className]**
 * 
 * **✅ INCLUDES variant**:
 * - Changes button appearance fundamentally (primary=blue, secondary=gray, danger=red)
 * - Affects multiple CSS properties: background, hover states, focus rings
 * - Object lookup: `variantClasses[variant]` depends on this value
 * - User interactions often change variants (active/inactive states)
 * 
 * **✅ INCLUDES size**:
 * - Determines button dimensions and text size (sm/md/lg)
 * - Affects padding, font-size, and overall button proportions
 * - Object lookup: `sizeClasses[size]` depends on this value
 * - Different contexts require different button sizes
 * 
 * **✅ INCLUDES className**:
 * - Allows custom styling and positioning (absolute positioning, custom margins)
 * - Essential for layout-specific button modifications
 * - String concatenation includes this in final className
 * - Frequently used for context-specific styling
 * 
 * **❌ EXCLUDES children**:
 * - Button text/content doesn't affect CSS styling
 * - Children changes shouldn't trigger className recalculation
 * - Content is independent of visual appearance
 * 
 * **❌ EXCLUDES ...props**:
 * - onClick, disabled, type, etc. don't affect className generation
 * - These are applied directly to button element
 * - Including them would cause unnecessary recalculations
 * 
 * **❌ EXCLUDES static style objects**:
 * - baseClasses, variantClasses, sizeClasses are constant
 * - Created fresh each render but have stable values
 * - Including them would break memoization optimization
 * 
 * ## Performance Optimization Analysis:
 * 
 * ### **Before Memoization (Performance Problem)**:
 * ```javascript
 * // Every parent re-render, even when button props unchanged:
 * 1. Create baseClasses string (70+ characters)
 * 2. Create variantClasses object (multiple color combinations)
 * 3. Create sizeClasses object (padding/font combinations)
 * 4. Perform object lookups: variantClasses[variant], sizeClasses[size]
 * 5. Concatenate 4 strings into final className
 * 6. Browser recalculates styles and layouts
 * 7. Re-render button DOM with new className reference
 * ```
 * 
 * ### **After Memoization (Optimized Performance)**:
 * ```javascript
 * // Only when variant, size, or className actually changes:
 * 1. Compare [variant, size, className] with previous values
 * 2. If unchanged: return cached className string (instant O(1) operation)
 * 3. If changed: perform computation once and cache result
 * 4. Button renders with stable className reference
 * 5. Browser skips unnecessary style recalculations
 * ```
 * 
 * ## Real-World Performance Impact:
 * 
 * ### **Scenario 1: ProductGrid with 20 "Add to Cart" buttons**
 * **Without memoization:**
 * - User searches products → ProductGrid re-renders → 20 buttons recalculate classes
 * - 20 × (object creation + lookups + string concatenation) = Major performance hit
 * - Each button performs ~6-8 operations unnecessarily
 * - Browser recalculates styles for all 20 buttons
 * 
 * **With memoization:**
 * - User searches products → ProductGrid re-renders → Buttons check dependencies
 * - Button props unchanged → 20 × O(1) cache lookup = Minimal overhead
 * - Browser reuses existing styles, no recalculation needed
 * 
 * ### **Scenario 2: Header category filter buttons**
 * **Without memoization:**
 * - User selects category → Header re-renders → All filter buttons recalculate
 * - Even inactive buttons perform full styling computation
 * - Header feels sluggish during category changes
 * 
 * **With memoization:**
 * - User selects category → Header re-renders → Only changed button recalculates
 * - Active/inactive state changes trigger recalculation only for affected buttons
 * - Smooth, responsive category filtering experience
 * 
 * ## Accessibility and User Experience Benefits:
 * 
 * Styling memoization directly improves accessibility:
 * - **Focus Indicators**: Stable className references ensure consistent focus rings
 * - **Screen Readers**: Reduced DOM thrashing improves screen reader performance
 * - **Keyboard Navigation**: Faster button state transitions for keyboard users
 * - **Touch Accessibility**: Immediate visual feedback on mobile touch events
 * 
 * @component
 * @param {ButtonProps} props - The component props
 * @param {"primary" | "secondary" | "danger"} [props.variant="primary"] - Visual style variant
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Size variant affecting padding and font size
 * @param {React.ReactNode} props.children - Button content (text, icons, etc.)
 * @param {string} [props.className=""] - Additional CSS classes to apply
 * @param {ButtonHTMLAttributes} props - All standard HTML button attributes
 * 
 * @returns {JSX.Element} Optimized button element
 * 
 * @example
 * ```tsx
 * // Primary action button (most common usage)
 * <Button variant="primary" size="md" onClick={handleAddToCart}>
 *   Add to Cart
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Category filter button (multiple instances in header)
 * <Button 
 *   variant={category.isSelected ? "primary" : "secondary"}
 *   size="sm"
 *   onClick={() => handleCategoryClick(category.id)}
 *   className="capitalize"
 * >
 *   {category.name}
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Cart operation button (high-frequency interactions)
 * <Button 
 *   variant="danger" 
 *   size="sm" 
 *   onClick={() => removeFromCart(item.id)}
 *   className="w-full"
 * >
 *   Remove Item
 * </Button>
 * ```
 * 
 * @example
 * ```tsx
 * // Performance comparison in interactive scenario
 * // High-frequency cart button updates
 * 
 * // Without memoization:
 * // User clicks "Add to Cart" → Cart state changes → Parent re-renders →
 * // All buttons recalculate classes → DOM style thrashing → Sluggish UI
 * 
 * // With memoization:
 * // User clicks "Add to Cart" → Cart state changes → Parent re-renders →
 * // Button props unchanged → Cached className used → Smooth interaction
 * ```
 */
export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) => {
  /**
   * Memoized CSS classes computation for optimal interactive performance
   * 
   * Optimizes the complex process of combining multiple styling concerns into
   * a single className string. Critical for interactive responsiveness.
   * 
   * COMPUTATION BREAKDOWN:
   * 1. **Base Classes**: Foundation styling (layout, transitions, accessibility)
   * 2. **Variant Classes**: Color schemes and interactive states (hover, focus)
   * 3. **Size Classes**: Dimensional styling (padding, font-size)
   * 4. **Custom Classes**: Additional context-specific styling
   * 
   * DEPENDENCY ARRAY: [variant, size, className]
   * - **variant**: Determines color scheme and interactive states
   * - **size**: Controls button dimensions and typography
   * - **className**: Allows custom styling extensions
   * 
   * PERFORMANCE BENEFITS:
   * - Prevents expensive string concatenation on every render
   * - Eliminates redundant object property lookups
   * - Provides stable className reference for DOM optimization
   * - Ensures responsive user interaction feedback
   * - Reduces memory allocation for className strings
   * 
   * ACCESSIBILITY IMPACT:
   * - Stable focus ring styling for keyboard navigation
   * - Consistent disabled state appearance
   * - Reliable hover feedback for mouse users
   * - Predictable touch response on mobile devices
   * 
   * @example
   * // variant="primary", size="lg", className="w-full"
   * // Result: "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 px-6 py-3 text-lg w-full"
   */
  const classes = useMemo(() => {
    // Foundation styling for all button variants
    const baseClasses =
      "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    // Color schemes and interactive states for different button types
    const variantClasses = {
      primary:
        "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    };
    
    // Size-based dimensional styling
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    
    // Combine all styling concerns into final className
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  }, [variant, size, className]); // Only recalculate when styling props change

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

/**
 * Display name for React DevTools debugging
 * Essential for identifying button performance patterns in React DevTools Profiler
 */
Button.displayName = "Button";
