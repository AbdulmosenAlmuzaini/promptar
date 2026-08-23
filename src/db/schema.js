import { pgTable, uuid, text, integer, timestamp, json, jsonb } from 'drizzle-orm/pg-core';

// 1. CATEGORIES TABLE
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon').default('Sparkles'),
  createdAt: timestamp('created_at').defaultNow()
});

// 2. PROMPTS TABLE
export const prompts = pgTable('prompts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description').notNull(),
  description: text('description'),
  promptText: text('prompt_text').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  categoryName: text('category_name').notNull().default('التعليم'),
  model: text('model').notNull().default('ChatGPT'),
  coverImage: text('cover_image'),
  status: text('status').notNull().default('published'), // 'published' or 'draft'
  keywords: json('keywords').$type().default([]),
  viewsCount: integer('views_count').default(0).notNull(),
  copiesCount: integer('copies_count').default(0).notNull(),
  downloadsCount: integer('downloads_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at').defaultNow()
});

// 3. ATTACHMENTS TABLE
export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  promptId: uuid('prompt_id').references(() => prompts.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(), // Vercel Blob public URL
  fileType: text('file_type').notNull(),
  fileSize: text('file_size').notNull(),
  blobPath: text('blob_path'),
  createdAt: timestamp('created_at').defaultNow()
});

// 4. SETTINGS TABLE
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  siteName: text('site_name').notNull().default('مكتبة البرومبتات'),
  siteSubtitle: text('site_subtitle').default('منصة البرومبتات العربية المتخصصة'),
  siteDescription: text('site_description').default('مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة، مع إمكانية النسخ والتحميل والمشاركة بسهولة.'),
  logo: text('logo'),
  telegramUrl: text('telegram_url').default('https://t.me/PromptArabic'),
  xUrl: text('x_url').default('https://x.com'),
  whatsappUrl: text('whatsapp_url').default('https://wa.me'),
  updatedAt: timestamp('updated_at').defaultNow()
});

// 5. ADMINS TABLE
export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(), // Hashed using bcryptjs
  createdAt: timestamp('created_at').defaultNow()
});
