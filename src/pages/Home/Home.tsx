import { memo, useState, useCallback, useMemo } from "react";
import { Layout } from "../../components/templates/Layout/Layout";
import { Header } from "../../components/organisms/Header/Header";
import { ProductGrid } from "../../components/organisms/ProductGrid/ProductGrid";
import { Cart } from "../../components/organisms/Cart/Cart";
import { useCart } from "../../hooks/useCarts";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../store/slices/productSlice";
import type { AppDispatch } from "../../store";
import { useProducts } from "../../hooks/useProducts";

export const Home = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, categories, selectedCategory } =
    useProducts();
  const {
    items,
    total,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleCart,
    clearCart,
  } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = useCallback(
    (category: string) => {
      dispatch(setSelectedCategory(category));
    },
    [dispatch]
  );
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  const cartItemIds = useMemo(() => items.map((item) => item.id), [items]);
  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 max-w-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      header={
        <Header
          cartItemCount={cartItemCount}
          onCartToggle={toggleCart}
          onSearch={handleSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      }
    >
      <div className="space-y-8">
        {/* Hero Section */}
        {!searchQuery && !selectedCategory && (
          <section className="text-center py-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to E - Store
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices. Shop with
              confidence using our modern, fast, and secure platform built with
              React and TypeScript.
            </p>
          </section>
        )}
        {/* Products Section */}
        <section>
          {searchQuery && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Search results for "{searchQuery}"
              </h3>
              <p className="text-gray-600 mt-1">
                {
                  products.filter(
                    (p) =>
                      p.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      p.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      p.category
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  ).length
                }{" "}
                products found
              </p>
            </div>
          )}

          {selectedCategory && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 capitalize">
                {selectedCategory.replace(/'/g, "'")} Products
              </h3>
              <p className="text-gray-600 mt-1">
                {products.length} products in this category
              </p>
            </div>
          )}

          <ProductGrid
            products={products}
            loading={loading}
            onAddToCart={addToCart}
            cartItems={cartItemIds}
            searchQuery={searchQuery}
          />
        </section>
      </div>
      <Cart
        items={items}
        total={total}
        isOpen={isOpen}
        onClose={toggleCart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </Layout>
  );
});
Home.displayName = "Home";
