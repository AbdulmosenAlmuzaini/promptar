'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KeyRound, ArrowRight, Shield, PhoneCall } from 'lucide-react';

export const AdminLogin = () => {
  const { loginAdmin, navigate } = useApp();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setIsSubmitting(true);
    await loginAdmin('admin@prompt.local', password);
    setIsSubmitting(false);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem'
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '3rem 2.25rem 2.25rem',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.08)',
          backdropFilter: 'blur(16px)'
        }}
      >
        {/* Top Header & Icon */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 20px rgba(139, 92, 246, 0.15)'
            }}
          >
            <Shield size={30} />
          </div>

          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}
          >
            لوحة تحكم المنصة
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              maxWidth: '320px',
              margin: '0 auto'
            }}
          >
            أدخل رمز الدخول للوصول إلى منطقة الإدارة والتحكم بالمحتوى.
          </p>
        </div>

        {/* Single Password Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              className="form-label"
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              رمز الدخول
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{
                  paddingRight: '42px',
                  height: '48px',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-primary)'
                }}
                placeholder="أدخل رمز الدخول"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              <KeyRound
                size={18}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '14px',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginTop: '0.5rem',
              cursor: isSubmitting ? 'wait' : 'pointer'
            }}
          >
            {isSubmitting ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>

        {/* Back to main site link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-purple)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowRight size={16} />
            العودة إلى الموقع الرئيسي
          </button>
        </div>

        {/* Bottom Support & Contact Section */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            marginTop: '2rem',
            paddingTop: '1.25rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.85rem'
            }}
          >
            <PhoneCall size={14} color="var(--accent-purple)" />
            <span>للدعم والاستفسار:</span>
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text-primary)',
                fontWeight: 700,
                direction: 'ltr',
                unicodeBidi: 'embed',
                textDecoration: 'none'
              }}
            >
              +966 50 000 0000
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
