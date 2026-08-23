'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart } from 'lucide-react';
import { TelegramIcon, XIcon, WhatsAppIcon } from './SocialIcons';

export const Footer = () => {
  const { siteSettings } = useApp();

  return (
    <footer
      style={{
        background: 'var(--bg-glass-heavy)',
        borderTop: '1px solid var(--border-color)',
        padding: '4rem 0 2rem',
        marginTop: '4rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                marginBottom: '1.2rem',
                textDecoration: 'none'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {siteSettings.siteName}
              </div>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {siteSettings.metaDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.1rem', color: 'var(--text-primary)' }}>
              روابط سريعة
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <Link href="/" className="footer-link">الرئيسية</Link>
              </li>
              <li>
                <Link href="/prompts" className="footer-link">مكتبة البرومبتات</Link>
              </li>
              <li>
                <Link href="/categories" className="footer-link">تصنيفات البرومبتات</Link>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.1rem', color: 'var(--text-primary)' }}>
              تواصل ومتابعة
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              انضم إلى قناتنا الرسمية لمتابعة أحدث البرومبتات والتحديثات اليومية:
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={siteSettings.telegramChannelUrl || 'https://t.me/PromptArabic'}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.25)' }}
              >
                <TelegramIcon size={15} />
                Telegram
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                <XIcon size={15} />
                X (Twitter)
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.25)' }}
              >
                <WhatsAppIcon size={15} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            جميع الحقوق محفوظة © {siteSettings.siteName} {new Date().getFullYear()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            تم التطوير بـ <Heart size={14} color="#EC4899" fill="#EC4899" /> لمنصات الذكاء الاصطناعي العربية
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-arabic);
          font-size: 0.88rem;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
          text-align: right;
          text-decoration: none;
          display: inline-block;
        }
        .footer-link:hover {
          color: var(--accent-purple);
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .social-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};
