'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from '../components/Hero';
import { PromptCard } from '../components/PromptCard';
import { Sparkles, ArrowLeft, Send, Zap, FileText } from 'lucide-react';

export default function HomePage() {
  const { siteSettings, prompts, navigate } = useApp();

  const publishedPrompts = prompts.filter(p => p.status === 'منشور' || !p.status);
  const latestPrompts = publishedPrompts.slice(0, 8);

  return (
    <div className="animate-fade-in">
      <Hero />

      {/* Latest Prompts Section */}
      <section id="latest-prompts" className="container" style={{ padding: '3.5rem 1.25rem 3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="var(--accent-purple)" />
              أحدث البرومبتات المضافة
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              تصفح أحدث الأوامر والبرومبتات الجاهزة للنسخ المباشر والمشاركة.
            </p>
          </div>

          <button onClick={() => navigate('prompts')} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.9rem' }}>
            عرض كافة البرومبتات
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {latestPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* Why Choose Platform Section (عن المنصة) */}
      <section
        id="about-section"
        style={{
          background: 'var(--bg-glass)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          padding: '3.5rem 0',
          margin: '2rem 0'
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            لماذا <span style={{ color: 'var(--accent-purple)' }}>{siteSettings.siteName}</span>؟
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
            صُممت المنصة لتصبح المرجع الأول لإضافة البرومبت مرة واحدة فقط، ومشاركته بمرونة على التليجرام وواتساب وإكس دون الحاجة لإعادة التنسيق يدويًا.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            <div className="feature-box">
              <div className="feature-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)' }}>
                <Send size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>مشاركة فورية ورابط واحد</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                منشور جاهز ومنسق بضغطة زر لمشاركته في قناتك على Telegram أو مجموعات WhatsApp.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>دعم المرفقات والملفات</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                أرفق ملفات PDF وأوراق العمل المساعدة مع البرومبتات ليتمكن مستخدموك من تحميلها بسهولة.
              </p>
            </div>

            <div className="feature-box">
              <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34D399' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>نسخ بنقرة واحدة</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                تجربة مريحة تمكّن الزائر من نسخ الأوامر دون أي أخطاء لغوية أو مشاكل في التنسيق.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
