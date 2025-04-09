"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"
        ></motion.div>
      </div>
    )
  }

  // If no user and not loading, redirect to login
  if (!user && !loading) {
    router.push("/auth/login")
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-screen overflow-hidden"
      >
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-muted/20 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
