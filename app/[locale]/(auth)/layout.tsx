import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { Navigation } from "@/components/Navigation";
import { LanguageSelector } from "@/components/LanguageSelector";

const AuthLayout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect(`/${locale}`);

  return (
    <div className="auth-layout">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
