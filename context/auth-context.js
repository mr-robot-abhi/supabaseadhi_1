"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import {
  supabase,
  signIn as supabaseSignIn,
  signInWithGoogle as supabaseSignInWithGoogle,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getProfile as supabaseGetProfile,
} from "@/lib/supabase"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("unauthenticated") // Added status state
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in with Supabase
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          try {
            const profile = await supabaseGetProfile()

            setUser({
              id: session.user.id,
              email: session.user.email,
              name: profile?.name || session.user.user_metadata?.name || "User",
              role: profile?.role || session.user.user_metadata?.role || "client",
            })
          } catch (profileError) {
            console.error("Error fetching profile:", profileError)
            // Set basic user info even if profile fetch fails
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || "User",
              role: session.user.user_metadata?.role || "client",
            })
          }
          setStatus("authenticated")
        } else {
          setUser(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        setStatus("unauthenticated")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const profile = await supabaseGetProfile()

          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.name || session.user.user_metadata?.name || "User",
            role: profile?.role || session.user.user_metadata?.role || "client",
          }

          setUser(userData)
          setStatus("authenticated")

          // Role-based redirect
          if (userData.role === "lawyer") {
            router.push("/dashboard")
          } else {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Error setting user after sign in:", error)
          // Set basic user info even if profile fetch fails
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || "User",
            role: session.user.user_metadata?.role || "client",
          })
          setStatus("authenticated")

          // Still redirect to dashboard even if profile fetch fails
          router.push("/dashboard")
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setStatus("unauthenticated")
        router.push("/auth/login")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const login = async (email, password) => {
    try {
      const { session } = await supabaseSignIn(email, password)

      if (!session) {
        throw new Error("Login failed")
      }

      try {
        const profile = await supabaseGetProfile()

        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.user_metadata?.name || "User",
          role: profile?.role || session.user.user_metadata?.role || "client",
        }

        setUser(userData)
        setStatus("authenticated")

        // Role-based redirect
        if (userData.role === "lawyer") {
          router.push("/dashboard")
        } else {
          router.push("/dashboard")
        }
      } catch (profileError) {
        console.error("Error fetching profile during login:", profileError)
        // Set basic user info even if profile fetch fails
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || "User",
          role: session.user.user_metadata?.role || "client",
        })
        setStatus("authenticated")

        // Still redirect to dashboard
        router.push("/dashboard")
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const loginWithGoogle = async () => {
    try {
      await supabaseSignInWithGoogle()
      return true
    } catch (error) {
      console.error("Google login error:", error)
      return false
    }
  }

  const register = async (userData) => {
    try {
      const { session } = await supabaseSignUp(
        userData.email,
        userData.password,
        userData.name || "New User",
        userData.role || "client",
      )

      if (!session) {
        // For Supabase email confirmation flow, we might not get a session immediately
        return true
      }

      try {
        const profile = await supabaseGetProfile()

        const userInfo = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.name || session.user.user_metadata?.name || userData.name || "New User",
          role: profile?.role || session.user.user_metadata?.role || userData.role || "client",
        }

        setUser(userInfo)
        setStatus("authenticated")

        // Role-based redirect
        if (userInfo.role === "lawyer") {
          router.push("/dashboard")
        } else {
          router.push("/dashboard")
        }
      } catch (profileError) {
        console.error("Error fetching profile during registration:", profileError)
        // Set basic user info even if profile fetch fails
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: userData.name || "New User",
          role: userData.role || "client",
        })
        setStatus("authenticated")

        // Still redirect to dashboard
        router.push("/dashboard")
      }

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabaseSignOut()
      setUser(null)
      setStatus("unauthenticated")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
