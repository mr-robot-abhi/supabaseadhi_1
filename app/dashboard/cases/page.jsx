"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample case data
const lawyerCases = [
  {
    id: "case-1",
    title: "Smith v. Johnson",
    number: "CV-2023-1234",
    type: "Civil Litigation",
    client: "John Smith",
    status: "Active",
    court: "Bangalore Urban District Court",
    courtHall: "4",
    courtComplex: "City Civil Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-15",
  },
  {
    id: "case-2",
    title: "Estate of Williams",
    number: "PR-2023-5678",
    type: "Probate",
    client: "Sarah Williams",
    status: "Active",
    court: "Karnataka High Court",
    courtHall: "7",
    courtComplex: "High Court Complex",
    district: "Bangalore Urban",
    nextHearing: null,
  },
  {
    id: "case-3",
    title: "Brown LLC v. Davis Corp",
    number: "CV-2023-9012",
    type: "Corporate",
    client: "Brown LLC",
    status: "Active",
    court: "Commercial Court",
    courtHall: "2",
    courtComplex: "Commercial Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-20",
  },
  {
    id: "case-4",
    title: "Miller Divorce",
    number: "DR-2023-3456",
    type: "Family",
    client: "James Miller",
    status: "Active",
    court: "Family Court",
    courtHall: "3",
    courtComplex: "Family Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-12-18",
  },
  {
    id: "case-5",
    title: "Thompson Bankruptcy",
    number: "BK-2023-7890",
    type: "Bankruptcy",
    client: "Robert Thompson",
    status: "Closed",
    court: "Debt Recovery Tribunal",
    courtHall: "1",
    courtComplex: "DRT Complex",
    district: "Bangalore Rural",
    nextHearing: null,
  },
]

const clientCases = [
  {
    id: "case-1",
    title: "Property Dispute",
    number: "CV-2023-4567",
    type: "Civil",
    status: "Active",
    court: "Bangalore Urban District Court",
    courtHall: "4",
    courtComplex: "City Civil Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-06-15",
  },
  {
    id: "case-2",
    title: "Insurance Claim",
    number: "CC-2023-7890",
    type: "Consumer",
    status: "Active",
    court: "Consumer Court",
    courtHall: "2",
    courtComplex: "Consumer Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-06-22",
  },
  {
    id: "case-3",
    title: "Employment Matter",
    number: "LC-2023-1234",
    type: "Labor",
    status: "Active",
    court: "Labor Court",
    courtHall: "5",
    courtComplex: "Labor Court Complex",
    district: "Bangalore Urban",
    nextHearing: "2023-07-05",
  },
]

export default function CasesPage() {
  const { user } = useAuth()
  const isLawyer = user?.role === "lawyer" || user?.role === "admin"
  const cases = isLawyer ? lawyerCases : clientCases

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [districtFilter, setDistrictFilter] = useState("all")

  // Filter cases based on search and filters
  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.court.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || caseItem.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType = typeFilter === "all" || caseItem.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesDistrict = districtFilter === "all" || caseItem.district.toLowerCase() === districtFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType && matchesDistrict
  })

  // Get unique values for filters
  const caseTypes = ["all", ...new Set(cases.map((c) => c.type.toLowerCase()))]
  const districts = ["all", ...new Set(cases.map((c) => c.district))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cases</h1>
        {isLawyer && (
          <Link href="/dashboard/cases/new">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>{isLawyer ? "All Cases" : "My Cases"}</CardTitle>
              <CardDescription>
                {isLawyer ? "Manage and view all your legal cases" : "View your active legal cases"}
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search cases..."
                  className="pl-8 w-full md:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Case Type" />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={districtFilter} onValueChange={setDistrictFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district === "all" ? "All Districts" : district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Case Title</th>
                  <th className="py-3 text-left font-medium">Case Number</th>
                  <th className="py-3 text-left font-medium">Type</th>
                  {isLawyer && <th className="py-3 text-left font-medium">Client</th>}
                  <th className="py-3 text-left font-medium">Court</th>
                  <th className="py-3 text-left font-medium">Court Hall</th>
                  <th className="py-3 text-left font-medium">District</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Next Hearing</th>
                  <th className="py-3 text-left font-medium sr-only">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">
                      <Link
                        href={`/dashboard/cases/${caseItem.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {caseItem.title}
                      </Link>
                    </td>
                    <td className="py-3">{caseItem.number}</td>
                    <td className="py-3">{caseItem.type}</td>
                    {isLawyer && <td className="py-3">{caseItem.client}</td>}
                    <td className="py-3">{caseItem.court}</td>
                    <td className="py-3">{caseItem.courtHall}</td>
                    <td className="py-3">{caseItem.district}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          caseItem.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
