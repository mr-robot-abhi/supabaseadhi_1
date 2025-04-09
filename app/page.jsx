import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <span className="text-xl font-bold">Adhivakta</span>
        </div>
        <nav className="ml-auto flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Modern Legal Case Management for the Digital Age
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Streamline your legal practice with our comprehensive case management solution. Manage cases,
                    documents, and client communications all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button size="lg" className="px-8">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] bg-muted rounded-lg overflow-hidden">
                  <Image src="/images/bg_5.jpg" alt="Legal library" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Powerful Features for Legal Professionals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                  Everything you need to manage your legal practice efficiently and effectively.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-full mb-8 flex justify-center">
                <div className="relative h-60 w-full max-w-2xl rounded-lg overflow-hidden">
                  <Image src="/images/bg_7.jpg" alt="Legal gavel" fill className="object-cover" />
                </div>
              </div>
              {[
                {
                  title: "Case Management",
                  description: "Organize and track all your cases in one place with customizable fields and statuses.",
                },
                {
                  title: "Document Management",
                  description: "Store, organize, and quickly retrieve all case-related documents securely.",
                },
                {
                  title: "Client Portal",
                  description: "Provide clients with secure access to their case information and documents.",
                },
                {
                  title: "Calendar & Deadlines",
                  description: "Never miss important dates with integrated calendar and deadline tracking.",
                },
                {
                  title: "Time & Billing",
                  description: "Track billable hours and generate invoices directly from the platform.",
                },
                {
                  title: "Reporting & Analytics",
                  description: "Gain insights into your practice with customizable reports and analytics.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-center text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              A
            </div>
            <span className="text-lg font-semibold">Adhivakta</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left md:ml-auto">
            © 2023 Adhivakta Legal Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
