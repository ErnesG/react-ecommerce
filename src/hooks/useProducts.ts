import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";

export const useProducts = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {products, loading, error, categories, selectedCategory} = useSelector(
        (state: RootState) => state.products
    );
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);
    useEffect(()=>{
        dispatch(fetchProducts(selectedCategory || undefined));
    }, [dispatch, selectedCategory]);
    return {
        products,
        loading,
        error,
        categories,
        selectedCategory,
    };
};
