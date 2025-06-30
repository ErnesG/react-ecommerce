/**
 * @fileoverview BadgeProps - Type definitions for Badge component properties
 * 
 * TypeScript interface defining the props structure for the Badge atomic component.
 * These props directly influence the Badge component's styling memoization strategy
 * and performance optimizations discussed in the Badge component documentation.
 * 
 * The props are designed to provide maximum flexibility while maintaining optimal
 * performance through strategic memoization of styling computations.
 */

/**
 * Props interface for the Badge atomic component
 * 
 * Defines the complete API surface for Badge components with a focus on
 * performance-optimized styling variants and accessibility features.
 * 
 * ## Styling Performance Impact:
 * 
 * These props directly correspond to the Badge component's memoization strategy:
 * - `variant`, `size`, and `className` are included in useMemo dependency array
 * - `children` is excluded from styling memoization (content-independent)
 * - Changes to styling props trigger className recalculation
 * - Changes to content (children) don't affect cached styling
 * 
 * ## Design Philosophy:
 * 
 * The prop structure follows atomic design principles:
 * - **Minimal API**: Only essential props for maximum reusability
 * - **Variant-based Styling**: Predefined visual styles for consistency
 * - **Size System**: Consistent sizing across the design system
 * - **Extensibility**: className prop allows custom styling when needed
 * 
 * @interface BadgeProps
 */
export interface BadgeProps {
  /**
   * Content to display inside the badge
   * 
   * Can be any valid React content including text, numbers, icons, or JSX elements.
   * This prop is intentionally excluded from the Badge component's styling memoization
   * because content changes shouldn't trigger className recalculation.
   * 
   * @example
   * ```tsx
   * // Text content (most common)
   * <Badge>New</Badge>
   * 
   * // Numeric content (cart counts, notifications)
   * <Badge variant="error">{cartItemCount}</Badge>
   * 
   * // Conditional content with overflow handling
   * <Badge variant="error">
   *   {count > 99 ? "99+" : count}
   * </Badge>
   * 
   * // Icon with text
   * <Badge variant="success">
   *   <span>✓ Verified</span>
   * </Badge>
   * ```
   * 
   * @performance
   * Content changes do not trigger Badge styling recalculation, enabling
   * smooth updates for dynamic content like cart counts or notification numbers.
   */
  children: React.ReactNode;

  /**
   * Visual style variant for the badge
   * 
   * Determines the color scheme and semantic meaning of the badge.
   * This prop is critical for the Badge component's styling memoization
   * as it directly affects the className computation.
   * 
   * @default "default"
   * 
   * **Available Variants:**
   * - `default`: Neutral gray styling for general-purpose badges
   * - `success`: Green styling for positive states (verified, completed, active)
   * - `warning`: Yellow/amber styling for caution states (pending, review needed)
   * - `error`: Red styling for negative states (error, danger, high priority)
   * - `info`: Blue styling for informational states (new, updated, info)
   * 
   * @example
   * ```tsx
   * // Product category badges
   * <Badge variant="info">Electronics</Badge>
   * <Badge variant="success">In Stock</Badge>
   * <Badge variant="warning">Low Stock</Badge>
   * <Badge variant="error">Out of Stock</Badge>
   * 
   * // Status indicators
   * <Badge variant="success">Verified Account</Badge>
   * <Badge variant="warning">Pending Approval</Badge>
   * <Badge variant="error">Account Suspended</Badge>
   * 
   * // Cart and notification badges
   * <Badge variant="error">{cartItemCount}</Badge>
   * <Badge variant="info">{notificationCount}</Badge>
   * ```
   * 
   * @performance
   * Variant changes trigger Badge className recalculation. Use stable
   * variant values when possible to maximize memoization benefits.
   * 
   * @accessibility
   * Color alone should not convey meaning. Always pair colored variants
   * with descriptive text or icons for screen reader users.
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';

  /**
   * Size variant for the badge
   * 
   * Controls the overall dimensions, padding, and font size of the badge.
   * This prop directly influences the Badge component's className computation
   * and is included in the styling memoization dependency array.
   * 
   * @default "md"
   * 
   * **Available Sizes:**
   * - `sm`: Small badges for compact UI elements (cart counts, inline status)
   * - `md`: Medium badges for standard usage (category labels, notifications)
   * - `lg`: Large badges for prominent display (hero sections, feature highlights)
   * 
   * @example
   * ```tsx
   * // Cart item count (compact)
   * <Badge variant="error" size="sm">{cartCount}</Badge>
   * 
   * // Product category label (standard)
   * <Badge variant="info" size="md">{product.category}</Badge>
   * 
   * // Feature highlight (prominent)
   * <Badge variant="success" size="lg">New Feature</Badge>
   * 
   * // Responsive sizing based on context
   * <Badge size={isMobile ? "sm" : "md"}>Status</Badge>
   * ```
   * 
   * @performance
   * Size changes trigger Badge className recalculation. Consider using
   * consistent sizes within component contexts to benefit from memoization.
   * 
   * @responsive
   * Consider different sizes for different screen sizes, but be mindful
   * that size changes will trigger style recalculation.
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes to apply to the badge
   * 
   * Allows for custom styling and layout modifications beyond the default
   * variant and size options. This prop is included in the Badge component's
   * memoization dependency array, so changes will trigger recalculation.
   * 
   * @default ""
   * 
   * **Common Use Cases:**
   * - Positioning (absolute, relative positioning)
   * - Spacing (margins, padding adjustments)
   * - Layout (flexbox, grid utilities)
   * - Custom animations or transitions
   * - Theme-specific overrides
   * 
   * @example
   * ```tsx
   * // Positioned badge (cart count on button)
   * <Badge 
   *   variant="error" 
   *   size="sm" 
   *   className="absolute -top-2 -right-2"
   * >
   *   {cartCount}
   * </Badge>
   * 
   * // Responsive visibility
   * <Badge 
   *   variant="info" 
   *   className="hidden sm:inline-flex"
   * >
   *   Desktop Only
   * </Badge>
   * 
   * // Custom spacing
   * <Badge 
   *   variant="success" 
   *   className="ml-2 mt-1"
   * >
   *   Verified
   * </Badge>
   * 
   * // Animation classes
   * <Badge 
   *   variant="warning" 
   *   className="animate-pulse"
   * >
   *   Updating...
   * </Badge>
   * ```
   * 
   * @performance
   * Changes to className trigger Badge styling recalculation. For optimal
   * performance, use stable className values when possible. Avoid frequently
   * changing custom classes in high-frequency update scenarios.
   * 
   * @bestpractices
   * - Use Tailwind CSS utility classes for consistency
   * - Avoid inline styles; prefer className-based styling
   * - Consider extracting common className patterns into reusable constants
   * - Be mindful of className changes in animations or dynamic styling
   */
  className?: string;
}