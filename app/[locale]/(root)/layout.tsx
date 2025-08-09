import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isAuthenticated } from "@/lib/actions/auth.action";
import { Navigation } from "@/components/Navigation";

const Layout = async ({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect(`/${locale}/sign-in`);

  return (
    <div className="root-layout">
      <Navigation />
      {children}
    </div>
  );
};

export default Layout;
