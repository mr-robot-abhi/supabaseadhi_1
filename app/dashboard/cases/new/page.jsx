"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { createCase } from "@/lib/supabase"
import Image from "next/image"

// Karnataka Judiciary Case Types
const CASE_TYPES = [
  { value: "civil", label: "Civil" },
  { value: "criminal", label: "Criminal" },
  { value: "family", label: "Family" },
  { value: "labour", label: "Labour" },
  { value: "revenue", label: "Revenue" },
  { value: "motor_accident", label: "Motor Accident Claims" },
  { value: "commercial", label: "Commercial" },
  { value: "writ", label: "Writ Petition" },
  { value: "appeal", label: "Appeal" },
  { value: "revision", label: "Revision" },
  { value: "execution", label: "Execution" },
  { value: "arbitration", label: "Arbitration" },
  { value: "other", label: "Other" },
]

// Karnataka Benches
const BENCHES = [
  { value: "bengaluru", label: "Bengaluru" },
  { value: "dharwad", label: "Dharwad" },
  { value: "kalaburagi", label: "Kalaburagi" },
]

// Court Types
const COURT_TYPES = [
  { value: "district_court", label: "District Court" },
  { value: "high_court", label: "High Court" },
  { value: "family_court", label: "Family Court" },
  { value: "consumer_court", label: "Consumer Court" },
  { value: "labour_court", label: "Labour Court" },
  { value: "sessions_court", label: "Sessions Court" },
  { value: "civil_court", label: "Civil Court" },
  { value: "magistrate_court", label: "Magistrate Court" },
  { value: "special_court", label: "Special Court" },
]

// Karnataka Districts
const DISTRICTS = [
  { value: "bengaluru_urban", label: "Bengaluru Urban" },
  { value: "bengaluru_rural", label: "Bengaluru Rural" },
  { value: "mysuru", label: "Mysuru" },
  { value: "mangaluru", label: "Mangaluru" },
  { value: "belagavi", label: "Belagavi" },
  { value: "kalaburagi", label: "Kalaburagi" },
  { value: "dharwad", label: "Dharwad" },
  { value: "tumakuru", label: "Tumakuru" },
  { value: "shivamogga", label: "Shivamogga" },
  { value: "vijayapura", label: "Vijayapura" },
  { value: "davanagere", label: "Davanagere" },
  { value: "ballari", label: "Ballari" },
  { value: "udupi", label: "Udupi" },
  { value: "raichur", label: "Raichur" },
  { value: "hassan", label: "Hassan" },
]

export default function NewCasePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLawyer, setIsLawyer] = useState(true)

  useEffect(() => {
    // Check if user is lawyer or client
    if (user) {
      setIsLawyer(user.role === "lawyer")
    }
  }, [user])

  const [caseData, setCaseData] = useState({
    title: "",
    caseNumber: "",
    caseType: "",
    bench: "bengaluru",
    courtType: "",
    court: "",
    courtHall: "",
    courtComplex: "",
    district: "bengaluru_urban",
    filingDate: new Date(),
    hearingDate: null,
    client: "",
    clientType: "individual",
    opposingParty: "",
    opposingCounsel: "",
    description: "",
    status: "active",
    priority: "normal",
    isUrgent: false,
    caseStage: "filing",
    actSections: "",
    reliefSought: "",
    judgeName: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setCaseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setCaseData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name, date) => {
    setCaseData((prev) => ({ ...prev, [name]: date }))
  }

  const handleCheckboxChange = (name, checked) => {
    setCaseData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to Supabase
      await createCase(caseData)

      // Navigate back to cases list
      router.push("/dashboard/cases")
    } catch (error) {
      console.error("Error saving case:", error)
      alert("There was an error saving the case. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Case</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="court">Court Information</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Case Information</CardTitle>
                  <CardDescription>Enter the basic details about the case</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="case-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Case Title</Label>
                        <Input id="title" name="title" value={caseData.title} onChange={handleChange} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="caseNumber">Case Number</Label>
                        <Input
                          id="caseNumber"
                          name="caseNumber"
                          value={caseData.caseNumber}
                          onChange={handleChange}
                          placeholder="e.g., CRL/123/2023"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="caseType">Case Type</Label>
                        <Select
                          value={caseData.caseType}
                          onValueChange={(value) => handleSelectChange("caseType", value)}
                          required
                        >
                          <SelectTrigger id="caseType">
                            <SelectValue placeholder="Select case type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CASE_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={caseData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="filingDate">Filing Date</Label>
                        <DatePicker
                          id="filingDate"
                          selected={caseData.filingDate}
                          onSelect={(date) => handleDateChange("filingDate", date)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hearingDate">Next Hearing Date</Label>
                        <DatePicker
                          id="hearingDate"
                          selected={caseData.hearingDate}
                          onSelect={(date) => handleDateChange("hearingDate", date)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={caseData.priority}
                          onValueChange={(value) => handleSelectChange("priority", value)}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="caseStage">Case Stage</Label>
                        <Select
                          value={caseData.caseStage}
                          onValueChange={(value) => handleSelectChange("caseStage", value)}
                        >
                          <SelectTrigger id="caseStage">
                            <SelectValue placeholder="Select case stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="filing">Filing</SelectItem>
                            <SelectItem value="pre_trial">Pre-Trial</SelectItem>
                            <SelectItem value="trial">Trial</SelectItem>
                            <SelectItem value="arguments">Arguments</SelectItem>
                            <SelectItem value="judgment">Judgment</SelectItem>
                            <SelectItem value="appeal">Appeal</SelectItem>
                            <SelectItem value="execution">Execution</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isUrgent"
                        checked={caseData.isUrgent}
                        onCheckedChange={(checked) => handleCheckboxChange("isUrgent", checked)}
                      />
                      <Label htmlFor="isUrgent">Mark as urgent case</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Case Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={caseData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    {isLawyer && (
                      <div className="space-y-2">
                        <Label htmlFor="actSections">Act & Sections</Label>
                        <Textarea
                          id="actSections"
                          name="actSections"
                          value={caseData.actSections}
                          onChange={handleChange}
                          rows={2}
                          placeholder="e.g., IPC Section 302, CrPC Section 161"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="reliefSought">Relief Sought</Label>
                      <Textarea
                        id="reliefSought"
                        name="reliefSought"
                        value={caseData.reliefSought}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Describe the relief sought in this case"
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="court">
              <Card>
                <CardHeader>
                  <CardTitle>Court Information</CardTitle>
                  <CardDescription>Enter details about the court where the case is filed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {isLawyer && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="bench">Bench</Label>
                            <Select
                              value={caseData.bench}
                              onValueChange={(value) => handleSelectChange("bench", value)}
                            >
                              <SelectTrigger id="bench">
                                <SelectValue placeholder="Select bench" />
                              </SelectTrigger>
                              <SelectContent>
                                {BENCHES.map((bench) => (
                                  <SelectItem key={bench.value} value={bench.value}>
                                    {bench.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="courtType">Court Type</Label>
                            <Select
                              value={caseData.courtType}
                              onValueChange={(value) => handleSelectChange("courtType", value)}
                              required
                            >
                              <SelectTrigger id="courtType">
                                <SelectValue placeholder="Select court type" />
                              </SelectTrigger>
                              <SelectContent>
                                {COURT_TYPES.map((court) => (
                                  <SelectItem key={court.value} value={court.value}>
                                    {court.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="court">Court Name</Label>
                            <Input id="court" name="court" value={caseData.court} onChange={handleChange} required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="courtHall">Court Hall Number</Label>
                            <Input id="courtHall" name="courtHall" value={caseData.courtHall} onChange={handleChange} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="courtComplex">Court Complex</Label>
                            <Input
                              id="courtComplex"
                              name="courtComplex"
                              value={caseData.courtComplex}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="judgeName">Judge Name</Label>
                            <Input
                              id="judgeName"
                              name="judgeName"
                              value={caseData.judgeName}
                              onChange={handleChange}
                              placeholder="Hon'ble Justice Name"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={caseData.district}
                        onValueChange={(value) => handleSelectChange("district", value)}
                      >
                        <SelectTrigger id="district">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISTRICTS.map((district) => (
                            <SelectItem key={district.value} value={district.value}>
                              {district.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={caseData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any additional notes about the court or proceedings"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="parties">
              <Card>
                <CardHeader>
                  <CardTitle>Parties Information</CardTitle>
                  <CardDescription>Add client and opposing party details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Client Information</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="client">Client Name</Label>
                          <Input id="client" name="client" value={caseData.client} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientType">Client Type</Label>
                          <Select
                            value={caseData.clientType}
                            onValueChange={(value) => handleSelectChange("clientType", value)}
                          >
                            <SelectTrigger id="clientType">
                              <SelectValue placeholder="Select client type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Opposing Party</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="opposingParty">Opposing Party Name</Label>
                          <Input
                            id="opposingParty"
                            name="opposingParty"
                            value={caseData.opposingParty}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="opposingCounsel">Opposing Counsel</Label>
                          <Input
                            id="opposingCounsel"
                            name="opposingCounsel"
                            value={caseData.opposingCounsel}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Case Documents</CardTitle>
                  <CardDescription>Upload and manage documents related to this case</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Drag and drop files here, or click to select files
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => alert("Document upload functionality is under development.")}
                        >
                          Select Files
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Required Documents</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc1" />
                          <Label htmlFor="doc1" className="text-sm">
                            Petition/Complaint
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc2" />
                          <Label htmlFor="doc2" className="text-sm">
                            Affidavit
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc3" />
                          <Label htmlFor="doc3" className="text-sm">
                            Power of Attorney
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc4" />
                          <Label htmlFor="doc4" className="text-sm">
                            Evidence Documents
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="doc5" />
                          <Label htmlFor="doc5" className="text-sm">
                            Court Fee Receipt
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.push("/dashboard/cases")}>
                    Cancel
                  </Button>
                  <Button type="submit" form="case-form" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Case"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Case Filing Guide</CardTitle>
              <CardDescription>Tips for filing a new case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full">
                <Image src="/images/bg_7.jpg" alt="Legal gavel" fill className="object-cover rounded-md" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Required Information</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Complete case title</li>
                  <li>Court details including hall number</li>
                  <li>Client information</li>
                  <li>Filing date</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Document Checklist</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Petition/Complaint</li>
                  <li>Supporting affidavits</li>
                  <li>Evidence documents</li>
                  <li>Court fee receipts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
