import React, { useRef, useEffect } from 'react';

function SearchBar({ searchValue, setSearchValue, isSearchOpen, setIsSearchOpen }) {
  const searchRef = useRef(null);

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

  const handleRemoveSearchItem = (e) => {
    e.stopPropagation();
    const searchItem = e.target.closest('.search-item');
    searchItem.style.opacity = '0';
    setTimeout(() => {
      searchItem.remove();
    }, 200);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const handleSearchItemClick = (name, e) => {
    if (!e.target.closest('.search-item-remove')) {
      setSearchValue(name);
      setIsSearchOpen(false);
    }
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
            placeholder="Search" 
            className="search-input" 
            id="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        
        <div 
          className={`search-dropdown ${isSearchOpen ? 'show' : ''}`} 
          id="search-dropdown"
        >
          <div className="search-section">
            <h4 className="search-section-title">Recent</h4>
            {recentSearches.map((item, index) => (
              <div 
                key={index}
                className="search-item"
                onClick={(e) => handleSearchItemClick(item.name, e)}
              >
                <img src={item.img} alt="Recent search" className="search-item-img" />
                <div className="search-item-info">
                  <span className="search-item-name">{item.name}</span>
                  <span className="search-item-type">{item.type}</span>
                </div>
                <button 
                  className="search-item-remove"
                  onClick={handleRemoveSearchItem}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
          
          <div className="search-section">
            <h4 className="search-section-title">Suggested</h4>
            {suggestedSearches.map((item, index) => (
              <div 
                key={index}
                className="search-item"
                onClick={(e) => handleSearchItemClick(item.name, e)}
              >
                <img src={item.img} alt="Suggested" className="search-item-img" />
                <div className="search-item-info">
                  <span className="search-item-name">{item.name}</span>
                  <span className="search-item-type">{item.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

