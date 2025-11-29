import React from 'react';

function ProfileSection() {
  return (
    <header className="profile-wrapper">
      <a href="#" id="avatar">
        <img 
          src="/src/assets/ProfileDP.jpg" 
          width="120" 
          height="150" 
          alt="avatar" 
          onError={(e) => e.target.style.display = 'none'}
        />
      </a>
      <h1 className="site-title">Pratik Giri</h1>
      <p className="site-subtitle">I may not believe in myself, but I believe in what I'm doing</p>
    </header>
  );
}

export default ProfileSection;


