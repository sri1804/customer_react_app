// Header.js
import React from 'react';
import './Header.css'; 

const Header = ({ title }) => {
  return (
    <header className="header-container">
      <h1 className="header-title">{title}</h1>
      <div className="header-line"></div>
    </header>
  );
};

export default Header;
