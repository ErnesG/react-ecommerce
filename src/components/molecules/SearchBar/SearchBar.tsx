import { useState, useCallback, useMemo } from "react";
import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { useDebounce } from "../../../hooks/useDebounce";
import type { SearchBarProps } from "../../model/SearchBarProps";

export const SearchBar = ({
  onSearch,
  placeholder = "Search products...",
  debounceMs = 300,
  className = "",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query.trim());
    },
    [onSearch, query]
  );
  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
  }, [onSearch]);

  // Trigger search on debounced query change
  useMemo(() => {
    if (debouncedQuery !== query || debouncedQuery.length === 0) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearch, query]);
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pr-10"
        />
      </div>
      {query && (
        <Button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Clear search"
        >
          x
        </Button>
      )}
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
};

SearchBar.displayName = "SearchBar";
