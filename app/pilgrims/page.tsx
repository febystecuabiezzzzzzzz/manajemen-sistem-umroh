import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function PilgrimsRedirect() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('demo_role')?.value
  if (demoRole === 'muthawif') {
    redirect('/dashboard/muthawif/jamaah')
  }
  redirect('/dashboard/agent/jamaah')
}
