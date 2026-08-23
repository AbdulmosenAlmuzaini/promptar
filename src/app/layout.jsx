import { Suspense } from 'react';
import '../index.css';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ToastContainer } from '../components/ToastContainer';

export const metadata = {
  title: 'مكتبة البرومبتات | برومبتات ذكاء اصطناعي',
  description: 'مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي لـ ChatGPT وClaude وGemini وGrok وDeepSeek، مرتبة حسب المجال والأداة مع إمكانية النسخ والمشاركة بسهولة.',
  keywords: ['برومبتات', 'ذكاء اصطناعي', 'chatgpt', 'claude', 'gemini', 'deepseek', 'grok', 'تعلم'],
  authors: [{ name: 'مكتبة البرومبتات' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'مكتبة البرومبتات | برومبتات ذكاء اصطناعي',
    description: 'كل البرومبتات التي تحتاجها… في مكان واحد. اكتشف وانسخ وشارك أفضل أوامر الذكاء الاصطناعي.',
    url: '/',
    siteName: 'مكتبة البرومبتات',
    locale: 'ar_SA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مكتبة البرومبتات | برومبتات ذكاء اصطناعي',
    description: 'مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة.'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Suspense fallback={<header className="glass-nav" style={{ height: '72px' }} />}>
              <Header />
            </Suspense>
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <ToastContainer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
