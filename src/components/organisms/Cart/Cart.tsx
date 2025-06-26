import { memo, useCallback, useMemo } from "react";
import { Button } from "../../atoms/Button/Button";
import { CartItem } from "../../molecules/CartItem/CartItem";
import type { CartProps } from "../../model/CartProps";

export const Cart = memo<CartProps>(
  ({
    items,
    total,
    isOpen,
    onClose,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
  }) => {
    const formattedTotal = useMemo(
      () =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(total),
      [total]
    );

    const itemCount = useMemo(
      () => items.reduce((sum, item) => sum + item.quantity, 0),
      [items]
    );

    const handleCheckout = useCallback(() => {
      alert(
        `Checkout functionality would be implemented here. Total: ${formattedTotal}`
      );
      onClearCart();
      onClose();
    }, [formattedTotal, onClearCart, onClose]);

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Cart Sidebar */}
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                aria-label="Close cart"
              >
                ✕
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formattedTotal}</span>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Checkout
                  </Button>
                  <Button
                    onClick={onClearCart}
                    variant="secondary"
                    className="w-full"
                    size="sm"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

Cart.displayName = "Cart";
