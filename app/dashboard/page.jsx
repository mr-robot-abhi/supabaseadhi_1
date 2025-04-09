"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarIcon,
  FileTextIcon,
  BarChart3Icon,
  ClockIcon,
  AlertCircleIcon,
  FolderOpen,
  PlusCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCases, getEvents } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user } = useAuth()
  const isLawyer = user?.role === "lawyer"
  const [cases, setCases] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const casesData = await getCases()
        setCases(casesData)

        const eventsData = await getEvents()
        setEvents(eventsData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show empty state for new users
  if (cases.length === 0) {
    return <EmptyDashboard isLawyer={isLawyer} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          Welcome, {user?.name || "User"}
        </motion.div>
      </div>

      {isLawyer ? <LawyerDashboard cases={cases} events={events} /> : <ClientDashboard cases={cases} events={events} />}
    </div>
  )
}

function EmptyDashboard({ isLawyer }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold"
        >
          Dashboard
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="relative h-40 w-40 mb-6">
          <Image
            src="/images/bg_5.jpg"
            alt="Welcome"
            fill
            className="object-cover rounded-full border-4 border-primary/20"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to Adhivakta</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          {isLawyer
            ? "Your legal practice management dashboard is ready. Start by adding your first case."
            : "Your legal case management dashboard is ready. Your lawyer will add cases for you."}
        </p>

        {isLawyer && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dashboard/cases/new">
              <Button size="lg" className="gap-2">
                <PlusCircle className="h-5 w-5" />
                Add Your First Case
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Quick tips to help you get started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Check your calendar for upcoming events</span>
              </li>
              <li className="flex items-start">
                <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Review case details and documents</span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Set reminders for important deadlines</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful resources for legal professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Legal document templates</span>
              </li>
              <li className="flex items-start">
                <BarChart3Icon className="mr-2 h-5 w-5 text-primary" />
                <span>Case management best practices</span>
              </li>
              <li className="flex items-start">
                <AlertCircleIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Legal research tools</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get help when you need it</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Schedule a training session</span>
              </li>
              <li className="flex items-start">
                <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Read the documentation</span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Contact support for assistance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function LawyerDashboard({ cases, events }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Cases</p>
                <h3 className="text-2xl font-bold">{cases.filter((c) => c.status === "active").length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertCircleIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Cases</p>
                <h3 className="text-2xl font-bold">{cases.filter((c) => c.is_urgent).length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Hearings</p>
                <h3 className="text-2xl font-bold">
                  {
                    events.filter((e) => {
                      const eventDate = new Date(e.date)
                      const today = new Date()
                      const nextWeek = new Date()
                      nextWeek.setDate(today.getDate() + 7)
                      return eventDate >= today && eventDate <= nextWeek && e.type === "hearing"
                    }).length
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BarChart3Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Case Success Rate</p>
                <h3 className="text-2xl font-bold">78%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
            <CardDescription>Your most recently updated cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases.slice(0, 4).map((caseItem) => (
                <Link href={`/dashboard/cases/${caseItem.id}`} key={caseItem.id}>
                  <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-md cursor-pointer transition-colors duration-200">
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{caseItem.title}</p>
                        {caseItem.is_urgent && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.case_type} • {caseItem.court}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(caseItem.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Upcoming Hearings</CardTitle>
            <CardDescription>Your schedule for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((e) => {
                  const eventDate = new Date(e.date)
                  const today = new Date()
                  const nextWeek = new Date()
                  nextWeek.setDate(today.getDate() + 7)
                  return eventDate >= today && eventDate <= nextWeek
                })
                .slice(0, 4)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Case Management Tips</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <ClockIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Schedule regular client updates to maintain communication</span>
              </li>
              <li className="flex items-start">
                <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Keep case documents organized by type and date</span>
              </li>
              <li className="flex items-start">
                <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                <span>Set reminders for important deadlines and court dates</span>
              </li>
            </ul>
            <Button className="mt-2 transition-all duration-200 hover:scale-105">View All Tips</Button>
          </div>
          <div className="relative hidden md:block md:col-span-2 lg:col-span-1">
            <Image
              src="/images/bg_6.jpg"
              alt="Legal workspace"
              width={400}
              height={300}
              className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="relative hidden lg:block">
            <Image
              src="/images/bg_7.jpg"
              alt="Legal gavel"
              width={400}
              height={300}
              className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ClientDashboard({ cases, events }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileTextIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Cases</p>
                <h3 className="text-2xl font-bold">{cases.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Hearings</p>
                <h3 className="text-2xl font-bold">
                  {
                    events.filter((e) => {
                      const eventDate = new Date(e.date)
                      const today = new Date()
                      const nextWeek = new Date()
                      nextWeek.setDate(today.getDate() + 7)
                      return eventDate >= today && eventDate <= nextWeek && e.type === "hearing"
                    }).length
                  }
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <h3 className="text-2xl font-bold">{cases.length * 3}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>My Cases</CardTitle>
            <CardDescription>Your active legal cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cases.map((caseItem) => (
                <Link href={`/dashboard/cases/${caseItem.id}`} key={caseItem.id}>
                  <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded-md cursor-pointer transition-colors duration-200">
                    <div>
                      <p className="font-medium">{caseItem.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.case_type} • {caseItem.court}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next Hearing</p>
                      <p className="text-sm font-medium">
                        {caseItem.hearing_date ? new Date(caseItem.hearing_date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your scheduled hearings and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter((e) => {
                  const eventDate = new Date(e.date)
                  const today = new Date()
                  const nextWeek = new Date()
                  nextWeek.setDate(today.getDate() + 7)
                  return eventDate >= today && eventDate <= nextWeek
                })
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-lg border bg-background p-6 transition-all duration-300 hover:shadow-md hover:border-primary/50"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Understanding Your Legal Process</h3>
            <p className="text-muted-foreground">
              Your lawyer is working diligently on your case. Here's what you can expect in the coming weeks:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  1
                </div>
                <span>Document review and evidence collection</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  2
                </div>
                <span>Preparation of legal arguments</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  3
                </div>
                <span>Court hearing and presentation of case</span>
              </li>
            </ul>
            <Button className="mt-2 transition-all duration-200 hover:scale-105">Learn More</Button>
          </div>
          <div className="relative hidden md:block">
            <Image
              src="/images/bg_4.jpg"
              alt="Law books"
              width={400}
              height={300}
              className="rounded-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
