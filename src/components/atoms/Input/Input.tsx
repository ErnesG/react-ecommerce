/**
 * @fileoverview Input - Highly optimized atomic form input component with ref forwarding
 * 
 * Advanced form input component featuring comprehensive performance optimizations through
 * styling memoization, stable ID generation, and proper ref forwarding for form library
 * integration. Designed to handle high-frequency user input while maintaining responsiveness.
 * 
 * This component is critical for user interactions throughout the application:
 * - Search functionality with real-time filtering
 * - Form inputs with validation and error states
 * - Quantity inputs in cart management
 * - User profile and settings forms
 */

import { forwardRef, useMemo } from "react";
import type { InputProps } from "../../model/InputProps";

/**
 * Input - Performance-optimized atomic form input component with ref forwarding
 * 
 * This component demonstrates the critical importance of **performance optimization for form inputs**.
 * Input components are among the most performance-sensitive elements because they handle
 * real-time user typing, frequent re-renders, and complex styling state management.
 * 
 * ## Why Performance Optimization is CRITICAL for Input Components:
 * 
 * ### 1. **Real-Time User Input Handling**
 * Input components process user interactions at the highest frequency:
 * - **Keystroke Processing**: Every character typed triggers potential re-renders
 * - **Search Functionality**: Real-time search filtering on every input change
 * - **Form Validation**: Live validation feedback during typing
 * - **Debounced Operations**: Even with debouncing, rapid input changes occur
 * - **Mobile Typing**: Touch keyboards generate rapid input events
 * 
 * Performance bottleneck without optimization:
 * ```
 * User types character → Input value changes → Parent re-renders →
 * Input recalculates classes → DOM style recalculation → Input lag/stutter
 * ```
 * 
 * ### 2. **Complex Multi-State Styling**
 * Input components have the most complex styling logic of atomic components:
 * - **Base Styling**: Layout, transitions, focus management
 * - **Variant States**: Default vs outlined input styles
 * - **Size Variations**: Small, medium, large with different padding/fonts
 * - **Error States**: Validation error styling with red borders/text
 * - **Focus States**: Interactive focus rings and border color changes
 * - **Disabled States**: Opacity and cursor management
 * 
 * Without memoization, every keystroke would recalculate:
 * ```javascript
 * // EVERY character typed triggers:
 * const baseClasses = "w-full transition-colors focus:outline-none"; // String creation
 * const variantClasses = { default: "...", outlined: "..." }; // Object creation
 * const sizeClasses = { sm: "...", md: "...", lg: "..." }; // Object creation
 * const errorClasses = error ? "border-red-500..." : ""; // Conditional logic
 * const result = template literal concatenation; // String operations
 * ```
 * 
 * ### 3. **Form Library Integration Requirements**
 * Modern form libraries (React Hook Form, Formik) require stable references:
 * - **Ref Forwarding**: Form libraries need direct input element access
 * - **Stable IDs**: Consistent element identification for form state management
 * - **Event Handler Stability**: Prevents unnecessary form re-registration
 * - **Validation Integration**: Error states must update efficiently
 * 
 * ## Why forwardRef is ESSENTIAL for Input Components:
 * 
 * ### **1. Form Library Compatibility**
 * ```tsx
 * // React Hook Form requires direct input access:
 * const { register } = useForm();
 * <Input {...register("email")} /> // Needs ref forwarding to work
 * ```
 * 
 * ### **2. Focus Management**
 * ```tsx
 * // Programmatic focus control:
 * const inputRef = useRef<HTMLInputElement>(null);
 * const handleSubmit = () => {
 *   if (error) inputRef.current?.focus(); // Requires ref access
 * };
 * <Input ref={inputRef} />
 * ```
 * 
 * ### **3. Accessibility Features**
 * - Screen readers need stable element references
 * - Focus trapping in modals requires ref access
 * - Keyboard navigation depends on element focus control
 * 
 * ### **4. Performance Benefits**
 * - Form libraries can directly control input without wrapper re-renders
 * - Eliminates need for additional DOM queries
 * - Enables efficient form state synchronization
 * 
 * ## Memoization Strategy Analysis:
 * 
 * ### **1. inputId useMemo - Stable ID Generation**
 * ```tsx
 * const inputId = useMemo(
 *   () => id || `input-${Math.random().toString(36).substr(2, 9)}`,
 *   [id]
 * );
 * ```
 * 
 * **DEPENDENCY ARRAY: [id]**
 * - ✅ **INCLUDES id**: When custom ID provided, use it; otherwise generate stable random ID
 * - ❌ **EXCLUDES Math.random()**: Would regenerate ID on every render, breaking accessibility
 * 
 * **Why this matters:**
 * - **Accessibility**: Screen readers rely on stable element IDs
 * - **Form Integration**: Form libraries track inputs by stable identifiers
 * - **Label Association**: htmlFor attribute needs consistent ID reference
 * - **Browser Autofill**: Browsers remember form fields by stable IDs
 * 
 * ### **2. inputClasses useMemo - Complex Styling Optimization**
 * ```tsx
 * const inputClasses = useMemo(() => {
 *   // Complex computation involving multiple style objects
 * }, [variant, inputSize, error, className]);
 * ```
 * 
 * **DEPENDENCY ARRAY: [variant, inputSize, error, className]**
 * 
 * **✅ INCLUDES variant**:
 * - Changes fundamental input appearance (default=underline, outlined=border)
 * - Affects focus states and visual hierarchy
 * - Object lookup: `variantClasses[variant]` depends on this value
 * 
 * **✅ INCLUDES inputSize**:
 * - Controls padding, font-size, and overall input dimensions
 * - Object lookup: `sizeClasses[inputSize]` depends on this value
 * - Different contexts require different input sizes
 * 
 * **✅ INCLUDES error**:
 * - Error state dramatically changes styling (red borders, focus colors)
 * - Conditional logic: `error ? "border-red-500..." : ""` depends on this
 * - Critical for form validation visual feedback
 * 
 * **✅ INCLUDES className**:
 * - Custom styling for specific use cases
 * - String concatenation includes this in final result
 * - Layout-specific modifications (width, margins, positioning)
 * 
 * **❌ EXCLUDES label, helperText**:
 * - These don't affect input element styling
 * - Only used for surrounding elements
 * - Including them would cause unnecessary recalculations
 * 
 * **❌ EXCLUDES ...props**:
 * - onChange, onBlur, value, etc. don't affect className
 * - These are applied directly to input element
 * - Including them would break optimization
 * 
 * ## Real-World Performance Impact:
 * 
 * ### **Scenario 1: Search Input with Real-Time Filtering**
 * ```tsx
 * // SearchBar component using Input
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 300);
 * 
 * // Without memoization:
 * // User types "phone" → 5 keystrokes → 5 × className recalculation
 * // Each keystroke: object creation + lookups + string concatenation
 * // Search feels sluggish due to input lag
 * 
 * // With memoization:
 * // User types "phone" → 5 keystrokes → 5 × O(1) cache lookup
 * // Input styling stable, no recalculation needed
 * // Smooth, responsive search experience
 * ```
 * 
 * ### **Scenario 2: Form with Validation**
 * ```tsx
 * // Contact form with live validation
 * const [email, setEmail] = useState("");
 * const [error, setError] = useState("");
 * 
 * // Without memoization:
 * // User types invalid email → error state changes → className recalculates
 * // Every validation change triggers expensive styling computation
 * // Form feels unresponsive during typing
 * 
 * // With memoization:
 * // User types invalid email → error dependency changes → recalculate once
 * // Subsequent typing with same error state → cached className
 * // Responsive validation feedback
 * ```
 * 
 * ### **Scenario 3: Cart Quantity Input**
 * ```tsx
 * // Quantity input in cart items
 * // Multiple inputs in cart → N × styling computations
 * // Without memoization: All inputs recalculate on cart updates
 * // With memoization: Only changed inputs recalculate
 * ```
 * 
 * ## Accessibility and User Experience Benefits:
 * 
 * Performance optimizations directly improve accessibility:
 * - **Screen Reader Performance**: Stable IDs and reduced DOM changes
 * - **Keyboard Navigation**: Responsive focus management
 * - **Form Validation**: Immediate error feedback without lag
 * - **Mobile Experience**: Smooth typing on touch keyboards
 * - **Focus Indicators**: Stable styling for focus ring visibility
 * 
 * @component
 * @param {InputProps} props - The component props with ref forwarding
 * @param {string} [props.label] - Label text displayed above the input
 * @param {string} [props.error] - Error message displayed below input (overrides helperText)
 * @param {string} [props.helperText] - Helper text displayed below input when no error
 * @param {"default" | "outlined"} [props.variant="outlined"] - Visual style variant
 * @param {"sm" | "md" | "lg"} [props.inputSize="md"] - Size variant affecting padding and font size
 * @param {string} [props.className=""] - Additional CSS classes to apply to input element
 * @param {string} [props.id] - Custom element ID (auto-generated if not provided)
 * @param {HTMLInputElement} ref - Forwarded ref to the input element
 * @param {InputHTMLAttributes} props - All standard HTML input attributes
 * 
 * @returns {JSX.Element} Optimized form input with label and error handling
 * 
 * @example
 * ```tsx
 * // Search input with real-time filtering
 * const SearchBar = () => {
 *   const [query, setQuery] = useState("");
 *   const inputRef = useRef<HTMLInputElement>(null);
 * 
 *   return (
 *     <Input
 *       ref={inputRef}
 *       label="Search Products"
 *       variant="outlined"
 *       inputSize="md"
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Type to search..."
 *       className="w-64"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Form input with validation
 * const ContactForm = () => {
 *   const { register, formState: { errors } } = useForm();
 * 
 *   return (
 *     <Input
 *       {...register("email", { required: "Email is required" })}
 *       label="Email Address"
 *       variant="outlined"
 *       inputSize="lg"
 *       error={errors.email?.message}
 *       helperText="We'll never share your email"
 *       type="email"
 *       className="mb-4"
 *     />
 *   );
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Cart quantity input
 * <Input
 *   variant="outlined"
 *   inputSize="sm"
 *   type="number"
 *   min="1"
 *   value={quantity}
 *   onChange={(e) => updateQuantity(parseInt(e.target.value))}
 *   className="w-20 text-center"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Performance comparison in search scenario
 * // User types search query character by character
 * 
 * // Without memoization:
 * // Each keystroke → Parent re-renders → Input recalculates classes →
 * // Object creation + lookups + concatenation → DOM style update →
 * // Input feels laggy, search experience degraded
 * 
 * // With memoization:
 * // Each keystroke → Parent re-renders → Input checks dependencies →
 * // Styling props unchanged → Return cached className →
 * // Smooth, responsive search typing experience
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = "outlined",
      inputSize = "md",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    /**
     * Memoized stable input ID generation
     * 
     * Ensures consistent element identification for accessibility, form libraries,
     * and browser features. Critical for screen readers and form state management.
     * 
     * DEPENDENCY ARRAY: [id]
     * - When custom ID provided, use it consistently
     * - When no ID provided, generate stable random ID once
     * - Prevents ID regeneration that would break accessibility
     * 
     * PERFORMANCE BENEFITS:
     * - Stable element references for form libraries
     * - Consistent label association (htmlFor attribute)
     * - Reliable browser autofill functionality
     * - Screen reader element identification
     * 
     * ACCESSIBILITY IMPACT:
     * - Screen readers rely on stable IDs to track form elements
     * - Label-input association remains consistent
     * - Form validation messages can reference stable elements
     * 
     * @example
     * // id prop provided: uses custom ID consistently
     * // id="email-input" → always "email-input"
     * 
     * // No id prop: generates stable random ID once
     * // undefined → "input-abc123def" (stable across re-renders)
     */
    const inputId = useMemo(
      () => id || `input-${Math.random().toString(36).substr(2, 9)}`,
      [id] // Only regenerate when custom ID changes
    );

    /**
     * Memoized comprehensive input styling computation
     * 
     * Optimizes complex multi-state styling calculations involving base classes,
     * variant styling, size variations, error states, and custom classes.
     * Critical for responsive user input experience.
     * 
     * COMPUTATION BREAKDOWN:
     * 1. **Base Classes**: Foundation styling (width, transitions, focus management)
     * 2. **Variant Classes**: Visual style (default=underline, outlined=border)
     * 3. **Size Classes**: Dimensional styling (padding, font-size)
     * 4. **Error Classes**: Validation state styling (red borders, focus colors)
     * 5. **Custom Classes**: Additional context-specific styling
     * 
     * DEPENDENCY ARRAY: [variant, inputSize, error, className]
     * - **variant**: Fundamental appearance change (underline vs border)
     * - **inputSize**: Dimensional changes (padding, font-size)
     * - **error**: Validation state affects colors and borders
     * - **className**: Custom styling modifications
     * 
     * PERFORMANCE OPTIMIZATION:
     * - Prevents expensive object creation on every keystroke
     * - Eliminates redundant string concatenation during typing
     * - Provides stable className reference for DOM optimization
     * - Reduces memory allocation for styling strings
     * - Enables smooth real-time input interactions
     * 
     * REAL-TIME INPUT IMPACT:
     * - Search inputs: Prevents styling recalculation on every character
     * - Form validation: Only recalculates when error state actually changes
     * - Cart quantity: Stable styling during rapid number changes
     * - Mobile typing: Smooth experience on touch keyboards
     * 
     * @example
     * // variant="outlined", inputSize="lg", error="Required", className="w-full"
     * // Result: "w-full transition-colors focus:outline-none border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 px-5 py-4 text-lg border-red-500 focus:border-red-500 focus:ring-red-500 w-full"
     */
    const inputClasses = useMemo(() => {
      // Foundation styling for all input variants
      const baseClasses = "w-full transition-colors focus:outline-none";
      
      // Visual style variants (underline vs border)
      const variantClasses = {
        default:
          "border-0 border-b-2 border-gray-300 focus:border-primary-500 bg-transparent",
        outlined:
          "border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
      };
      
      // Size-based dimensional styling
      const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
      };
      
      // Error state styling (overrides default colors)
      const errorClasses = error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "";
      
      // Combine all styling concerns into final className
      return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${errorClasses} ${className}`;
    }, [variant, inputSize, error, className]); // Only recalculate when styling props change

    return (
      <div className="w-full">
        {/* Label with proper accessibility association */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        
        {/* Main input element with ref forwarding and optimized styling */}
        <input ref={ref} id={inputId} className={inputClasses} {...props} />
        
        {/* Error message or helper text */}
        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-red-600" : "text-gray-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

/**
 * Display name for React DevTools debugging
 * Essential for identifying input performance patterns and ref forwarding behavior
 */
Input.displayName = "Input";
