'use server';

import { db, schema } from '../../db';
import { verifyAdminSession } from './auth';

const defaultSettings = {
  siteName: 'مكتبة البرومبتات',
  siteSubtitle: 'منصة البرومبتات العربية المتخصصة',
  telegramChannelUrl: 'https://t.me/PromptArabic',
  twitterUrl: 'https://x.com',
  whatsappUrl: 'https://wa.me',
  metaDescription: 'مكتبة عربية متجددة تضم برومبتات جاهزة للذكاء الاصطناعي، مرتبة حسب المجال والأداة، مع إمكانية النسخ والتحميل والمشاركة بسهولة.'
};

export async function getSettingsAction() {
  if (!process.env.DATABASE_URL) return defaultSettings;

  try {
    const list = await db.query.settings.findMany({ limit: 1 });
    if (!list || list.length === 0) return defaultSettings;

    const data = list[0];
    return {
      siteName: data.siteName || defaultSettings.siteName,
      siteSubtitle: data.siteSubtitle || defaultSettings.siteSubtitle,
      telegramChannelUrl: data.telegramUrl || defaultSettings.telegramChannelUrl,
      twitterUrl: data.xUrl || defaultSettings.twitterUrl,
      whatsappUrl: data.whatsappUrl || defaultSettings.whatsappUrl,
      metaDescription: data.siteDescription || defaultSettings.metaDescription
    };
  } catch (e) {
    return defaultSettings;
  }
}

export async function updateSettingsAction(payload) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) return { success: false, error: 'غير مصرح' };

  try {
    if (process.env.DATABASE_URL) {
      const list = await db.query.settings.findMany({ limit: 1 });
      if (list && list.length > 0) {
        await db.update(schema.settings).set({
          siteName: payload.siteName,
          siteSubtitle: payload.siteSubtitle,
          telegramUrl: payload.telegramChannelUrl,
          xUrl: payload.twitterUrl,
          whatsappUrl: payload.whatsappUrl,
          siteDescription: payload.metaDescription,
          updatedAt: new Date()
        });
      } else {
        await db.insert(schema.settings).values({
          siteName: payload.siteName,
          siteSubtitle: payload.siteSubtitle,
          telegramUrl: payload.telegramChannelUrl,
          xUrl: payload.twitterUrl,
          whatsappUrl: payload.whatsappUrl,
          siteDescription: payload.metaDescription
        });
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
