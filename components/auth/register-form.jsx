"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { motion } from "framer-motion"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("client")
  const [terms, setTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register, loginWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await register({
        email,
        password,
        name,
        role: accountType,
      })

      if (success) {
        // Redirect is handled in auth context
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      await loginWithGoogle()
      // Redirect is handled by Supabase OAuth
    } catch (error) {
      console.error("Google login error:", error)
      setError("Google login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-500 p-3 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
          className="transition-all duration-200 hover:border-primary focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          className="transition-all duration-200 hover:border-primary focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          className="transition-all duration-200 hover:border-primary focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-type">Account type</Label>
        <Select value={accountType} onValueChange={setAccountType} disabled={isLoading}>
          <SelectTrigger
            id="account-type"
            className="transition-all duration-200 hover:border-primary focus:border-primary"
          >
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lawyer">Lawyer</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" checked={terms} onCheckedChange={setTerms} required disabled={isLoading} />
        <Label htmlFor="terms" className="text-sm font-normal">
          I agree to the terms of service and privacy policy
        </Label>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" className="w-full transition-all duration-200" disabled={isLoading || !terms}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </motion.div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="button"
          variant="outline"
          className="w-full transition-all duration-200"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </motion.div>
    </motion.form>
  )
}
