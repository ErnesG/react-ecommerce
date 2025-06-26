import { memo, useCallback, useMemo } from "react";
import { Button } from "../../atoms/Button/Button";
import { Badge } from "../../atoms/Badge/Badge";
import { SearchBar } from "../../molecules/SearchBar/SearchBar";
import type { HeaderProps } from "../../model/HeaderProps";

export const Header = memo<HeaderProps>(
  ({
    cartItemCount,
    onCartToggle,
    onSearch,
    categories,
    selectedCategory,
    onCategoryChange,
  }) => {
    const handleCategoryClick = useCallback(
      (category: string) => {
        onCategoryChange(category === selectedCategory ? "" : category);
      },
      [onCategoryChange, selectedCategory]
    );

    const formattedCategories = useMemo(
      () =>
        categories.map((category) => ({
          id: category,
          name:
            category.charAt(0).toUpperCase() +
            category.slice(1).replace(/'/g, "'"),
          isSelected: category === selectedCategory,
        })),
      [categories, selectedCategory]
    );

    return (
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                E-Store
              </h1>
              <nav className="hidden md:flex space-x-1">
                <Button
                  variant={selectedCategory === "" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => onCategoryChange("")}
                >
                  All
                </Button>
                {formattedCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={category.isSelected ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="capitalize"
                  >
                    {category.name}
                  </Button>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block w-64">
                <SearchBar
                  onSearch={onSearch}
                  placeholder="Search Products..."
                  className="w-full"
                />
              </div>
              <Button
                variant="secondary"
                onClick={onCartToggle}
                className="relative"
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <span className="mr-2">🛒</span>
                Cart
                {cartItemCount > 0 && (
                  <Badge
                    variant="error"
                    size="sm"
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          {/* Mobile search bar */}
          <div className="sm:hidden pb-4">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search products..."
              className="w-full"
            />
          </div>
          {/* Mobile category filter */}

          <div className="md:hidden pb-4">
            <div className="flex space-x-2 overflow-x-auto">
              <Button
                variant={selectedCategory === "" ? "primary" : "secondary"}
                size="sm"
                onClick={() => onCategoryChange("")}
                className="whitespace-nowrap"
              >
                All
              </Button>
              {formattedCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={category.isSelected ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="capitalize whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }
);
