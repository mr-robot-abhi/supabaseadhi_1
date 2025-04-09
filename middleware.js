import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Public paths that don't require authentication
    const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/callback", "/api/auth"]

    const isPublicPath = publicPaths.some(
      (path) => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path + "/"),
    )

    // If user is not signed in and the current path is not public, redirect to login
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    // If user is signed in and the current path is login or register, redirect to dashboard
    if (session && (req.nextUrl.pathname === "/auth/login" || req.nextUrl.pathname === "/auth/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to continue
    // This prevents authentication errors from blocking the entire site
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api/auth).*)"],
}
