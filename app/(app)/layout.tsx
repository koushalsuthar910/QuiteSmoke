import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import BottomNav from '@/components/BottomNav';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.profile?.onboardingDone) redirect('/onboarding');
  return (
    <div className="min-h-dvh pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
