import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Dashboard } from '@/components/Dashboard';

export default async function AdminPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/login');
  }
  
  return (
    <main>
      <h1 className="sr-only">AgentFlowMarketing Admin Dashboard</h1>
      <Dashboard />
    </main>
  );
}
