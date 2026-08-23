'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Sun, Moon, Search, Menu, X, Flame } from 'lucide-react';

export const Header = () => {
  const { siteSettings, theme, toggleTheme, currentPage, navigate, searchQuery, setSearchQuery, setSortBy } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleNav = (page, params = {}) => {
    navigate(page, params);
    setMobileMenuOpen(false);
  };

  const handleTopUsedClick = () => {
    setSortBy('copies');
    handleNav('prompts');
  };

  return (
    <header className="glass-nav">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          
          {/* Logo & Configurable Brand Name */}
          <div
            onClick={() => handleNav('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--gradient-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
              }}
            >
              <Sparkles size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
                {siteSettings.siteName}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {siteSettings.siteSubtitle}
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', mdDisplay: 'flex', gap: '6px', alignItems: 'center' }} className="desktop-nav">
            <button
              onClick={() => handleNav('home')}
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => handleNav('prompts')}
              className={`nav-link ${currentPage === 'prompts' ? 'active' : ''}`}
            >
              البرومبتات
            </button>
            <button
              onClick={() => handleNav('categories')}
              className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`}
            >
              التصنيفات
            </button>
            <button
              onClick={handleTopUsedClick}
              className="nav-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Flame size={15} color="#F59E0B" />
              الأكثر استخداماً
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else handleNav('home');
              }}
              className="nav-link"
            >
              عن المنصة
            </button>
          </nav>

          {/* Actions & Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Quick Header Search Input */}
            <div style={{ position: 'relative', display: 'none', lgDisplay: 'block' }} className="desktop-search">
              <input
                type="text"
                placeholder="ابحث عن برومبت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNav('prompts');
                }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '7px 34px 7px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  width: searchFocused ? '210px' : '160px',
                  transition: 'width 0.3s ease, border-color 0.3s ease',
                  outline: 'none'
                }}
              />
              <Search
                size={15}
                color="var(--text-secondary)"
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={theme === 'dark' ? 'التفعيل إلى الوضع الفاتح' : 'التفعيل إلى الوضع الداكن'}
              style={{ width: '38px', height: '38px' }}
            >
              {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
            </button>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon mobile-menu-btn"
              style={{ display: 'inline-flex', width: '38px', height: '38px' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div
            className="animate-fade-in"
            style={{
              padding: '1rem 0 1.25rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ position: 'relative', marginBottom: '4px' }}>
              <input
                type="text"
                placeholder="ابحث عن برومبت..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNav('prompts');
                }}
                style={{
                  width: '100%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '10px 38px 10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.9rem'
                }}
              />
              <Search
                size={18}
                color="var(--text-secondary)"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            
            <button onClick={() => handleNav('home')} className="mobile-nav-item">الرئيسية</button>
            <button onClick={() => handleNav('prompts')} className="mobile-nav-item">البرومبتات</button>
            <button onClick={() => handleNav('categories')} className="mobile-nav-item">التصنيفات</button>
            <button onClick={handleTopUsedClick} className="mobile-nav-item">الأكثر استخداماً 🔥</button>
          </div>
        )}
      </div>

      <style>{`
        .nav-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-arabic);
          font-weight: 600;
          font-size: 0.92rem;
          padding: 8px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(139, 92, 246, 0.1);
        }
        .mobile-nav-item {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: var(--font-arabic);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: right;
          cursor: pointer;
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (min-width: 1024px) {
          .desktop-search { display: block !important; }
        }
      `}</style>
    </header>
  );
};
