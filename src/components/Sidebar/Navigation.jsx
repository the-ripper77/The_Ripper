import React from 'react';

function Navigation({ activeNav, onNavClick }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fa-home', href: '#home' },
    { id: 'categories', label: 'Categories', icon: 'fa-th-large', href: '#categories' },
    { id: 'archives', label: 'Archives', icon: 'fa-archive', href: '#archives' },
    { id: 'friends', label: 'Friends', icon: 'fa-users', href: '#friends' },
    { id: 'about', label: 'About', icon: 'fa-user', href: '#about' }
  ];

  return (
    <nav>
      <ul className="nav">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a 
              href={item.href} 
              id={`nav-${item.id}`} 
              className={`nav-link ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => onNavClick(item.id)}
            >
              <i className={`fa-fw fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;


