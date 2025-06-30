/**
 * @fileoverview InputProps - Type definitions for Input component properties
 * 
 * Extends React's native input attributes with additional styling and 
 * validation props for enhanced form input components.
 */

/**
 * Props interface for the Input component
 * 
 * @performance
 * - Extends native HTMLInputElement attributes for optimal DOM integration
 * - Optional props support conditional rendering optimizations
 * - Variant and size props enable memoized className generation
 * 
 * @example
 * ```tsx
 * <Input 
 *   label="Email"
 *   placeholder="Enter your email"
 *   variant="outlined"
 *   inputSize="md"
 *   error={emailError}
 *   helperText="We'll never share your email"
 * />
 * ```
 * 
 * @interface InputProps
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional label text displayed above the input */
  label?: string;
  
  /** Error message displayed when validation fails */
  error?: string;
  
  /** Helper text displayed below the input for guidance */
  helperText?: string;
  
  /** Visual style variant for the input appearance */
  variant?: "default" | "outlined";
  
  /** Size variant controlling input dimensions and padding */
  inputSize?: "sm" | "md" | "lg";
}
