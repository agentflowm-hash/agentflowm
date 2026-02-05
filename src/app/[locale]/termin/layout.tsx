import { Metadata } from 'next';
import { pageSEO, generatePageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = pageSEO.termin[locale] || pageSEO.termin.de;
  return generatePageMetadata({ ...seo, path: '/termin', locale });
}

export default function Layout({ children }: Props) {
  return children;
}
