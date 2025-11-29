import React from 'react';

function SocialLinks() {
  const socialLinks = [
    { 
      url: 'https://www.instagram.com/pratik.girii?igsh=YmQ5ODk3c2Z6aTFt', 
      ariaLabel: 'instagram', 
      icon: 'fab fa-instagram' 
    },
    { 
      url: 'https://github.com/the-ripper77', 
      ariaLabel: 'github', 
      icon: 'fab fa-github' 
    },
    { 
      url: 'mailto:prateek.giirii@gmail.com', 
      ariaLabel: 'email', 
      icon: 'fas fa-envelope' 
    },
    { 
      url: 'https://www.facebook.com/share/15Ctwfs3bq/', 
      ariaLabel: 'facebook', 
      icon: 'fab fa-facebook' 
    }
  ];

  return (
    <div className="sidebar-bottom">
      {socialLinks.map((link, index) => (
        <a 
          key={index}
          href={link.url} 
          aria-label={link.ariaLabel} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i className={link.icon}></i>
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;


