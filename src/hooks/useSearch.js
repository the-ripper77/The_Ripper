import { useState, useEffect } from 'react';
import { searchContent, getRecentSearches, saveRecentSearch, getSuggestedSearches, removeRecentSearch } from '../utils/searchIndex';
import { getAllSearchableContent } from '../utils/pageContentIndexer';

/**
 * Custom hook for search functionality
 * @param {string} searchValue - External search value from parent
 */
export function useSearch(searchValue = '') {
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestedSearches] = useState(getSuggestedSearches());
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Re-index page content when component mounts or after a delay
  useEffect(() => {
    // Wait for page to fully render before indexing
    const timeoutId = setTimeout(() => {
      getAllSearchableContent(); // Pre-index the content
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Perform search when searchValue changes
  useEffect(() => {
    if (searchValue && searchValue.trim().length > 0) {
      setIsSearching(true);
      // Add small delay for better UX (debounce effect)
      const timeoutId = setTimeout(() => {
        const results = searchContent(searchValue);
        setSearchResults(results);
        setIsSearching(false);
      }, 150);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchValue]);

  // Handle search item selection
  const handleSearchSelect = (result) => {
    if (searchValue) {
      saveRecentSearch(searchValue, result);
      setRecentSearches(getRecentSearches());
    }
    
    // Navigate to the result
    if (result.href) {
      // Handle hash navigation
      if (result.href.startsWith('#')) {
        const element = document.querySelector(result.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.location.href = result.href;
      }
    }
  };

  // Remove a recent search item
  const handleRemoveRecent = (timestamp) => {
    const updated = removeRecentSearch(timestamp);
    setRecentSearches(updated);
  };

  // Check if search has results
  const hasResults = searchResults.length > 0;
  const showRecent = !searchValue || searchValue.trim().length === 0;
  const showResults = searchValue && searchValue.trim().length > 0 && hasResults;

  return {
    searchResults,
    recentSearches,
    suggestedSearches,
    isSearching,
    hasResults,
    showRecent,
    showResults,
    handleSearchSelect,
    handleRemoveRecent
  };
}
