'use client';

import { useApp, generateShareText, getSiteUrl } from '../context/AppContext';
import { PromptCard } from './PromptCard';
import {
  Copy,
  Check,
  Eye,
  Calendar,
  Share2,
  FileText,
  Download,
  Sparkles,
  Link,
  Send
} from 'lucide-react';
import { TelegramIcon, WhatsAppIcon, XIcon, FacebookIcon, LinkedinIcon } from './SocialIcons';

export const PromptDetail = ({ initialPrompt }) => {
  const {
    siteSettings,
    currentPromptSlug,
    prompts,
    navigate,
    incrementCopies,
    incrementDownloads,
    downloadFile,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const prompt = initialPrompt || prompts.find((p) => p.slug === currentPromptSlug) || prompts[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPromptSlug]);

  if (!prompt) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>البرومبت غير موجود</h2>
        <button onClick={() => navigate('home')} className="btn-primary" style={{ marginTop: '1rem' }}>
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const promptUrl = `${getSiteUrl()}/prompts/${prompt.slug}`;
  
  // Dynamic share text requested in requirement #11
  const autoShareText = generateShareText(prompt.title, prompt.shortDesc, promptUrl);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setCopied(true);
    incrementCopies(prompt.id);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(promptUrl);
    setLinkCopied(true);
    showToast('تم نسخ الرابط ✓', 'success');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleDownload = () => {
    if (prompt.attachment) {
      incrementDownloads(prompt.id);
      downloadFile(prompt.attachment, prompt.title);
    }
  };

  // Similar Prompts (3-4 prompts from same category)
  const similarPrompts = prompts
    .filter((p) => p.id !== prompt.id && p.category === prompt.category)
    .slice(0, 3);
  
  const fallbackPrompts = prompts
    .filter((p) => p.id !== prompt.id && !similarPrompts.some((sp) => sp.id === p.id))
    .slice(0, 3 - similarPrompts.length);

  const finalSimilar = [...similarPrompts, ...fallbackPrompts];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          marginBottom: '1.5rem'
        }}
      >
        <button
          onClick={() => navigate('home')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          الرئيسية
        </button>
        <span>/</span>
        <button
          onClick={() => navigate('prompts')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          البرومبتات
        </button>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{prompt.title}</span>
      </div>

      {/* Header Info Block (Requirement #5: Title -> Desc -> Cat+Model+Date) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.3rem)',
            fontWeight: 800,
            lineHeight: 1.35,
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}
        >
          {prompt.title}
        </h1>

        {/* Description */}
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {prompt.fullDesc || prompt.shortDesc}
        </p>

        {/* Category + AI Tool + Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.88rem'
          }}
        >
          <span className="category-chip active" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
            {prompt.category}
          </span>

          <span className={`badge-model badge-chatgpt`} style={{ fontSize: '0.8rem' }}>
            <Sparkles size={13} />
            {prompt.model}
          </span>

          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={14} />
            تاريخ النشر: {prompt.createdAt}
          </span>

          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginRight: 'auto' }}>
            <Eye size={14} />
            {prompt.views} مشاهدة
          </span>
        </div>
      </div>

      {/* SECTION: نص البرومبت (Requirement #5) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card), var(--shadow-glow)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <Sparkles size={20} color="var(--accent-purple)" />
            نص البرومبت
          </h2>

          <button
            onClick={handleCopyPrompt}
            className="btn-primary"
            style={{
              padding: '12px 26px',
              fontSize: '1rem',
              borderRadius: 'var(--radius-md)',
              background: copied ? '#10B981' : undefined
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'تم نسخ البرومبت ✓' : 'نسخ البرومبت'}
          </button>
        </div>

        <div className="prompt-code-box">
          {prompt.promptText}
        </div>
      </div>

      {/* SECTION: شارك هذا البرومبت (Requirement #6: Placed directly after prompt text) */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={18} color="var(--accent-purple)" />
          شارك هذا البرومبت
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          انشر الرابط مباشرة لتوليد منشور جذاب ومنسق تلقائياً:
        </p>

        {/* Dynamic Text Preview */}
        <div
          style={{
            background: 'var(--bg-main)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
            whiteSpace: 'pre-wrap'
          }}
        >
          {autoShareText}
        </div>

        {/* Elegant Unified Share Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(promptUrl)}&text=${encodeURIComponent(autoShareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unified-share-btn"
          >
            <TelegramIcon size={16} color="var(--accent-purple)" />
            Telegram
          </a>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(autoShareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unified-share-btn"
          >
            <WhatsAppIcon size={16} color="var(--accent-emerald)" />
            WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(autoShareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unified-share-btn"
          >
            <XIcon size={16} color="var(--text-primary)" />
            X
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(promptUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unified-share-btn"
          >
            <FacebookIcon size={16} color="var(--accent-indigo)" />
            Facebook
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(promptUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unified-share-btn"
          >
            <LinkedinIcon size={16} color="var(--accent-cyan)" />
            LinkedIn
          </a>

          <button onClick={handleCopyLink} className="unified-share-btn">
            {linkCopied ? <Check size={16} color="#10B981" /> : <Link size={16} />}
            {linkCopied ? 'تم نسخ الرابط ✓' : 'نسخ الرابط'}
          </button>
        </div>
      </div>

      {/* SECTION: الملفات المرفقة (Requirement #7: Rendered ONLY if attachment exists) */}
      {prompt.attachment && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--accent-indigo)" />
            الملفات المرفقة
          </h3>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.1rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>
                  {prompt.attachment.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  نوع الملف: {prompt.attachment.type} | الحجم: {prompt.attachment.size}
                </div>
              </div>
            </div>

            <button onClick={handleDownload} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
              <Download size={16} />
              تحميل الملف
            </button>
          </div>
        </div>
      )}

      {/* SECTION: CTA Box Telegram Channel (Requirement #8) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          marginBottom: '3rem',
          textAlign: 'center'
        }}
      >
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          لا تفوّت البرومبتات الجديدة
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          تابع القناة ليصلك كل جديد من البرومبتات والأدوات والملفات الجاهزة.
        </p>

        <a
          href={siteSettings.telegramChannelUrl || 'https://t.me/PromptArabic'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
            borderRadius: '24px',
            background: 'var(--gradient-accent)',
            display: 'inline-flex',
            textDecoration: 'none'
          }}
        >
          <Send size={18} />
          انضم إلى قناة Telegram
        </a>
      </div>

      {/* SECTION: قد يعجبك أيضاً */}
      <div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          قد يعجبك أيضاً
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {finalSimilar.map((item) => (
            <PromptCard key={item.id} prompt={item} />
          ))}
        </div>
      </div>

      <style>{`
        .unified-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-family: var(--font-arabic);
          font-weight: 600;
          font-size: 0.88rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .unified-share-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--accent-purple);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};
