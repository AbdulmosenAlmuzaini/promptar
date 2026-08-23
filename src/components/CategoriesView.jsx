'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Bot,
  Cpu,
  Zap,
  Flame,
  BrainCircuit,
  GraduationCap,
  Megaphone,
  Palette,
  PenTool,
  Code,
  Briefcase,
  FileText,
  ArrowLeft
} from 'lucide-react';

export const CategoriesView = () => {
  const { categories, prompts, setSelectedCategory } = useApp();
  const router = useRouter();

  const getCategoryIcon = (name) => {
    switch (name) {
      case 'ChatGPT': return <Bot size={28} color="#34D399" />;
      case 'Claude': return <Cpu size={28} color="#FBBF24" />;
      case 'Gemini': return <Zap size={28} color="#60A5FA" />;
      case 'Grok': return <Flame size={28} color="#F87171" />;
      case 'DeepSeek': return <BrainCircuit size={28} color="#22D3EE" />;
      case 'التعليم': return <GraduationCap size={28} color="#818CF8" />;
      case 'التسويق': return <Megaphone size={28} color="#EC4899" />;
      case 'التصميم': return <Palette size={28} color="#F59E0B" />;
      case 'كتابة المحتوى': return <PenTool size={28} color="#10B981" />;
      case 'البرمجة': return <Code size={28} color="#06B6D4" />;
      case 'الأعمال': return <Briefcase size={28} color="#6366F1" />;
      case 'ملفات PDF': return <FileText size={28} color="#EF4444" />;
      default: return <Sparkles size={28} color="var(--accent-purple)" />;
    }
  };

  const handleSelectCat = (name) => {
    setSelectedCategory(name);
    router.push(`/prompts?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          تصنيفات <span style={{ color: 'var(--accent-purple)' }}>البرومبتات</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          تصفح الأوامر حسب مجالات عملك أو حسب نموذج الذكاء الاصطناعي المفضل لديك.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {(categories || [])
          .filter((c) => c.id !== 'all')
          .map((cat) => {
            const count = (prompts || []).filter(
              (p) =>
                p.category === cat.name ||
                p.model === cat.name ||
                (cat.name === 'ملفات PDF' && p.attachment && p.attachment.type === 'PDF')
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCat(cat.name)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
                className="category-card"
              >
                <div>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: 'var(--bg-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {getCategoryIcon(cat.name)}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    استكشف أفضل أوامر {cat.name} الجاهزة للاستخدام المباشر.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--accent-purple)'
                  }}
                >
                  <span>{count} برومبت</span>
                  <ArrowLeft size={16} />
                </div>
              </div>
            );
          })}
      </div>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-glow);
          box-shadow: var(--shadow-card), var(--shadow-glow);
        }
      `}</style>
    </div>
  );
};
