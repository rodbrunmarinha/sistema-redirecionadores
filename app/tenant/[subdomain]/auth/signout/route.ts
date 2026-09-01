import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  // Obter o host real da requisição (preservando o subdomínio mesmo após o rewrite do middleware)
  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  
  return NextResponse.redirect(new URL('/admin/login', `${protocol}://${host}`), {
    status: 303,
  })
}
