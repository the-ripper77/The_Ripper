import React from 'react';
import ProfileSection from './ProfileSection';
import Navigation from './Navigation';
import SocialLinks from './SocialLinks';

function Sidebar({ isMobile, isSidebarOpen, activeNav, onNavClick, onClose }) {
  const getSidebarClasses = () => {
    let classes = '';
    if (isMobile) {
      classes += isSidebarOpen ? ' sidebar-visible' : ' sidebar-hidden';
    }
    return classes.trim();
  };

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <div 
        id="sidebar-overlay" 
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={onClose}
      ></div>
      
      {/* Sidebar Navigation */}
      <aside 
        aria-label="Sidebar" 
        id="sidebar"
        className={getSidebarClasses()}
      >
        <ProfileSection />
        
        <button 
          type="button" 
          id="sidebar-close-btn" 
          aria-label="Close sidebar" 
          className="sidebar-close-btn"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <Navigation activeNav={activeNav} onNavClick={onNavClick} />
        
        <SocialLinks />
      </aside>
    </>
  );
}

export default Sidebar;

