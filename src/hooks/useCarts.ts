import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } from "../store/slices/cartSlice";

import type { Product } from "../types";

export const useCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {items, total, isOpen} = useSelector(
        (state: RootState)=> state.cart
    );
    const handleAddToCart = useCallback((product: Product) => {
        dispatch(addToCart(product))
    }, [dispatch]);

    const handleRemoveFromCart = useCallback((id: number) => {
        dispatch(removeFromCart(id))
    }, [dispatch]);

    const handleUpdateQuantity = useCallback((id:number, quantity: number)=>{
        dispatch(updateQuantity({id, quantity}))
    }, [dispatch]);
    const handleToggleCart = useCallback(()=>{
        dispatch(toggleCart());
    }, [dispatch]);
    const handleClearCart = useCallback(()=> {
        dispatch(clearCart());
    }, [dispatch]);
    return {
        items,
        total,
        isOpen,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateQuantity: handleUpdateQuantity,
        toggleCart: handleToggleCart,
        clearCart: handleClearCart
    };
};