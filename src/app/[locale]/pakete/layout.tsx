import { Metadata } from 'next';
import { pageSEO, generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = pageSEO.pakete[locale] || pageSEO.pakete.de;
  return generatePageMetadata({ ...seo, path: '/pakete', locale });
}

export default function PaketeLayout({ children }: Props) {
  return children;
}
