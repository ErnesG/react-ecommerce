/**
 * @fileoverview Main Application Component
 * 
 * This is the root component of the React E-commerce application that serves as the 
 * entry point for the entire application. It sets up the global state management
 * and renders the main application content.
 * 
 * @author Senior React Developer
 * @version 1.0.0
 */

import { Provider } from "react-redux";
import { store } from "./store";
import { Home } from "./pages/Home/Home";

/**
 * App Component - Root Application Component
 * 
 * We provide  Redux store context to the entire application at the App.tsx file.
 * As you will across the codebase, single responsabilty pattern is enforced here too.
 *  
 * Architecture Decisions:
 * - Uses Redux Provider to make store available to all child components
 * - Currently renders Home page directly (can be extended with React Router), but that will be done in the future.
 * - Keeps the root component minimal and focused on core application setup
 * 
 * Future Extensibility:
 * - Can be extended to include React Router for multi-page navigation, but that will be done in the future.
 * - Can add global error boundaries for application-level error handling, but that will be done in the future.
 * - Can include theme providers, authentication context, or other global providers, but that will be done in the future.
 * - Can add application-level loading states or initialization logic, but that will be done in the future.
 * 
 * @returns {JSX.Element} The root application component wrapped with Redux Provider
 */
function App() {
  return (
    // Redux Provider makes the store available to all child components
    // This enables any component in the tree to access and modify global state
    <Provider store={store}>
      {/* 
        Home component serves as the main page of the application
        In a multi-page application, this could be replaced with a Router
        and route-based component rendering
      */}
      <Home />
    </Provider>
  );
}

// Export as default for clean imports in main.tsx
export default App;
