import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import * as schema from './schema.js';
import { INITIAL_PROMPTS, INITIAL_CATEGORIES } from '../data/initialData.js';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  console.log('🌱 Starting Neon Postgres Database Seeding...');
  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  // 1. Seed Admin User
  const adminEmail = 'admin@prompt.local';
  const plainPassword = 'Admin123';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  console.log('👤 Seeding Admin User (admin@prompt.local)...');
  await db.insert(schema.admins).values({
    email: adminEmail,
    passwordHash: passwordHash
  }).onConflictDoNothing({ target: schema.admins.email });

  // 2. Seed Settings
  console.log('⚙️ Seeding Platform Settings...');
  await db.insert(schema.settings).values({
    siteName: 'مكتبة البرومبتات',
    siteSubtitle: 'منصة البرومبتات العربية المتخصصة',
    siteDescription: 'مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة، مع إمكانية النسخ والتحميل والمشاركة بسهولة.',
    telegramUrl: 'https://t.me/PromptArabic',
    xUrl: 'https://x.com',
    whatsappUrl: 'https://wa.me'
  });

  // 3. Seed Categories
  console.log('📁 Seeding Categories...');
  for (const cat of INITIAL_CATEGORIES) {
    if (cat.id === 'all') continue;
    await db.insert(schema.categories).values({
      name: cat.name,
      slug: cat.id,
      icon: cat.icon || 'Sparkles'
    }).onConflictDoNothing({ target: schema.categories.slug });
  }

  // 4. Seed Prompts
  console.log('🔥 Seeding Prompts...');
  for (const p of INITIAL_PROMPTS) {
    const insertedPrompts = await db.insert(schema.prompts).values({
      title: p.title,
      slug: p.slug,
      shortDescription: p.shortDesc,
      description: p.fullDesc || '',
      promptText: p.promptText,
      categoryName: p.category,
      model: p.model,
      coverImage: p.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      status: 'published',
      keywords: p.keywords || [],
      viewsCount: p.views || 0,
      copiesCount: p.copies || 0,
      downloadsCount: p.downloads || 0
    }).onConflictDoNothing({ target: schema.prompts.slug }).returning();

    // Attachments
    if (p.attachment && insertedPrompts.length > 0) {
      await db.insert(schema.attachments).values({
        promptId: insertedPrompts[0].id,
        fileName: p.attachment.name,
        fileUrl: '#',
        fileType: p.attachment.type,
        fileSize: p.attachment.size,
        blobPath: 'sample.pdf'
      });
    }
  }

  console.log('✅ Database Seed Completed Successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
