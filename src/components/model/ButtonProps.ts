/**
 * @fileoverview ButtonProps - Type definitions for Button component properties
 * 
 * Extends standard HTML button attributes with custom variant and size props.
 * These props directly influence the Button component's styling memoization strategy.
 */

/**
 * Props interface for the Button atomic component
 * 
 * Extends HTMLButtonAttributes to provide enhanced styling options while
 * maintaining full compatibility with standard button functionality.
 * 
 * ## Performance Context:
 * - `variant`, `size` included in Button's useMemo dependency array
 * - `children` excluded from styling memoization (content-independent)
 * - Changes to styling props trigger className recalculation
 * 
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant for the button
   * 
   * @default "primary"
   * 
   * - `primary`: Blue styling for main actions (Add to Cart, Submit)
   * - `secondary`: Gray styling for secondary actions (Cancel, Close)  
   * - `danger`: Red styling for destructive actions (Delete, Remove)
   * 
   * @performance Triggers Button className recalculation when changed
   * 
   * @example
   * ```tsx
   * <Button variant="primary">Add to Cart</Button>
   * <Button variant="danger">Delete Item</Button>
   * ```
   */
  variant?: "primary" | "secondary" | "danger";

  /**
   * Size variant for the button
   * 
   * @default "md"
   * 
   * - `sm`: Compact buttons (px-3 py-1.5 text-sm)
   * - `md`: Standard buttons (px-4 py-2 text-base)
   * - `lg`: Large buttons (px-6 py-3 text-lg)
   * 
   * @performance Triggers Button className recalculation when changed
   * 
   * @example
   * ```tsx
   * <Button size="lg">Checkout</Button>
   * <Button size="sm">Close</Button>
   * ```
   */
  size?: "sm" | "md" | "lg";

  /**
   * Button content (text, icons, JSX elements)
   * 
   * @performance Content changes do not trigger styling recalculation
   * 
   * @example
   * ```tsx
   * <Button>Add to Cart</Button>
   * <Button>{loading ? "Loading..." : "Submit"}</Button>
   * ```
   */
  children: React.ReactNode;
}
