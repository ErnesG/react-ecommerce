export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    }
}

export interface CartItem extends Product {
    quantity: number;
}

export interface CartState {
    items: CartItem[];
    total: number;
    isOpen: boolean;
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    categories: string[];
    selectedCategory: string;
}