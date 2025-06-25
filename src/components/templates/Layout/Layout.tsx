import { memo } from "react";
import type { LayoutProps } from "../../model/LayoutProps";

export const Layout = memo<LayoutProps>(
  ({ children, header, footer, sidebar, className = "" }) => {
    return (
      <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
        {header && <header className="flex-shrink-0">{header}</header>}
        <div className="flex-1 flex">
          {sidebar && (
            <aside className="flex-shrink-0 w-64 bg-white shadow-sm hidden lg:block">
              <div className="sticky top-16 h-screen overflow-y-auto">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
        {children && (
          <main className="flex-1 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        )}
        {footer && (
          <footer className="flex-shrink-0 bg-white border-t border-gray-200">
            {footer}
          </footer>
        )}
      </div>
    );
  }
);
Layout.displayName = "Layout";
