'use client';

import React, { Suspense } from 'react';
import { PromptsList } from '../../components/PromptsList';

export default function PromptsGalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>جاري تحميل البرومبتات...</p>
        </div>
      }
    >
      <PromptsList />
    </Suspense>
  );
}
