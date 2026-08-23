'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, ArrowLeft, Sparkles } from 'lucide-react';

export const PromptCard = ({ prompt }) => {
  const getModelBadgeClass = (model) => {
    switch (model) {
      case 'ChatGPT': return 'badge-chatgpt';
      case 'Claude': return 'badge-claude';
      case 'Gemini': return 'badge-gemini';
      case 'Grok': return 'badge-grok';
      case 'DeepSeek': return 'badge-deepseek';
      default: return 'badge-general';
    }
  };

  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        className="prompt-card cursor-pointer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: '260px',
          padding: '1.4rem'
        }}
      >
        <div>
          {/* Top Header Row: Category + AI Model */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {prompt.category}
            </span>
            
            <span className={`badge-model ${getModelBadgeClass(prompt.model)}`} style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
              <Sparkles size={12} />
              {prompt.model}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              lineHeight: 1.45,
              marginBottom: '0.65rem',
              color: 'var(--text-primary)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.9em'
            }}
          >
            {prompt.title}
          </h3>

          {/* Description (2 lines clamp) */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '3.2em'
            }}
          >
            {prompt.shortDesc}
          </p>
        </div>

        {/* Footer Row: Views + View Prompt Button */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Eye size={15} />
            <span>{prompt.views} مشاهدة</span>
          </div>

          <span
            className="btn-primary"
            style={{ padding: '7px 16px', fontSize: '0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            عرض البرومبت
            <ArrowLeft size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
};
