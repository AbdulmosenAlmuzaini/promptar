'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, ArrowLeft, Flame } from 'lucide-react';

export const Hero = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedModel,
    setSelectedModel,
    navigate
  } = useApp();

  const handleChipClick = (item) => {
    if (['ChatGPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek'].includes(item)) {
      setSelectedModel(selectedModel === item ? 'all' : item);
    } else {
      setSelectedCategory(selectedCategory === item ? 'all' : item);
    }
  };

  const chips = [
    { label: 'الكل', value: 'all' },
    { label: 'ChatGPT', value: 'ChatGPT', isModel: true },
    { label: 'Claude', value: 'Claude', isModel: true },
    { label: 'Gemini', value: 'Gemini', isModel: true },
    { label: 'Grok', value: 'Grok', isModel: true },
    { label: 'DeepSeek', value: 'DeepSeek', isModel: true },
    { label: 'التعليم', value: 'التعليم' },
    { label: 'التسويق', value: 'التسويق' },
    { label: 'التصميم', value: 'التصميم' },
    { label: 'كتابة المحتوى', value: 'كتابة المحتوى' },
    { label: 'البرمجة', value: 'البرمجة' },
    { label: 'الأعمال', value: 'الأعمال' },
    { label: 'ملفات PDF', value: 'ملفات PDF' }
  ];

  const handleScrollToLatest = () => {
    const el = document.getElementById('latest-prompts');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('prompts');
  };

  return (
    <section
      style={{
        position: 'relative',
        padding: '4.5rem 0 3.5rem',
        background: 'var(--gradient-hero)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}
    >
      <div className="glow-spot-1" />
      <div className="glow-spot-2" />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        
        {/* Top Tag Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            color: 'var(--accent-purple)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={15} />
          المرجع الأول والمركزية للبرومبتات العربية
        </div>

        {/* Main Title (Requirement #2) */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            marginBottom: '1.2rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px'
          }}
        >
          كل البرومبتات التي تحتاجها… <span style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>في مكان واحد</span>
        </h1>

        {/* Subtitle (Requirement #2) */}
        <p
          style={{
            fontSize: 'clamp(1.02rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '780px',
            margin: '0 auto 2.2rem',
            lineHeight: 1.7
          }}
        >
          مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة، مع إمكانية النسخ والتحميل والمشاركة بسهولة.
        </p>

        {/* Action Buttons (Requirement #2) */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button onClick={() => navigate('prompts')} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            استكشف البرومبتات
            <ArrowLeft size={18} />
          </button>
          
          <button onClick={handleScrollToLatest} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <Flame size={18} color="#F59E0B" />
            أحدث البرومبتات
          </button>
        </div>

        {/* Big Central Search Bar */}
        <div
          style={{
            maxWidth: '700px',
            margin: '0 auto 2rem',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-card)',
              border: '2px solid var(--border-glow)',
              borderRadius: 'var(--radius-xl)',
              padding: '6px 12px 6px 6px',
              boxShadow: 'var(--shadow-card), var(--shadow-glow)'
            }}
          >
            <Search size={22} color="var(--accent-purple)" style={{ marginRight: '10px' }} />
            <input
              type="text"
              placeholder="ابحث عن برومبت... (مثال: برومبت المعلمين، تسويق، بايثون)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate('prompts');
              }}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-arabic)',
                fontSize: '1.05rem',
                outline: 'none',
                padding: '10px 8px'
              }}
            />
            <button
              onClick={() => navigate('prompts')}
              className="btn-primary"
              style={{ borderRadius: 'var(--radius-lg)', padding: '12px 24px', fontSize: '0.95rem' }}
            >
              بحث
            </button>
          </div>
        </div>

        {/* Categories Chips Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            justifyContent: 'center',
            maxWidth: '920px',
            margin: '0 auto'
          }}
        >
          {chips.map((chip) => {
            const isActive = chip.isModel
              ? selectedModel === chip.value
              : chip.value === 'all'
              ? selectedCategory === 'all' && selectedModel === 'all'
              : selectedCategory === chip.value;

            return (
              <button
                key={chip.value}
                onClick={() => {
                  if (chip.value === 'all') {
                    setSelectedCategory('all');
                    setSelectedModel('all');
                  } else {
                    handleChipClick(chip.value);
                  }
                }}
                className={`category-chip ${isActive ? 'active' : ''}`}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.82rem',
                  borderColor: chip.isModel ? 'var(--accent-cyan)' : undefined
                }}
              >
                {chip.isModel && <Sparkles size={11} color={isActive ? '#FFF' : 'var(--accent-cyan)'} />}
                {chip.label}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
