'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getPromptsAction,
  getPromptBySlugAction,
  createPromptAction,
  updatePromptAction,
  deletePromptAction,
  incrementViewsAction,
  incrementCopiesAction,
  incrementDownloadsAction
} from '../app/actions/prompts';
import {
  getCategoriesAction,
  addCategoryAction,
  deleteCategoryAction
} from '../app/actions/categories';
import {
  getSettingsAction,
  updateSettingsAction
} from '../app/actions/settings';
import {
  loginAdminAction,
  logoutAdminAction,
  verifyAdminSession
} from '../app/actions/auth';
import { INITIAL_PROMPTS, INITIAL_CATEGORIES } from '../data/initialData';

const AppContext = createContext();

export const generateShareText = (title, shortDesc, url) => {
  return `🔥 ${title}\n\n${shortDesc}\n\n👇 التفاصيل والبرومبت:\n${url}`;
};

export const getSiteUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Platform Settings State
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'مكتبة البرومبتات',
    siteSubtitle: 'منصة البرومبتات العربية المتخصصة',
    telegramChannelUrl: 'https://t.me/PromptArabic',
    twitterUrl: 'https://x.com',
    whatsappUrl: 'https://wa.me',
    metaDescription: 'مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة، مع إمكانية النسخ والتحميل والمشاركة بسهولة.'
  });

  // Admin Auth State (HttpOnly Cookie)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Theme State (Dark/Light mode stored in localStorage)
  const [theme, setTheme] = useState('dark');

  // Navigation & UI States
  const [currentPage, setCurrentPage] = useState('home');
  const [currentPromptSlug, setCurrentPromptSlug] = useState(null);
  const [adminTab, setAdminTab] = useState('overview');
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [publishedSuccessModal, setPublishedSuccessModal] = useState(null);
  const [deleteConfirmPromptId, setDeleteConfirmPromptId] = useState(null);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Data States
  const [prompts, setPrompts] = useState(INITIAL_PROMPTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [toasts, setToasts] = useState([]);

  // Initial Load & Auth Session Check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('prompt_arabic_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    async function initData() {
      setLoading(true);
      try {
        const [promptsData, categoriesData, settingsData, isAdmin] = await Promise.all([
          getPromptsAction({ status: 'all' }),
          getCategoriesAction(),
          getSettingsAction(),
          verifyAdminSession()
        ]);

        if (promptsData && promptsData.length > 0) setPrompts(promptsData);
        if (categoriesData && categoriesData.length > 0) setCategories(categoriesData);
        if (settingsData) setSiteSettings(settingsData);
        setIsAdminAuthenticated(isAdmin);
      } catch (err) {
        console.error('Error initializing data from Neon DB:', err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  // Theme Sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('prompt_arabic_theme', theme);
    }
  }, [theme]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Admin Login Handler
  const loginAdmin = async (email, password) => {
    const res = await loginAdminAction(email, password);
    if (!res.success) {
      showToast(res.error || 'بيانات الدخول غير صحيحة', 'warning');
      return false;
    }
    setIsAdminAuthenticated(true);
    showToast('تم تسجيل الدخول بنجاح ✓', 'success');
    return true;
  };

  // Admin Logout Handler
  const logoutAdmin = async () => {
    await logoutAdminAction();
    setIsAdminAuthenticated(false);
    showToast('تم تسجيل الخروج', 'info');
    setCurrentPage('home');
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation
  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    if (params.slug) {
      setCurrentPromptSlug(params.slug);
      const prompt = prompts.find(p => p.slug === params.slug);
      if (prompt) {
        incrementViews(prompt.id);
      }
    }
    if (params.adminTab) {
      setAdminTab(params.adminTab);
    }
    if (params.editingPrompt !== undefined) {
      setEditingPrompt(params.editingPrompt);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Atomic Counter Increments (Neon DB + State)
  const incrementViews = (id) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, views: (p.views || 0) + 1 } : p))
    );
    incrementViewsAction(id);
  };

  const incrementCopies = (id) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, copies: (p.copies || 0) + 1 } : p))
    );
    incrementCopiesAction(id);
    showToast('تم نسخ البرومبت ✓', 'success');
  };

  const incrementDownloads = (id) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, downloads: (p.downloads || 0) + 1 } : p))
    );
    incrementDownloadsAction(id);
    showToast('جاري تحميل الملف المرفق...', 'info');
  };

  // Download Blob / File
  const downloadFile = (attachment, promptTitle) => {
    if (!attachment) return;
    const fileName = attachment.name || `${promptTitle}.pdf`;

    if (attachment.url && attachment.url !== '#') {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.target = '_blank';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const sampleContent = `===============================================
  ${siteSettings.siteName}
  الملف المرفق: ${fileName}
  العنوان: ${promptTitle}
===============================================

تم تحميل هذا الملف المرفق بنجاح من ${siteSettings.siteName}.
رابط المنصة: ${getSiteUrl()}
`;

    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Upload File to Vercel Blob API
  const uploadFileToStorage = async (bucketName, file) => {
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل رفع الملف إلى Vercel Blob');
      return { url: data.url, path: data.pathname };
    } catch (err) {
      console.error('Vercel Blob Upload error:', err);
      showToast('تعذر رفع الملف إلى Vercel Blob', 'warning');
      return { url: '#', path: '' };
    }
  };

  // Add Prompt to Neon DB & State
  const addPrompt = async (newPromptData) => {
    const slug = newPromptData.slug || newPromptData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\u0621-\u064A\s-]/g, '')
      .replace(/[\s_]+/g, '-');

    const newEntry = {
      id: Date.now().toString(),
      ...newPromptData,
      slug: slug || `prompt-${Date.now()}`,
      views: 0,
      copies: 0,
      downloads: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPrompts((prev) => [newEntry, ...prev]);
    setPublishedSuccessModal(newEntry);
    showToast('تم نشر البرومبت بنجاح ✓', 'success');

    await createPromptAction(newEntry);
  };

  // Edit Prompt in Neon DB & State
  const updatePrompt = async (id, updatedData) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    showToast('تم حفظ التغييرات بنجاح ✓', 'success');
    setEditingPrompt(null);
    navigate('admin', { adminTab: 'prompts_list' });

    await updatePromptAction(id, updatedData);
  };

  // Delete Prompt
  const confirmDeletePrompt = (id) => {
    setDeleteConfirmPromptId(id);
  };

  const deletePrompt = async (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmPromptId(null);
    showToast('تم حذف البرومبت ✓', 'warning');

    await deletePromptAction(id);
  };

  // Add Category
  const addCategory = async (name, icon = 'Tag') => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const newCat = { id, name, icon };
    setCategories((prev) => [...prev, newCat]);
    showToast('تمت إضافة التصنيف بنجاح ✓', 'success');

    await addCategoryAction(name, icon);
  };

  // Delete Category
  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('تم حذف التصنيف ✓', 'warning');

    await deleteCategoryAction(id);
  };

  // Save Settings
  const savePlatformSettings = async (settingsPayload) => {
    setSiteSettings(settingsPayload);
    showToast('تم حفظ إعدادات المنصة بنجاح ✓', 'success');
    await updateSettingsAction(settingsPayload);
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        siteSettings,
        setSiteSettings: savePlatformSettings,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        theme,
        toggleTheme,
        currentPage,
        currentPromptSlug,
        adminTab,
        editingPrompt,
        setEditingPrompt,
        publishedSuccessModal,
        setPublishedSuccessModal,
        deleteConfirmPromptId,
        setDeleteConfirmPromptId,
        confirmDeletePrompt,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedModel,
        setSelectedModel,
        sortBy,
        setSortBy,
        prompts,
        categories,
        toasts,
        showToast,
        navigate,
        incrementViews,
        incrementCopies,
        incrementDownloads,
        downloadFile,
        addPrompt,
        updatePrompt,
        deletePrompt,
        addCategory,
        deleteCategory,
        uploadFileToStorage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
