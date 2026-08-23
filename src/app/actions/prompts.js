'use server';

import { db, schema } from '../../db';
import { eq, ilike, or, and, desc, sql } from 'drizzle-orm';
import { verifyAdminSession } from './auth';
import { INITIAL_PROMPTS } from '../../data/initialData';

// 1. Get Prompts List from Neon DB
export async function getPromptsAction({ category = 'all', model = 'all', search = '', sortBy = 'newest', limit = 100, status = 'published' } = {}) {
  if (!process.env.DATABASE_URL) {
    let list = [...INITIAL_PROMPTS];
    if (status !== 'all') list = list.filter(p => p.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.promptText.toLowerCase().includes(q));
    }
    if (category !== 'all') list = list.filter(p => p.category === category || (category === 'ملفات PDF' && p.attachment && p.attachment.type === 'PDF'));
    if (model !== 'all') list = list.filter(p => p.model === model);
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'views') list.sort((a, b) => b.views - a.views);
    if (sortBy === 'copies') list.sort((a, b) => b.copies - a.copies);
    if (sortBy === 'downloads') list.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    return list;
  }

  try {
    const conditions = [];

    if (status !== 'all') {
      conditions.push(eq(schema.prompts.status, status));
    }

    if (category !== 'all') {
      conditions.push(eq(schema.prompts.categoryName, category));
    }

    if (model !== 'all') {
      conditions.push(eq(schema.prompts.model, model));
    }

    if (search.trim()) {
      conditions.push(
        or(
          ilike(schema.prompts.title, `%${search}%`),
          ilike(schema.prompts.shortDescription, `%${search}%`),
          ilike(schema.prompts.promptText, `%${search}%`)
        )
      );
    }

    let orderBy = desc(schema.prompts.createdAt);
    if (sortBy === 'views') orderBy = desc(schema.prompts.viewsCount);
    if (sortBy === 'copies') orderBy = desc(schema.prompts.copiesCount);
    if (sortBy === 'downloads') orderBy = desc(schema.prompts.downloadsCount);

    const data = await db.query.prompts.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: orderBy,
      limit: limit,
      with: {
        attachments: true
      }
    });

    return (data || []).map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      shortDesc: p.shortDescription,
      fullDesc: p.description,
      promptText: p.promptText,
      category: p.categoryName,
      model: p.model,
      coverImage: p.coverImage,
      status: p.status === 'published' ? 'منشور' : 'مسودة',
      views: p.viewsCount || 0,
      copies: p.copiesCount || 0,
      downloads: p.downloadsCount || 0,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      attachment: p.attachments && p.attachments.length > 0 ? {
        id: p.attachments[0].id,
        name: p.attachments[0].fileName,
        type: p.attachments[0].fileType,
        size: p.attachments[0].fileSize,
        url: p.attachments[0].fileUrl
      } : null
    }));
  } catch (err) {
    console.error('Error fetching prompts from Neon DB:', err);
    return INITIAL_PROMPTS;
  }
}

// 2. Get Single Prompt by Slug from Neon DB
export async function getPromptBySlugAction(slug) {
  if (!process.env.DATABASE_URL) {
    return INITIAL_PROMPTS.find(p => p.slug === slug) || INITIAL_PROMPTS[0];
  }

  try {
    const data = await db.query.prompts.findFirst({
      where: eq(schema.prompts.slug, slug),
      with: {
        attachments: true
      }
    });

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      shortDesc: data.shortDescription,
      fullDesc: data.description,
      promptText: data.promptText,
      category: data.categoryName,
      model: data.model,
      coverImage: data.coverImage,
      status: data.status === 'published' ? 'منشور' : 'مسودة',
      views: data.viewsCount || 0,
      copies: data.copiesCount || 0,
      downloads: data.downloadsCount || 0,
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      attachment: data.attachments && data.attachments.length > 0 ? {
        id: data.attachments[0].id,
        name: data.attachments[0].fileName,
        type: data.attachments[0].fileType,
        size: data.attachments[0].fileSize,
        url: data.attachments[0].fileUrl
      } : null
    };
  } catch (err) {
    console.error('Error getting prompt by slug:', err);
    return null;
  }
}

// 3. Create Prompt Action (Protected Admin)
export async function createPromptAction(promptData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح للوصول لهذه العملية' };
  }

  try {
    const slug = promptData.slug || promptData.title.toLowerCase().trim().replace(/[^\w\u0621-\u064A\s-]/g, '').replace(/[\s_]+/g, '-');

    if (process.env.DATABASE_URL) {
      const [newPrompt] = await db.insert(schema.prompts).values({
        title: promptData.title,
        slug: slug,
        shortDescription: promptData.shortDesc,
        description: promptData.fullDesc || '',
        promptText: promptData.promptText,
        categoryName: promptData.category,
        model: promptData.model,
        coverImage: promptData.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        status: promptData.status === 'مسودة' ? 'draft' : 'published',
        keywords: promptData.keywords || []
      }).returning();

      if (promptData.hasAttachment && promptData.attachment) {
        await db.insert(schema.attachments).values({
          promptId: newPrompt.id,
          fileName: promptData.attachmentName || `${promptData.title}.pdf`,
          fileUrl: promptData.attachmentUrl || '#',
          fileType: promptData.attachmentType || 'PDF',
          fileSize: promptData.attachmentSize || '2.0 ميجابايت',
          blobPath: promptData.blobPath || ''
        });
      }

      return { success: true, prompt: newPrompt };
    }

    return { success: true };
  } catch (err) {
    console.error('Create prompt action error:', err);
    return { success: false, error: err.message };
  }
}

// 4. Update Prompt Action (Protected Admin)
export async function updatePromptAction(id, promptData) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح للوصول لهذه العملية' };
  }

  try {
    if (process.env.DATABASE_URL) {
      await db.update(schema.prompts).set({
        title: promptData.title,
        slug: promptData.slug,
        shortDescription: promptData.shortDesc,
        description: promptData.fullDesc,
        promptText: promptData.promptText,
        categoryName: promptData.category,
        model: promptData.model,
        coverImage: promptData.coverImage,
        status: promptData.status === 'مسودة' ? 'draft' : 'published',
        updatedAt: new Date()
      }).where(eq(schema.prompts.id, id));

      if (promptData.hasAttachment && promptData.attachment) {
        await db.delete(schema.attachments).where(eq(schema.attachments.promptId, id));
        await db.insert(schema.attachments).values({
          promptId: id,
          fileName: promptData.attachmentName || `${promptData.title}.pdf`,
          fileUrl: promptData.attachmentUrl || '#',
          fileType: promptData.attachmentType || 'PDF',
          fileSize: promptData.attachmentSize || '2.0 ميجابايت',
          blobPath: promptData.blobPath || ''
        });
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Update prompt action error:', err);
    return { success: false, error: err.message };
  }
}

// 5. Delete Prompt Action (Protected Admin)
export async function deletePromptAction(id) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return { success: false, error: 'غير مصرح للوصول لهذه العملية' };
  }

  try {
    if (process.env.DATABASE_URL) {
      await db.delete(schema.attachments).where(eq(schema.attachments.promptId, id));
      await db.delete(schema.prompts).where(eq(schema.prompts.id, id));
    }
    return { success: true };
  } catch (err) {
    console.error('Delete prompt action error:', err);
    return { success: false, error: err.message };
  }
}

// 6. Increment Counters (Server-side Atomic)
export async function incrementViewsAction(id) {
  if (!process.env.DATABASE_URL || !id) return;
  try {
    await db.update(schema.prompts)
      .set({ viewsCount: sql`${schema.prompts.viewsCount} + 1` })
      .where(eq(schema.prompts.id, id));
  } catch (e) {}
}

export async function incrementCopiesAction(id) {
  if (!process.env.DATABASE_URL || !id) return;
  try {
    await db.update(schema.prompts)
      .set({ copiesCount: sql`${schema.prompts.copiesCount} + 1` })
      .where(eq(schema.prompts.id, id));
  } catch (e) {}
}

export async function incrementDownloadsAction(id) {
  if (!process.env.DATABASE_URL || !id) return;
  try {
    await db.update(schema.prompts)
      .set({ downloadsCount: sql`${schema.prompts.downloadsCount} + 1` })
      .where(eq(schema.prompts.id, id));
  } catch (e) {}
}
