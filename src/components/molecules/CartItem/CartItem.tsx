import { memo, useCallback, useMemo } from "react";
import type { CartItemProps } from "../../model/CartItemProps";
import { Button } from "../../atoms/Button/Button";

export const CartItem = memo<CartItemProps>(
  ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
    const handleQuantityChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = parseInt(e.target.value, 10);
        onUpdateQuantity(item.id, newQuantity);
      },
      [item.id, onUpdateQuantity]
    );
    const handleRemove = useCallback(() => {
      onRemove(item.id);
    }, [item.id, onRemove]);

    const totalPrice = useMemo(
      () =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(item.price * item.quantity),
      [item.price, item.quantity]
    );

    const quantityOptions = useMemo(
      () => Array.from({ length: 10 }, (_, i) => i + 1),
      []
    );

    return (
      <div className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-contain rounded-lg bg-gray-100 p-2"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
            {item.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">${item.price} each</p>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor={`quantity-${item.id}`} className="sr-only">
            Quantity
          </label>
          <select
            id={`quantity-${item.id}`}
            value={item.quantity}
            onChange={handleQuantityChange}
            className="block w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {quantityOptions.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm font-medium text-gray-900 min-w-[80px] text-right">
          {totalPrice}
        </div>

        <Button
          onClick={handleRemove}
          variant="danger"
          size="sm"
          aria-label={`Remove ${item.title} from cart`}
        >
          Remove
        </Button>
      </div>
    );
  }
);
CartItem.displayName = "CartItem";
