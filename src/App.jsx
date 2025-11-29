import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import ScrollTopButton from './components/ScrollTopButton';
import GlobalStyles from './components/GlobalStyles';

function PersonalBlog() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [topbarVisible, setTopbarVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Check if mobile on resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setIsSidebarOpen(false);
        document.body.classList.remove('sidebar-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // Handle scroll events for topbar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Topbar visibility
      if (window.pageYOffset > 100) {
        setTopbarVisible(true);
      } else {
        setTopbarVisible(false);
      }

      // Back to top button visibility
      if (window.pageYOffset > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sidebar functions
  const toggleSidebar = () => {
    if (isMobile) {
      const newState = !isSidebarOpen;
      setIsSidebarOpen(newState);
      
      if (newState) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
      document.body.classList.remove('sidebar-open');
    }
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    closeSidebar();
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <GlobalStyles />
      
      <Sidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        activeNav={activeNav}
        onNavClick={handleNavClick}
        onClose={closeSidebar}
      />
      
      {/* Main Content */}
      <main 
        aria-label="Main Content"
        className={isMobile && !isSidebarOpen ? 'sidebar-hidden' : ''}
      >
        <div id="main-wrapper">
          <div className="container">
            <Topbar
              topbarVisible={topbarVisible}
              onToggleSidebar={toggleSidebar}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              theme={theme}
              onToggleDarkMode={toggleDarkMode}
            />
            
            {/* Content area - add your page content here */}
            <div className="content">
              {/* Your page content goes here */}
            </div>
          </div>
        </div>
      </main>

      <ScrollTopButton
        showBackToTop={showBackToTop}
        onScrollToTop={scrollToTop}
      />
    </>
  );
}

export default PersonalBlog;
