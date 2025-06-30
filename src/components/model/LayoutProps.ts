/**
 * @fileoverview LayoutProps - Type definitions for Layout component properties
 * 
 * Defines the props interface for flexible layout composition with optional
 * header, footer, sidebar sections and custom styling support.
 */

import type React from "react";

/**
 * Props interface for the Layout component
 * 
 * @performance Key Performance Benefits
 * - React.memo optimization for high-level layout stability
 * - Optional sections prevent unnecessary DOM rendering
 * - Flexible composition reduces prop drilling complexity
 * - className prop supports memoized styling patterns
 * 
 * @example Basic Layout Usage
 * ```tsx
 * <Layout 
 *   header={<Header />}
 *   sidebar={<Sidebar />}
 *   footer={<Footer />}
 *   className="min-h-screen"
 * >
 *   <main>
 *     <ProductGrid />
 *   </main>
 * </Layout>
 * ```
 * 
 * @example Conditional Layout Sections
 * ```tsx
 * <Layout 
 *   header={<Header />}
 *   sidebar={showSidebar ? <Sidebar /> : undefined}
 *   className={cn("layout-container", customClass)}
 * >
 *   {children}
 * </Layout>
 * ```
 * 
 * @interface LayoutProps
 */
export interface LayoutProps {
    /** 
     * Main content to be rendered within the layout
     * @example <ProductGrid />, <CartPage />, page components
     */
    children: React.ReactNode;
    
    /** 
     * Optional header section (navigation, branding)
     * @performance Conditionally rendered, supports React.memo optimization
     */
    header?: React.ReactNode;
    
    /** 
     * Optional footer section (links, copyright, info)
     * @performance Only renders when provided, reduces DOM overhead
     */
    footer?: React.ReactNode;
    
    /** 
     * Optional sidebar section (filters, navigation, ads)
     * @performance Conditional rendering for responsive layouts
     */
    sidebar?: React.ReactNode;
    
    /** 
     * Optional CSS classes for layout container styling
     * @performance Supports memoized className generation
     */
    className?: string;
}