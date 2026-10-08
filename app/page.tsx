import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.profile?.onboardingDone) redirect('/onboarding');
  redirect('/dashboard');
}
