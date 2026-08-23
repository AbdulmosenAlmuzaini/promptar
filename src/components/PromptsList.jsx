'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { PromptCard } from './PromptCard';
import { Search, Filter, ArrowUpDown, Sparkles, X } from 'lucide-react';

export const PromptsList = () => {
  const {
    prompts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedModel,
    setSelectedModel,
    sortBy,
    setSortBy
  } = useApp();

  const searchParams = useSearchParams();
  const qParam = searchParams.get('q');
  const sortParam = searchParams.get('sort');
  const categoryParam = searchParams.get('category');

  // Sync URL search parameters on mount / change
  useEffect(() => {
    if (qParam !== null) {
      setSearchQuery(qParam);
    }
    if (sortParam !== null) {
      setSortBy(sortParam);
    }
    if (categoryParam !== null) {
      setSelectedCategory(categoryParam);
    }
  }, [qParam, sortParam, categoryParam, setSearchQuery, setSortBy, setSelectedCategory]);

  const models = ['الكل', 'ChatGPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'عام'];

  // Filter logic
  const filteredPrompts = (prompts || []).filter((p) => {
    // Search query match
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

    // Category match
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'ملفات PDF' && p.attachment && p.attachment.type === 'PDF');

    // Model match
    const matchesModel =
      selectedModel === 'all' || selectedModel === 'الكل' || p.model === selectedModel;

    return matchesSearch && matchesCategory && matchesModel;
  });

  // Sort logic
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'copies') return (b.copies || 0) - (a.copies || 0);
    if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedModel('all');
    setSortBy('newest');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem 5rem' }}>
      
      {/* Page Title Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          مكتبة البرومبتات <span style={{ color: 'var(--accent-purple)' }}>الكاملة</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          تصفح واستكشف كافة البرومبتات العربية المتاحة، واستخدم الفلاتر المخصصة للوصول لأفضل الأوامر.
        </p>
      </div>

      {/* Control Bar (Search, Category, Model, Sorting) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="بحث بالاسم أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 38px 10px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <Search
              size={18}
              color="var(--text-secondary)"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Category Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--text-secondary)" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">كافة التصنيفات</option>
              {(categories || [])
                .filter((c) => c.id !== 'all')
                .map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* AI Model Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-purple)" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              <option value="all">كافة النماذج (ChatGPT, Claude...)</option>
              {models.filter((m) => m !== 'الكل').map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={18} color="var(--text-secondary)" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              <option value="newest">ترتيب: الأحدث أولاً</option>
              <option value="views">ترتيب: الأكثر مشاهدة</option>
              <option value="copies">ترتيب: الأكثر نسخاً 🔥</option>
              <option value="downloads">ترتيب: الأكثر تحميلاً 📥</option>
            </select>
          </div>

        </div>

        {/* Results status & Reset button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <div>
            تم العثور على <strong style={{ color: 'var(--text-primary)' }}>{sortedPrompts.length}</strong> برومبت
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedModel !== 'all' || sortBy !== 'newest') && (
            <button
              onClick={resetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-purple)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              <X size={14} />
              إعادة ضبط الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Prompts Grid */}
      {sortedPrompts.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}
        >
          {sortedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}
        >
          <Sparkles size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            لم نجد برومبتات مطابقة لبحثك.
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            جرب البحث بمصطلحات أخرى أو قم بإلغاء بعض الفلاتر المحددة.
          </p>
          <button onClick={resetFilters} className="btn-primary">
            عرض كافة البرومبتات
          </button>
        </div>
      )}
    </div>
  );
};
