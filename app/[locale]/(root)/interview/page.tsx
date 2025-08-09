import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user.name}
        userId={user.id}
        profileImage={user.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;
