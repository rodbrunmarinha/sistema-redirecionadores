import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(req: NextRequest) {
  // Update user session from Supabase
  const res = await updateSession(req)
  if (res.status !== 200) {
    // If updateSession returns a redirect or something else, return it
    // Actually updateSession might just return NextResponse.next()
  }

  const url = req.nextUrl
  
  // Get hostname of request (e.g. demo.cndck.com.br, demo.localhost:3000)
  const hostname = req.headers.get('host') || ''

  // Determine if we are on local or production
  // We consider any domain that contains localhost as local
  // For production, the base domain could be cndck.com.br
  const isLocal = hostname.includes('localhost')

  // We want to extract the subdomain
  // For `demo.localhost:3000`, subdomain is `demo`
  // For `demo.cndck.com.br`, subdomain is `demo`
  
  // A simple way is to remove the base domain
  const baseDomain = isLocal 
    ? (hostname.includes(':') ? `localhost:${hostname.split(':')[1]}` : 'localhost')
    : 'dockdrop.com.br' // Fixed to the actual production domain
    
  let subdomain = null;
  
  // Ex: geekstorm.localhost:3000 -> geekstorm
  if (hostname.endsWith(`.${baseDomain}`)) {
    subdomain = hostname.replace(`.${baseDomain}`, '')
  }

  // If there's a valid subdomain and it's not 'www'
  if (subdomain && subdomain !== 'www') {
    // Rewrite the path to our dynamic tenant folder
    // Ex: geekstorm.localhost:3000/admin/login -> /tenant/geekstorm/admin/login
    return NextResponse.rewrite(new URL(`/tenant/${subdomain}${url.pathname}${url.search}`, req.url))
  }

  return NextResponse.next()
}
