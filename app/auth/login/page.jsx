import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="grid w-full max-w-[1000px] grid-cols-1 md:grid-cols-2 gap-8 rounded-lg border bg-background shadow">
        <div className="flex flex-col justify-center p-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <h1 className="text-2xl font-bold">Adhivakta</h1>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline underline-offset-4">
              Register
            </Link>
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center bg-muted rounded-r-lg p-8">
          <div className="max-w-md space-y-4 text-center">
            <div className="flex justify-center">
              <div className="relative h-40 w-40">
                <Image src="/images/bg_6.jpg" alt="Law books" fill className="object-cover" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Manage your legal practice efficiently</h2>
            <p className="text-muted-foreground">
              Streamline case management, document handling, and client communications with our comprehensive legal
              practice management solution.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
