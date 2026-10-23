import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function ManasikRedirect() {
  const cookieStore = await cookies()
  const demoRole = cookieStore.get('demo_role')?.value
  if (demoRole === 'muthawif') {
    redirect('/dashboard/muthawif/manasik')
  }
  redirect('/dashboard/jamaah/manasik')
}
