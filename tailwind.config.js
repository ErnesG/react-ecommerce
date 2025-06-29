/**
 * @fileoverview Tailwind CSS Configuration
 * 
 * This configuration file customizes Tailwind CSS for the React E-commerce application.
 * It defines the content scanning paths, extends the default theme with custom colors,
 * and establishes the design system foundation for consistent UI components.
 * 
 *
 * @version 1.0.0
 * @see {@link https://tailwindcss.com/docs/configuration} Tailwind Configuration Docs
 */

/** @type {import('tailwindcss').Config} */
export default {
  /**
   * Content Configuration - File Scanning Setup
   * 
   * Defines which files Tailwind should scan to generate the final CSS bundle.
   * This is critical for tree-shaking unused styles and optimizing bundle size.
   * 
   * 🎯 SCANNING STRATEGY:
   * - Includes HTML entry point for base template classes
   * - Scans all TypeScript/JavaScript files in src directory
   * - Covers React components (.tsx, .jsx) and utility files (.ts, .js)
   * - Uses glob patterns for comprehensive coverage
   * 
   * 📦 BUNDLE OPTIMIZATION:
   * - Only includes CSS for classes actually used in these files
   * - Significantly reduces production CSS bundle size
   * - Enables Tailwind's JIT (Just-In-Time) compilation
   */
  content: [
    "./index.html",              // Main HTML template with potential utility classes
    "./src/**/*.{js,ts,jsx,tsx}" // All source files with React components and utilities
  ],

  /**
   * Theme Configuration - Design System Extension
   * 
   * Extends Tailwind's default theme with custom design tokens while preserving
   * all default utilities. This approach maintains Tailwind's full utility set
   * while adding project-specific design elements.
   */
  theme: {
    /**
     * Theme Extensions - Custom Design Tokens
     * 
     * Using 'extend' preserves all default Tailwind utilities while adding
     * custom values. This is the recommended approach for most projects as it
     * maintains the full Tailwind ecosystem.
     */
    extend: {
      /**
       * Custom Color Palette - Primary Brand Colors
       * 
       * Defines a consistent primary color system following Tailwind's
       * numeric scale convention (50-900). This creates a cohesive design
       * language across all UI components.
       * 
       * 🎨 COLOR SYSTEM DESIGN:
       * - Based on blue color family for professional e-commerce appearance
       * - Follows Tailwind's semantic naming (50 = lightest, 900 = darkest)
       * - Provides multiple shades for different UI states and contexts
       * 
       * 🛠️ USAGE EXAMPLES:
       * - bg-primary-50:   Light backgrounds, subtle accents
       * - bg-primary-500:  Primary buttons, main brand elements
       * - bg-primary-600:  Hover states for primary elements
       * - bg-primary-700:  Active states, pressed buttons
       * 
       * 💡 DESIGN DECISIONS:
       * - Blue conveys trust and professionalism (ideal for e-commerce)
       * - Limited palette ensures consistency and prevents color chaos
       * - Semantic naming makes it easy for developers to choose appropriate shades
       */
      colors: {
        primary: {
           50: '#eff6ff',  // Very light blue - backgrounds, subtle accents
          500: '#3b82f6',  // Main brand blue - primary buttons, links
          600: '#2563eb',  // Medium blue - hover states, secondary elements
          700: '#1d4ed8',  // Dark blue - active states, pressed elements
        }
      }
    },
  },

  /**
   * Plugins Configuration - Extended Functionality
   * 
   * Currently empty but ready for future extensions. Common plugins include:
   * 
   * 🔌 POTENTIAL FUTURE PLUGINS:
   * - @tailwindcss/forms: Enhanced form styling
   * - @tailwindcss/typography: Rich text content styling
   * - @tailwindcss/aspect-ratio: Consistent aspect ratios
   * - @tailwindcss/line-clamp: Text truncation utilities
   * 
   * 📝 PLUGIN BENEFITS:
   * - Adds specialized utility classes
   * - Maintains consistent design patterns
   * - Reduces custom CSS requirements
   * - Integrates seamlessly with existing utilities
   */
  plugins: [],
}

