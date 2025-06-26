export interface HeaderProps {
    cartItemCount: number;
    onCartToggle: () => void;
    onSearch: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}