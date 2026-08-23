import { getPromptBySlugAction } from '../../actions/prompts';
import { PromptDetail } from '../../../components/PromptDetail';
import { NotFoundView } from '../../../components/NotFoundView';

// Dynamic SSR OpenGraph Meta Generator from Neon Postgres (Telegram, WhatsApp, X, FB, LinkedIn scrapers)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const prompt = await getPromptBySlugAction(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!prompt) {
    return {
      title: 'البرومبت غير موجود | مكتبة البرومبتات',
      description: 'البرومبت المطلوب غير موجود أو تم نقله.'
    };
  }

  const promptUrl = `${siteUrl}/prompts/${prompt.slug}`;
  const ogImage = prompt.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80';

  return {
    title: `${prompt.title} | مكتبة البرومبتات`,
    description: prompt.shortDesc,
    alternates: {
      canonical: promptUrl
    },
    openGraph: {
      title: prompt.title,
      description: prompt.shortDesc,
      url: promptUrl,
      siteName: 'مكتبة البرومبتات',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: prompt.title
        }
      ],
      locale: 'ar_SA',
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: prompt.title,
      description: prompt.shortDesc,
      images: [ogImage]
    }
  };
}

export default async function PromptDetailPage({ params }) {
  const { slug } = await params;
  const prompt = await getPromptBySlugAction(slug);

  if (!prompt) {
    return <NotFoundView />;
  }

  return <PromptDetail initialPrompt={prompt} />;
}
