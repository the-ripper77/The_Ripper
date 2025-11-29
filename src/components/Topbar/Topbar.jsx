import React from 'react';
import SearchBar from './SearchBar';

function Topbar({ 
  topbarVisible, 
  onToggleSidebar, 
  searchValue, 
  setSearchValue, 
  isSearchOpen, 
  setIsSearchOpen,
  theme,
  onToggleDarkMode
}) {
  return (
    <header aria-label="Top Bar">
      <div 
        id="topbar"
        style={{ top: topbarVisible ? '0' : '-100px' }}
      >
        <div className="header-left">
          <button 
            type="button" 
            id="sidebar-trigger"
            onClick={onToggleSidebar}
          >
            <i className="fas fa-bars fa-fw"></i>
          </button>
          <div id="topbar-title">The Ripper</div>
        </div>
        
        <div className="header-center">
          <SearchBar 
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
          
          <button 
            type="button" 
            className="dark-mode-toggle-btn" 
            id="dark-mode-toggle-btn" 
            aria-label="Toggle dark mode"
            onClick={onToggleDarkMode}
          >
            <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;


