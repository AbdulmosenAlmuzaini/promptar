'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const AdminLogin = () => {
  const { siteSettings, loginAdmin, navigate } = useApp();
  const [email, setEmail] = useState('admin@prompt.local');
  const [password, setPassword] = useState('Admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAdmin(email, password);
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@prompt.local');
    setPassword('Admin123');
    loginAdmin('admin@prompt.local', 'Admin123');
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem'
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-card), var(--shadow-glow)'
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            لوحة تحكم المنصة
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            أدخل بيانات الاعتماد للوصول إلى منطقة إدارة المحتوى
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                style={{ paddingRight: '38px', direction: 'ltr', textAlign: 'right' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                style={{ paddingRight: '38px', direction: 'ltr', textAlign: 'right' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '11px 20px', marginTop: '0.5rem' }}>
            تسجيل الدخول
          </button>
        </form>

        {/* Quick Demo Login Preset Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            بيانات الدخول التجريبية للعرض: <code style={{ color: 'var(--accent-purple)' }}>admin@prompt.local</code> / <code style={{ color: 'var(--accent-purple)' }}>Admin123</code>
          </div>

          <button
            onClick={handleQuickDemoLogin}
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.88rem', padding: '9px 16px' }}
          >
            <Sparkles size={16} color="var(--accent-purple)" />
            دخول سريع بنقرة واحدة (تجريبي)
          </button>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            العودة للموقع الرئيسي
          </button>
        </div>

      </div>
    </div>
  );
};
