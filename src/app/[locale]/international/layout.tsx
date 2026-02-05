import { Metadata } from 'next';
import { pageSEO, generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = pageSEO.international[locale] || pageSEO.international.de;
  return generatePageMetadata({ ...seo, path: '/international', locale });
}

export default function Layout({ children }: Props) {
  return children;
}
