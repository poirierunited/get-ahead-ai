import InterviewForm from '@/components/InterviewForm';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <>
      <h3>{t('interview.title')}</h3>
      <InterviewForm locale={locale} userId={user.id} />
    </>
  );
};

export default Page;
