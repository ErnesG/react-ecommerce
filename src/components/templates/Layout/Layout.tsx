/**
 * @fileoverview Main layout template component for the application
 * Provides a flexible, responsive layout structure with header, sidebar, main content, and footer areas
 * Uses Tailwind CSS for styling and React.memo for performance optimization
 */

import { memo } from "react";
import type { LayoutProps } from "../../model/LayoutProps";

/**
 * Main application layout component that provides a flexible structure for page content
 * 
 * This component creates a responsive layout with the following features:
 * - Full-height layout with flexbox structure
 * - Optional header section that stays at the top
 * - Optional sidebar that's hidden on mobile and shown on desktop (lg breakpoint)
 * - Main content area with responsive padding and max-width constraints
 * - Optional footer section that stays at the bottom
 * - Sticky sidebar positioning for better UX on long pages
 * 
 * The component is memoized for performance optimization to prevent unnecessary re-renders
 * when parent components update but props remain the same.
 * 
 * ## Advantages of using React.memo for Layout Components:
 * 
 * 1. **High-Level Component Optimization**: Layout components are typically high in the component tree
 *    and act as containers for many child components. Preventing unnecessary re-renders at this level
 *    can have cascading performance benefits throughout the entire component subtree.
 * 
 * 2. **Stable Structure**: Layout components rarely change their internal structure or styling.
 *    The main variations are usually in the content (children, header, footer, sidebar) rather than
 *    the layout logic itself, making them ideal candidates for memoization.
 * 
 * 3. **Frequent Parent Updates**: Parent components (like App or page components) often update
 *    frequently due to state changes, route changes, or data fetching. Without memoization,
 *    the Layout would re-render on every parent update, even when its props haven't changed.
 * 
 * 4. **Children Prop Stability**: When used with stable references for header, footer, and sidebar
 *    (e.g., components that don't recreate on every render), memo prevents re-renders when only
 *    the main content (children) changes, and vice versa.
 * 
 * 5. **CSS Class Optimization**: The className prop is often static or changes infrequently.
 *    Memo ensures the Layout doesn't re-render when other unrelated props in parent components change.
 * 
 * 6. **Performance in Large Applications**: In complex applications with many nested components,
 *    layout re-renders can be expensive. Memoization at the layout level prevents unnecessary
 *    re-computation of the entire layout structure and its associated DOM operations.
 * 
 * ## When memo is most effective for this component:
 * - When header, sidebar, and footer components are stable references
 * - When className prop doesn't change frequently
 * - When parent components have frequent state updates unrelated to layout
 * - In applications with deep component trees beneath the layout
 * 
 * @component
 * @param {LayoutProps} props - The component props
 * @param {React.ReactNode} [props.children] - Main content to be rendered in the center area
 * @param {React.ReactNode} [props.header] - Header content (navigation, logo, etc.)
 * @param {React.ReactNode} [props.footer] - Footer content (links, copyright, etc.)
 * @param {React.ReactNode} [props.sidebar] - Sidebar content (navigation, filters, etc.)
 * @param {string} [props.className=""] - Additional CSS classes to apply to the root container
 * 
 * @returns {JSX.Element} The rendered layout component
 * 
 * @example
 * ```tsx
 * // Basic layout with header and main content
 * <Layout 
 *   header={<Header />}
 *   className="custom-layout"
 * >
 *   <div>Main page content goes here</div>
 * </Layout>
 * ```
 * 
 * @example
 * ```tsx
 * // Full layout with all sections
 * <Layout
 *   header={<Header />}
 *   sidebar={<Sidebar />}
 *   footer={<Footer />}
 *   className="home-layout"
 * >
 *   <ProductGrid products={products} />
 * </Layout>
 * ```
 * 
 * @example
 * ```tsx
 * // Layout with just main content (minimal layout)
 * <Layout>
 *   <LoginForm />
 * </Layout>
 * ```
 */
export const Layout = memo<LayoutProps>(
  ({ children, header, footer, sidebar, className = "" }) => {
    return (
      <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
        {/* Header section - rendered at the top if provided */}
        {header && <header className="flex-shrink-0">{header}</header>}
        
        {/* Main container with sidebar */}
        <div className="flex-1 flex">
          {/* Sidebar - hidden on mobile (lg:block), sticky positioned */}
          {sidebar && (
            <aside className="flex-shrink-0 w-64 bg-white shadow-sm hidden lg:block">
              <div className="sticky top-16 h-screen overflow-y-auto">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
        
        {/* Main content area with responsive padding and max-width */}
        {children && (
          <main className="flex-1 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        )}
        
        {/* Footer section - rendered at the bottom if provided */}
        {footer && (
          <footer className="flex-shrink-0 bg-white border-t border-gray-200">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);

/**
 * Display name for React DevTools debugging
 */
Layout.displayName = "Layout";
