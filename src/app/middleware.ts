import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  // This call may update the response with refreshed tokens (e.g. Set-Cookie)
  await supabase.auth.getSession();

  return res; // ✅ Make sure to return the updated response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
