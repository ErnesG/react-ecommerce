import type { CartItem } from "../../types";

export interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}