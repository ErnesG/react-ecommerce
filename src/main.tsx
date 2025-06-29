/**
 * @fileoverview Application Entry Point and Bootstrap
 * 
 * This file serves as the main entry point for the React application, responsible for
 * mounting the root component to the DOM and configuring the React runtime environment.
 * It includes critical development tooling setup through React StrictMode.
 * 
 * @author Senior React Developer
 * @version 1.0.0
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * Application Bootstrap and DOM Mounting
 * 
 * This section handles the critical process of mounting our React application to the DOM.
 * The implementation uses React 18's new createRoot API for better performance and
 * concurrent features support.
 */

// Get the root DOM element where our React app will be mounted
// The non-null assertion (!) is safe here because we control the HTML template
const rootElement = document.getElementById('root')!

/**
 * Create React Root and Render Application
 * 
 * React 18's createRoot API provides:
 * - Better performance through concurrent rendering
 * - Automatic batching of state updates
 * - Support for Suspense and concurrent features
 * - Improved hydration for SSR applications
 */
createRoot(rootElement).render(
  /**
   * React StrictMode Wrapper
   * 
   * StrictMode is a development-only tool that helps identify potential problems
   * in an application. It's one of the most important development tools for
   * maintaining code quality and future React compatibility.
   * 
   * 🔍 CRITICAL IMPORTANCE OF STRICTMODE:
   * 
   * 1. **Double-Execution Detection**:
   *    - Intentionally double-invokes functions like useState, useMemo, useEffect
   *    - Helps identify side effects that should be pure
   *    - Catches bugs that might only appear in production due to React's optimizations
   * 
   * 2. **Deprecated API Detection**:
   *    - Warns about usage of deprecated lifecycle methods
   *    - Identifies unsafe legacy patterns that will break in future React versions
   *    - Helps with gradual migration to modern React patterns
   * 
   * 3. **Memory Leak Prevention**:
   *    - Helps identify missing cleanup in useEffect hooks
   *    - Warns about potential memory leaks from subscriptions, timers, etc.
   *    - Ensures proper component cleanup patterns
   * 
   * 4. **Future React Compatibility**:
   *    - Prepares code for React's concurrent features
   *    - Ensures components work correctly with React's internal optimizations
   *    - Validates that components can handle being unmounted/remounted
   * 
   * 5. **Development Best Practices**:
   *    - Encourages writing resilient, side-effect-free code
   *    - Promotes proper state management patterns
   *    - Helps maintain consistent component behavior
   * 
   * 📝 NOTE: StrictMode only runs in development mode and is automatically
   * stripped out in production builds, so there's no performance impact on
   * end users.
   * 
   * 🚨 NEVER REMOVE StrictMode to "fix" double-execution issues - instead,
   * fix the underlying code to be side-effect free and idempotent.
   */
  <StrictMode>
    {/* 
      Main Application Component
      Contains the entire application tree with Redux Provider,
      routing (future), and all UI components
    */}
    <App />
  </StrictMode>,
)
