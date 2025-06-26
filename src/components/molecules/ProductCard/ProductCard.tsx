import { memo, useCallback, useMemo } from "react";
import { Badge } from "../../atoms/Badge/Badge";
import { Button } from "../../atoms/Button/Button";
import type { ProductCardProps } from "../../model/ProductCardProps";

export const ProductCard = memo<ProductCardProps>(
  ({ product, onAddToCart, isInCart = false, isLoading = false }) => {
    const handleAddToCart = useCallback(() => {
      if (!isLoading) {
        onAddToCart(product);
      }
    }, [onAddToCart, product, isLoading]);

    const formattedPrice = useMemo(
      () =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price),
      [product.price]
    );

    const ratingDisplay = useMemo(
      () => ({
        stars:
          "★".repeat(Math.floor(product.rating.rate)) +
          "☆".repeat(5 - Math.floor(product.rating.rate)),
        text: `${product.rating.rate} (${product.rating.count} reviews)`,
      }),
      [product.rating]
    );

    const categoryBadgeVariant = useMemo(() => {
      const variants: Record<
        string,
        "default" | "success" | "warning" | "error" | "info"
      > = {
        "men's clothing": "info",
        "women's clothing": "success",
        jewelery: "warning",
        electronics: "error",
      };
      return variants[product.category] || "default";
    }, [product.category]);

    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-square bg-gray-100 flex items-center justify-center group">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <Badge
            variant={categoryBadgeVariant}
            size="sm"
            className="absolute top-2 left-2 capitalize"
          >
            {product.category}
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary-600 transition-colors">
            {product.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary-600">
              {formattedPrice}
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-sm">
                {ratingDisplay.stars}
              </span>
              <span className="text-xs text-gray-500">
                {ratingDisplay.text}
              </span>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full"
            variant={isInCart ? "secondary" : "primary"}
          >
            {isLoading
              ? "Adding..."
              : isInCart
              ? "Added to Cart"
              : "Add to Cart"}
          </Button>
        </div>
      </article>
    );
  }
);

ProductCard.displayName = "ProductCard";
