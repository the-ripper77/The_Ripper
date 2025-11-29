import React from 'react';

function ScrollTopButton({ showBackToTop, onScrollToTop }) {
  return (
    <button
      id="back-to-top"
      onClick={onScrollToTop}
      style={{
        display: showBackToTop ? 'block' : 'none',
        opacity: showBackToTop ? '1' : '0'
      }}
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
}


export default ScrollTopButton;


