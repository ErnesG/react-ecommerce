import type { Product } from "../../types";

export interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  cartItems: number[];
  searchQuery?: string;
}