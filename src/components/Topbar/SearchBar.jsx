import React, { useRef, useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';

function SearchBar({ searchValue, setSearchValue, isSearchOpen, setIsSearchOpen }) {
  const searchRef = useRef(null);
  const {
    searchResults,
    recentSearches,
    suggestedSearches,
    isSearching,
    hasResults,
    showRecent,
    showResults,
    handleSearchSelect,
    handleRemoveRecent
  } = useSearch(searchValue);

  // Handle clicks outside search
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setIsSearchOpen]);

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchValue('');
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      // Navigate to first result on Enter
      handleSearchSelect(searchResults[0]);
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim().length > 0) {
      setIsSearchOpen(true);
    }
  };

  const handleResultClick = (result, e) => {
    if (!e.target.closest('.search-item-remove')) {
      handleSearchSelect(result);
      setSearchValue('');
      setIsSearchOpen(false);
    }
  };

  const handleRemoveRecentItem = (e, timestamp) => {
    e.stopPropagation();
    handleRemoveRecent(timestamp);
  };

  return (
    <div 
      id="search" 
      role="search" 
      aria-label="site search"
      ref={searchRef}
    >
      <div className="search-container">
        <div className="search-input-wrapper">
          <i className="fas fa-search fa-fw search-icon"></i>
          <input 
            type="search" 
            aria-label="Search site" 
            autoComplete="off" 
            placeholder="Search..." 
            className="search-input" 
            id="search-input"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
          />
          {isSearching && (
            <i className="fas fa-spinner fa-spin" style={{ marginLeft: '8px', color: '#8e8e93' }}></i>
          )}
        </div>
        
        {isSearchOpen && (
          <div 
            className={`search-dropdown ${isSearchOpen ? 'show' : ''}`} 
            id="search-dropdown"
          >
            {/* Search Results */}
            {showResults && (
              <div className="search-section">
                <h4 className="search-section-title">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
                </h4>
                {searchResults.map((result) => (
                  <div 
                    key={result.id}
                    className="search-item search-item-text-only"
                    onClick={(e) => handleResultClick(result, e)}
                  >
                    <div className="search-item-info">
                      <span className="search-item-name">{result.title}</span>
                      <span className="search-item-type">
                        {result.type} {result.category ? `· ${result.category}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results Message */}
            {searchValue && searchValue.trim().length > 0 && !isSearching && !hasResults && (
              <div className="search-section">
                <div className="search-item search-item-text-only" style={{ cursor: 'default', padding: '20px', textAlign: 'center' }}>
                  <div className="search-item-info" style={{ width: '100%' }}>
                    <span className="search-item-name" style={{ color: '#8e8e93' }}>
                      No results found for "{searchValue}"
                    </span>
                    <span className="search-item-type" style={{ marginTop: '4px', display: 'block' }}>
                      Try different keywords
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <div className="search-section">
                <h4 className="search-section-title">Recent</h4>
                {recentSearches.map((item) => (
                  <div 
                    key={item.timestamp}
                    className="search-item search-item-text-only"
                    onClick={(e) => {
                      if (!e.target.closest('.search-item-remove')) {
                        setSearchValue(item.query);
                        setIsSearchOpen(false);
                        // Navigate to the item
                        if (item.href) {
                          const element = document.querySelector(item.href);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }
                    }}
                  >
                    <div className="search-item-info">
                      <span className="search-item-name">{item.title}</span>
                      <span className="search-item-type">{item.type}</span>
                    </div>
                    <button 
                      className="search-item-remove"
                      onClick={(e) => handleRemoveRecentItem(e, item.timestamp)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Suggested Searches */}
            {showRecent && suggestedSearches.length > 0 && (
              <div className="search-section">
                <h4 className="search-section-title">Suggested</h4>
                {suggestedSearches.map((item) => (
                  <div 
                    key={item.id}
                    className="search-item search-item-text-only"
                    onClick={(e) => {
                      setSearchValue(item.title);
                      if (item.href) {
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                  >
                    <div className="search-item-info">
                      <span className="search-item-name">{item.title}</span>
                      <span className="search-item-type">{item.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {showRecent && recentSearches.length === 0 && suggestedSearches.length === 0 && (
              <div className="search-section">
                <div className="search-item search-item-text-only" style={{ cursor: 'default', padding: '20px', textAlign: 'center' }}>
                  <div className="search-item-info" style={{ width: '100%' }}>
                    <span className="search-item-name" style={{ color: '#8e8e93' }}>
                      Start typing to search...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
