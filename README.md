# 🚀 منصة مكتبة البرومبتات (Prompt Arabic) - Full Stack Next.js, Neon Postgres & Vercel Blob

تطبيق شبكي متكامل (Full-Stack Production App) يعمل بالكامل ضمن **منظومة Vercel المباشرة** دون الحاجة إلى Supabase:

- **Framework:** Next.js (App Router)
- **Database:** Neon Postgres (عبر Vercel Marketplace) باستخدام **Drizzle ORM**
- **Storage:** Vercel Blob (`@vercel/blob`) لتخزين الصور والملفات المرفقة (PDF, DOCX, XLSX, ZIP)
- **Auth:** مصادقة جلسات محشوة بـ HttpOnly Secure Cookies مع تشفير `bcrypt` لكلمات المرور
- **Metadata & OpenGraph:** SSR Dynamic Meta (`generateMetadata`) جاهز لبوتات Telegram وWhatsApp وX وFacebook وLinkedIn

---

## 🛠️ البنية التقنية لقاعدة البيانات والجداول (Drizzle ORM)

تم بناء Schema الهيكل داخل الملف [`src/db/schema.js`](./src/db/schema.js) والجداول كالتالي:
1. `prompts`: تفاصيل البرومبت، النماذج، العدادات (`views_count`, `copies_count`, `downloads_count`) والحالة (`published`/`draft`).
2. `categories`: التصنيفات والأيقونات.
3. `attachments`: الملفات المرفقة ورابط Vercel Blob و `blob_path`.
4. `settings`: اسم الموقع والشعار والتواصل.
5. `admins`: حساب الإدارة و `password_hash` مشفر بـ `bcrypt`.

---

## 📋 خطوات الإعداد والنشر على Vercel (من البداية إلى النهاية)

### 1. ربط المشروع بـ Vercel
1. ارفع المشروع إلى **GitHub Repository**.
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard) واضغط **"Add New Project"**.
3. قم باستيراد المستودع.

### 2. إضافة Neon Postgres من Vercel Marketplace
1. في صفحة المشروع على Vercel، اذهب إلى تبويب **Storage** أو **Marketplace**.
2. اختر **Neon Postgres** واضغط **Connect**.
3. سيتم إنشاء متغير البيئة `DATABASE_URL` تلقائياً داخل Vercel.

### 3. إضافة Vercel Blob
1. في نفس التبويب **Storage** على Vercel، اضغط **Create Database** > اختر **Blob**.
2. سمّ الـ Storage (مثلاً `prompt-files-blob`) واضغط **Create**.
3. سيتم إنشاء متغير البيئة `BLOB_READ_WRITE_TOKEN` تلقائياً داخل Vercel.

### 4. إضافة متغير البيئة للمصادقة
في إعدادات Vercel (**Environment Variables**)، أضف:
- `AUTH_SECRET`: نص عشوائي قوي مكون من 32 حرفاً لجلسات الأمان.
- `NEXT_PUBLIC_SITE_URL`: رابط Vercel المباشر للموقع.

### 5. تشغيل Migration و Seed لقاعدة بيانات Neon
يمكنك تشغيل الأوامر محلياً أو من خلال Vercel Build Command:

```bash
# إنشاء ملفات المايجريشن
npm run db:generate

# رفع الجداول إلى Neon Postgres
npm run db:migrate

# تعبئة الحساب الإداري (admin@prompt.local / Admin123) والبيانات العربية
npm run db:seed
```

---

## 💻 التشغيل المحلي (Local Development)

```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير المحلي
npm run dev

# بناء النسخة الإنتاجية والتحقق من الأخطاء
npm run build
```

الموقع متاح محلياً على: [http://localhost:3000](http://localhost:3000)

- **بيانات دخول الأدمن التجريبية:** `admin@prompt.local` / `Admin123`
