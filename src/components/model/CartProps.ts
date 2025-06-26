import type { CartItem } from "../../types";

export interface CartProps {
  items: CartItem[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}