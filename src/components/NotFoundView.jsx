'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundView = () => {
  const { navigate } = useApp();

  return (
    <div
      className="container animate-fade-in"
      style={{
        padding: '6rem 1.25rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '24px',
          background: 'rgba(139, 92, 246, 0.12)',
          color: 'var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <FileQuestion size={36} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
        الصفحة التي تبحث عنها غير موجودة
      </h1>

      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '460px', marginBottom: '2rem', lineHeight: 1.6 }}>
        قد يكون الرابط الذي اتبعته غير صحيح، أو تم حذف البرومبت أو نقله إلى مسار آخر.
      </p>

      <button onClick={() => navigate('home')} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
        العودة للرئيسية
        <ArrowLeft size={18} />
      </button>
    </div>
  );
};
