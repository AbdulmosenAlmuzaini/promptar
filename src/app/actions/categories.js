'use server';

import { db, schema } from '../../db';
import { eq } from 'drizzle-orm';
import { verifyAdminSession } from './auth';
import { INITIAL_CATEGORIES } from '../../data/initialData';

export async function getCategoriesAction() {
  if (!process.env.DATABASE_URL) return INITIAL_CATEGORIES;

  try {
    const list = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.createdAt)]
    });

    if (!list || list.length === 0) return INITIAL_CATEGORIES;

    return [
      { id: 'all', name: 'الكل', icon: 'Sparkles' },
      ...list.map(c => ({ id: c.slug || c.id, name: c.name, icon: c.icon || 'Tag' }))
    ];
  } catch (err) {
    console.error('Error fetching categories from Neon DB:', err);
    return INITIAL_CATEGORIES;
  }
}

export async function addCategoryAction(name, icon = 'Tag') {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'غير مصرح' };

  try {
    const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
    if (process.env.DATABASE_URL) {
      await db.insert(schema.categories).values({
        name,
        slug,
        icon
      });
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteCategoryAction(id) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'غير مصرح' };

  try {
    if (process.env.DATABASE_URL) {
      await db.delete(schema.categories).where(eq(schema.categories.slug, id));
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
