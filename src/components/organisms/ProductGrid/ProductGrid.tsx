import { memo, useMemo, useCallback } from "react";
import { ProductCard } from "../../molecules/ProductCard/ProductCard";
import type { ProductGridProps } from "../../model/ProductGridProps";

const ProductSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  </div>
));
export const ProductGrid = memo<ProductGridProps>(
  ({ products, loading, onAddToCart, cartItems = [], searchQuery = "" }) => {
    const filteredProducts = useMemo(() => {
      if (!searchQuery.trim()) return products;

      const query = searchQuery.toLowerCase();
      return products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }, [products, searchQuery]);

    const isProductInCart = useCallback(
      (productId: number) => cartItems.includes(productId),
      [cartItems]
    );

    const productCards = useMemo(
      () =>
        filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isInCart={isProductInCart(product.id)}
          />
        )),
      [filteredProducts, onAddToCart, isProductInCart]
    );

    const skeletonCards = useMemo(
      () =>
        Array.from({ length: 8 }, (_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        )),
      []
    );

    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonCards}
        </div>
      );
    }

    if (filteredProducts.length === 0 && searchQuery) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            No products match your search for "{searchQuery}". Try different
            keywords.
          </p>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products available
          </h3>
          <p className="text-gray-600">Check back later for new products.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productCards}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";
