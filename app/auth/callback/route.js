import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

      await supabase.auth.exchangeCodeForSession(code)
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin + "/dashboard")
  } catch (error) {
    console.error("Error in auth callback:", error)
    // Redirect to login page if there's an error
    return NextResponse.redirect(new URL("/auth/login", request.url).origin + "/auth/login")
  }
}
