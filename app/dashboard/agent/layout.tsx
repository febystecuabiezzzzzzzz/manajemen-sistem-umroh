import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { ToastProvider } from '@/components/Toast'
import { Footer } from '@/components/Footer'

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('demo_role')?.value

  let profile = { full_name: 'Hasan Basri', role: 'agent' }

  if (!demoRole) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) redirect('/login')

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userProfile) {
        profile = userProfile
      }
    } catch {
      // Fallback for local demo
    }
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
        <Sidebar role="agent" userName={profile.full_name || 'Hasan Basri'} userEmail="agen@example.com" />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar
            userName={profile.full_name || 'Hasan Basri'}
            userRole="Agen / Marketing"
            userEmail="agen@example.com"
            showBranchSelector={false}
          />
          <main className="flex-1 overflow-y-auto flex flex-col bg-[#f8fafc]">
            <div className="p-5 sm:p-6 lg:p-8 flex-1">
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
