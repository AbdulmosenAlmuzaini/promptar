'use client';

import React, { useState, useEffect } from 'react';
import { useApp, generateShareText } from '../context/AppContext';
import { AdminLogin } from './AdminLogin';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderPlus,
  BarChart3,
  Settings,
  Eye,
  Copy,
  Download,
  Trash2,
  Edit,
  ExternalLink,
  Check,
  Sparkles,
  Globe,
  LogOut,
  AlertTriangle,
  Send
} from 'lucide-react';
import { TelegramIcon, WhatsAppIcon, XIcon } from './SocialIcons';

export const AdminDashboard = () => {
  const {
    loading,
    siteSettings,
    setSiteSettings,
    isAdminAuthenticated,
    logoutAdmin,
    prompts,
    categories,
    adminTab,
    editingPrompt,
    setEditingPrompt,
    publishedSuccessModal,
    setPublishedSuccessModal,
    deleteConfirmPromptId,
    setDeleteConfirmPromptId,
    confirmDeletePrompt,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addCategory,
    deleteCategory,
    navigate,
    showToast,
    uploadFileToStorage
  } = useApp();

  // All Hooks MUST be declared at top level before any conditional returns
  const [activeTab, setActiveTab] = useState(adminTab || 'overview');
  const [copiedSuccessLink, setCopiedSuccessLink] = useState(false);

  // Streamlined Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: editingPrompt ? editingPrompt.title : '',
    slug: editingPrompt ? editingPrompt.slug : '',
    category: editingPrompt ? editingPrompt.category : 'التعليم',
    model: editingPrompt ? editingPrompt.model : 'ChatGPT',
    shortDesc: editingPrompt ? editingPrompt.shortDesc : '',
    fullDesc: editingPrompt ? editingPrompt.fullDesc : '',
    promptText: editingPrompt ? editingPrompt.promptText : '',
    coverImage: editingPrompt ? editingPrompt.coverImage : '',
    hasAttachment: editingPrompt ? !!editingPrompt.attachment : false,
    attachmentName: editingPrompt && editingPrompt.attachment ? editingPrompt.attachment.name : '',
    attachmentType: editingPrompt && editingPrompt.attachment ? editingPrompt.attachment.type : 'PDF',
    attachmentSize: editingPrompt && editingPrompt.attachment ? editingPrompt.attachment.size : '2.1 ميجابايت',
    status: editingPrompt ? editingPrompt.status : 'منشور'
  });

  // Settings form state
  const [settingsData, setSettingsData] = useState({
    siteName: siteSettings?.siteName || 'مكتبة البرومبتات',
    siteSubtitle: siteSettings?.siteSubtitle || 'منصة البرومبتات العربية المتخصصة',
    telegramChannelUrl: siteSettings?.telegramChannelUrl || 'https://t.me/PromptArabic',
    twitterUrl: siteSettings?.twitterUrl || 'https://x.com',
    whatsappUrl: siteSettings?.whatsappUrl || 'https://wa.me',
    metaDescription: siteSettings?.metaDescription || ''
  });

  // Category Form State
  const [newCatName, setNewCatName] = useState('');

  // Sync settings state when siteSettings changes
  useEffect(() => {
    if (siteSettings) {
      setSettingsData({
        siteName: siteSettings.siteName || 'مكتبة البرومبتات',
        siteSubtitle: siteSettings.siteSubtitle || 'منصة البرومبتات العربية المتخصصة',
        telegramChannelUrl: siteSettings.telegramChannelUrl || 'https://t.me/PromptArabic',
        twitterUrl: siteSettings.twitterUrl || 'https://x.com',
        whatsappUrl: siteSettings.whatsappUrl || 'https://wa.me',
        metaDescription: siteSettings.metaDescription || ''
      });
    }
  }, [siteSettings]);

  // Sync activeTab when adminTab prop changes
  useEffect(() => {
    if (adminTab) setActiveTab(adminTab);
  }, [adminTab]);

  // Conditional Returns AFTER all Hooks have executed
  if (loading) {
    return (
      <div
        className="container animate-fade-in"
        style={{
          padding: '6rem 1.25rem',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--accent-purple)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          جاري التحقق من الجلسة وتحميل البيانات...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // Stats & Safe Array Handlers
  const safePrompts = Array.isArray(prompts) ? prompts : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const totalPrompts = safePrompts.length;
  const totalViews = safePrompts.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalCopies = safePrompts.reduce((acc, curr) => acc + (curr.copies || 0), 0);
  const totalDownloads = safePrompts.reduce((acc, curr) => acc + (curr.downloads || 0), 0);

  const topViewed = [...safePrompts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  const latestPublished = [...safePrompts].sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())).slice(0, 5);

  const handleFormSubmit = (e, status = 'منشور') => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.promptText || !formData.shortDesc) {
      showToast('يرجى كتابة عنوان البرومبت والوصف ونص البرومبت', 'warning');
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().trim().replace(/[^\w\u0621-\u064A\s-]/g, '').replace(/[\s_]+/g, '-'),
      category: formData.category,
      model: formData.model,
      shortDesc: formData.shortDesc,
      fullDesc: formData.fullDesc,
      promptText: formData.promptText,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      attachment: formData.hasAttachment
        ? {
            name: formData.attachmentName || `${formData.title}.pdf`,
            type: formData.attachmentType,
            size: formData.attachmentSize
          }
        : null,
      status: status
    };

    if (editingPrompt) {
      updatePrompt(editingPrompt.id, payload);
    } else {
      addPrompt(payload);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSiteSettings(settingsData);
    showToast('تم حفظ إعدادات المنصة بنجاح ✓', 'success');
  };

  const handleAddCatSubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName);
    setNewCatName('');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.25rem 4rem' }}>
      
      {/* Admin Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutDashboard size={24} color="var(--accent-purple)" />
            لوحة إعداد المنصة والمحتوى
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            إضافة وإدارة البرومبتات والتصنيفات والإحصائيات بسهولة.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setEditingPrompt(null);
              setActiveTab('add_prompt');
              setFormData({
                title: '', slug: '', category: 'التعليم', model: 'ChatGPT',
                shortDesc: '', fullDesc: '', promptText: '', coverImage: '',
                hasAttachment: false, attachmentName: '', attachmentType: 'PDF',
                attachmentSize: '2.1 ميجابايت', status: 'منشور'
              });
            }}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
          >
            <PlusCircle size={16} />
            إضافة برومبت جديد
          </button>

          <button
            onClick={logoutAdmin}
            className="btn-secondary"
            style={{ padding: '9px 14px', fontSize: '0.85rem' }}
            title="تسجيل الخروج"
          >
            <LogOut size={16} />
            خروج
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar (Requirement #14) */}
      <div className="mobile-admin-tabs" style={{ display: 'none', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('overview')} className={`category-chip ${activeTab === 'overview' ? 'active' : ''}`}>الرئيسية</button>
        <button onClick={() => setActiveTab('prompts_list')} className={`category-chip ${activeTab === 'prompts_list' ? 'active' : ''}`}>البرومبتات ({safePrompts.length})</button>
        <button onClick={() => { setEditingPrompt(null); setActiveTab('add_prompt'); }} className={`category-chip ${activeTab === 'add_prompt' ? 'active' : ''}`}>إضافة برومبت</button>
        <button onClick={() => setActiveTab('categories')} className={`category-chip ${activeTab === 'categories' ? 'active' : ''}`}>التصنيفات</button>
        <button onClick={() => setActiveTab('analytics')} className={`category-chip ${activeTab === 'analytics' ? 'active' : ''}`}>الإحصائيات</button>
        <button onClick={() => setActiveTab('settings')} className={`category-chip ${activeTab === 'settings' ? 'active' : ''}`}>الإعدادات</button>
      </div>

      {/* Admin Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '1.5rem' }} className="admin-grid">
        
        {/* Desktop Sidebar */}
        <aside
          className="desktop-admin-sidebar"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            height: 'fit-content'
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              الرئيسية
            </button>

            <button
              onClick={() => setActiveTab('prompts_list')}
              className={`sidebar-nav-btn ${activeTab === 'prompts_list' ? 'active' : ''}`}
            >
              <FileText size={18} />
              إدارة البرومبتات ({safePrompts.length})
            </button>

            <button
              onClick={() => {
                setEditingPrompt(null);
                setActiveTab('add_prompt');
              }}
              className={`sidebar-nav-btn ${activeTab === 'add_prompt' ? 'active' : ''}`}
            >
              <PlusCircle size={18} />
              إضافة برومبت
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`sidebar-nav-btn ${activeTab === 'categories' ? 'active' : ''}`}
            >
              <FolderPlus size={18} />
              إدارة التصنيفات
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`sidebar-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <BarChart3 size={18} />
              الإحصائيات
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`sidebar-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            >
              <Settings size={18} />
              إعدادات المنصة
            </button>
          </nav>
        </aside>

        {/* Content Panel */}
        <main>
          
          {/* TAB 1: OVERVIEW (Requirement #12) */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>إجمالي البرومبتات</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalPrompts}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA' }}>
                    <Eye size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>المشاهدات</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalViews.toLocaleString()}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34D399' }}>
                    <Copy size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>مرات النسخ</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalCopies.toLocaleString()}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#F87171' }}>
                    <Download size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>التحميلات</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalDownloads.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Lists Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                
                {/* Most Viewed Prompts */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} color="#60A5FA" />
                    أكثر 5 برومبتات مشاهدة
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {topViewed.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate('prompt-detail', { slug: p.slug })}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-main)', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {p.title}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#60A5FA', fontWeight: 700 }}>
                          {p.views} مشاهدة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Published Prompts */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--accent-purple)" />
                    آخر البرومبتات المنشورة
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {latestPublished.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => navigate('prompt-detail', { slug: p.slug })}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-main)', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {p.title}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {p.createdAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: PROMPTS TABLE LIST (Requirement #5) */}
          {activeTab === 'prompts_list' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.25rem', overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>إدارة البرومبتات ({safePrompts.length})</h3>
                <button
                  onClick={() => {
                    setEditingPrompt(null);
                    setActiveTab('add_prompt');
                    setFormData({
                      title: '', slug: '', category: 'التعليم', model: 'ChatGPT',
                      shortDesc: '', fullDesc: '', promptText: '', coverImage: '',
                      hasAttachment: false, attachmentName: '', attachmentType: 'PDF',
                      attachmentSize: '2.1 ميجابايت', status: 'منشور'
                    });
                  }}
                  className="btn-primary"
                  style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                >
                  <PlusCircle size={15} /> إضافة جديد
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '10px' }}>العنوان</th>
                    <th style={{ padding: '10px' }}>التصنيف</th>
                    <th style={{ padding: '10px' }}>النموذج</th>
                    <th style={{ padding: '10px' }}>الحالة</th>
                    <th style={{ padding: '10px' }}>المشاهدات</th>
                    <th style={{ padding: '10px' }}>النسخ</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {safePrompts.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '200px' }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{p.category}</td>
                      <td style={{ padding: '10px' }}>
                        <span className="badge-model badge-chatgpt" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{p.model}</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', background: p.status === 'منشور' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: p.status === 'منشور' ? '#34D399' : '#FBBF24', fontWeight: 700 }}>
                          {p.status || 'منشور'}
                        </span>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{p.views}</td>
                      <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{p.copies}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate('prompt-detail', { slug: p.slug })}
                            className="btn-icon"
                            style={{ width: '30px', height: '30px' }}
                            title="عرض"
                          >
                            <ExternalLink size={14} />
                          </button>
                          
                          <button
                            onClick={() => {
                              setEditingPrompt(p);
                              setActiveTab('add_prompt');
                              setFormData({
                                title: p.title,
                                slug: p.slug,
                                category: p.category,
                                model: p.model,
                                shortDesc: p.shortDesc,
                                fullDesc: p.fullDesc || '',
                                promptText: p.promptText,
                                coverImage: p.coverImage || '',
                                hasAttachment: !!p.attachment,
                                attachmentName: p.attachment ? p.attachment.name : '',
                                attachmentType: p.attachment ? p.attachment.type : 'PDF',
                                attachmentSize: p.attachment ? p.attachment.size : '2.1 ميجابايت',
                                status: p.status || 'منشور'
                              });
                            }}
                            className="btn-icon"
                            style={{ width: '30px', height: '30px' }}
                            title="تعديل"
                          >
                            <Edit size={14} />
                          </button>

                          <button
                            onClick={() => confirmDeletePrompt(p.id)}
                            className="btn-icon"
                            style={{ width: '30px', height: '30px', color: '#EF4444' }}
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: STREAMLINED ADD/EDIT FORM (Requirement #4 & #9) */}
          {activeTab === 'add_prompt' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                {editingPrompt ? 'تعديل البرومبت' : 'إضافة برومبت جديد'}
              </h3>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* 1. المعلومات الأساسية */}
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-purple)' }}>
                    1. المعلومات الأساسية
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">اسم البرومبت *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="مثال: برومبت كتابة إعلان احترافي"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label className="form-label">التصنيف *</label>
                        <select
                          className="form-input"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          {categories.filter(c => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="form-label">النموذج *</label>
                        <select
                          className="form-input"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        >
                          <option value="ChatGPT">ChatGPT</option>
                          <option value="Claude">Claude</option>
                          <option value="Gemini">Gemini</option>
                          <option value="Grok">Grok</option>
                          <option value="DeepSeek">DeepSeek</option>
                          <option value="عام">عام</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">الوصف المختصر *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="سطر أو سطرين يوضح الفائدة الرئيسية"
                        value={formData.shortDesc}
                        onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 2. المحتوى */}
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-purple)' }}>
                    2. المحتوى
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">نص البرومبت * (المحتوى الرئيسي للنسخ)</label>
                      <textarea
                        className="form-input"
                        rows={6}
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                        placeholder="تصرف كخبير في... اكتب الأوامر هنا مع الأقواس [اسم الموضوع]..."
                        value={formData.promptText}
                        onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">الوصف الكامل (اختياري)</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder="تفاصيل وإرشادات تشغيل البرومبت..."
                        value={formData.fullDesc}
                        onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. المرفقات */}
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent-purple)' }}>
                    3. المرفقات وصورة الغلاف
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">صورة الغلاف (رابط أو رفع إلى Vercel Blob)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="https://images.unsplash.com/... أو اختر صورة لرفعها"
                          value={formData.coverImage}
                          onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        />
                        <label className="btn-secondary" style={{ padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                          رفع صورة
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                showToast('جاري رفع الصورة إلى Vercel Blob...', 'info');
                                const res = await uploadFileToStorage('prompt-images', file);
                                if (res.url && res.url !== '#') {
                                  setFormData({ ...formData, coverImage: res.url });
                                  showToast('تم رفع الصورة إلى Vercel Blob بنجاح ✓', 'success');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.85rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' }}>
                        <input
                          type="checkbox"
                          checked={formData.hasAttachment}
                          onChange={(e) => setFormData({ ...formData, hasAttachment: e.target.checked })}
                        />
                        إضافة ملف مرفق (PDF, DOCX, XLSX, ZIP)
                      </label>

                      {formData.hasAttachment && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem' }}>
                          <div>
                            <label className="form-label">رفع ملف المرفق إلى Vercel Blob</label>
                            <input
                              type="file"
                              className="form-input"
                              accept=".pdf,.docx,.xlsx,.zip"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const ext = file.name.split('.').pop().toUpperCase();
                                  const sizeMb = `${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت`;
                                  showToast('جاري رفع الملف إلى Vercel Blob...', 'info');
                                  const res = await uploadFileToStorage('prompt-files', file);
                                  if (res.url && res.url !== '#') {
                                    setFormData({
                                      ...formData,
                                      attachmentName: file.name,
                                      attachmentType: ext || 'PDF',
                                      attachmentSize: sizeMb,
                                      attachmentUrl: res.url,
                                      blobPath: res.path
                                    });
                                    showToast('تم رفع الملف بنجاح ✓', 'success');
                                  }
                                }
                              }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
                            <div>
                              <label className="form-label">اسم الملف</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="دليل_المعلم.pdf"
                                value={formData.attachmentName}
                                onChange={(e) => setFormData({ ...formData, attachmentName: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label">نوع الملف</label>
                              <select
                                className="form-input"
                                value={formData.attachmentType}
                                onChange={(e) => setFormData({ ...formData, attachmentType: e.target.value })}
                              >
                                <option value="PDF">PDF</option>
                                <option value="DOCX">DOCX</option>
                                <option value="XLSX">XLSX</option>
                                <option value="ZIP">ZIP</option>
                              </select>
                            </div>
                            <div>
                              <label className="form-label">الحجم</label>
                              <input
                                type="text"
                                className="form-input"
                                placeholder="2.4 ميجابايت"
                                value={formData.attachmentSize}
                                onChange={(e) => setFormData({ ...formData, attachmentSize: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. النشر & الأزرار */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label className="form-label" style={{ margin: 0 }}>حالة البرومبت:</label>
                    <select
                      className="form-input"
                      style={{ width: '120px' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="منشور">منشور</option>
                      <option value="مسودة">مسودة</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={(e) => handleFormSubmit(e, 'مسودة')}
                      className="btn-secondary"
                    >
                      حفظ كمسودة
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleFormSubmit(e, 'منشور')}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                    >
                      <Sparkles size={16} />
                      {editingPrompt ? 'حفظ التغييرات' : 'نشر البرومبت'}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* TAB 4: CATEGORIES */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>إضافة تصنيف جديد</h3>
                <form onSubmit={handleAddCatSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, minWidth: '180px' }}
                    placeholder="اسم التصنيف..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary">
                    <PlusCircle size={15} /> إضافة التصنيف
                  </button>
                </form>
              </div>

              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>التصنيفات الحالية</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
                  {safeCategories.filter(c => c.id !== 'all').map((cat) => (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cat.name}</span>
                      <button onClick={() => deleteCategory(cat.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS (Requirement #12) */}
          {activeTab === 'analytics' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="var(--accent-purple)" />
                تحليلات المنصة
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                <div style={{ background: 'var(--bg-main)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>إجمالي البرومبتات</div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--accent-purple)' }}>{totalPrompts}</div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>المشاهدات</div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#60A5FA' }}>{totalViews}</div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>مرات النسخ</div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#34D399' }}>{totalCopies}</div>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>التحميلات</div>
                  <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#F87171' }}>{totalDownloads}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS (Requirement #18) */}
          {activeTab === 'settings' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--accent-purple)" />
                إعدادات المنصة والهوية (تنفيذ مباشر)
              </h3>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="form-label">اسم المنصة الرئيسي (الشعار النصي)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.siteName}
                    onChange={(e) => setSettingsData({ ...settingsData, siteName: e.target.value })}
                    placeholder="مكتبة البرومبتات"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">الوصف الفرعي للمنصة</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.siteSubtitle}
                    onChange={(e) => setSettingsData({ ...settingsData, siteSubtitle: e.target.value })}
                    placeholder="منصة البرومبتات العربية المتخصصة"
                  />
                </div>

                <div>
                  <label className="form-label">رابط قناة Telegram</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.telegramChannelUrl}
                    onChange={(e) => setSettingsData({ ...settingsData, telegramChannelUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">رابط حساب X (Twitter)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.twitterUrl}
                    onChange={(e) => setSettingsData({ ...settingsData, twitterUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">رابط WhatsApp</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settingsData.whatsappUrl}
                    onChange={(e) => setSettingsData({ ...settingsData, whatsappUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">وصف الموقع لـ SEO</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={settingsData.metaDescription}
                    onChange={(e) => setSettingsData({ ...settingsData, metaDescription: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '10px 22px' }}>
                  حفظ التغييرات الآن
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* CONFIRM DELETE MODAL (Requirement #5 & #15) */}
      {deleteConfirmPromptId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem 1.75rem',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <AlertTriangle size={26} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              تأكيد حذف البرومبت
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              هل أنت تأكد من رغبتك في حذف هذا البرومبت نهائياً من المنصة؟
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmPromptId(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                إلغاء
              </button>

              <button
                onClick={() => deletePrompt(deleteConfirmPromptId)}
                className="btn-primary"
                style={{ flex: 1, background: '#EF4444', boxShadow: 'none' }}
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST-PUBLISH SUCCESS MODAL (Requirement #10 & #11: The Most Important Workflow) */}
      {publishedSuccessModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--accent-purple)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem 2rem',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card), var(--shadow-glow)'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              تم نشر البرومبت بنجاح ✓
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              تم حفظ ونشر البرومبت، يمكنك نسخ الرابط أو مشاركته فوراً:
            </p>

            {/* Generated Link Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '6px 10px',
                marginBottom: '1.5rem',
                gap: '8px'
              }}
            >
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/prompts/${publishedSuccessModal.slug}`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  direction: 'ltr'
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/prompts/${publishedSuccessModal.slug}`);
                  setCopiedSuccessLink(true);
                  showToast('تم نسخ الرابط ✓', 'success');
                  setTimeout(() => setCopiedSuccessLink(false), 2000);
                }}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {copiedSuccessLink ? 'تم النسخ ✓' : 'نسخ الرابط'}
              </button>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', color: 'var(--text-secondary)' }}>
              شارك الآن
            </h4>

            {/* Dynamic Share Text Format (#11) */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/prompts/${publishedSuccessModal.slug}`)}&text=${encodeURIComponent(generateShareText(publishedSuccessModal.title, publishedSuccessModal.shortDesc, `${window.location.origin}/prompts/${publishedSuccessModal.slug}`))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' }}
              >
                <TelegramIcon size={16} /> Telegram
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(generateShareText(publishedSuccessModal.title, publishedSuccessModal.shortDesc, `${window.location.origin}/prompts/${publishedSuccessModal.slug}`))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText(publishedSuccessModal.title, publishedSuccessModal.shortDesc, `${window.location.origin}/prompts/${publishedSuccessModal.slug}`))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn"
                style={{ background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                <XIcon size={16} /> X (Twitter)
              </a>
            </div>

            <button
              onClick={() => {
                const targetSlug = publishedSuccessModal.slug;
                setPublishedSuccessModal(null);
                navigate('prompt-detail', { slug: targetSlug });
              }}
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              معاينة صفحة البرومبت
            </button>
          </div>
        </div>
      )}

      <style>{`
        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-arabic);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: right;
        }
        .sidebar-nav-btn:hover, .sidebar-nav-btn.active {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-purple);
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 1.1rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 5px;
        }
        .form-input {
          width: 100%;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          padding: 9px 12px;
          border-radius: 10px;
          font-family: var(--font-arabic);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .form-input:focus {
          border-color: var(--accent-purple);
        }
        @media (max-width: 850px) {
          .admin-grid { grid-template-columns: 1fr !important; }
          .desktop-admin-sidebar { display: none !important; }
          .mobile-admin-tabs { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
