"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SearchIcon,
  UploadIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  FileArchiveIcon,
  DownloadIcon,
  EyeIcon,
  TrashIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  CheckIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"

// Sample documents data
const documents = [
  {
    id: "doc-1",
    name: "Smith v. Johnson - Complaint.pdf",
    type: "pdf",
    case: "Smith v. Johnson",
    category: "Pleadings",
    uploadedBy: "John Doe",
    uploadedAt: "2023-11-15T10:30:00",
    size: "2.4 MB",
    status: "approved",
    tags: ["complaint", "civil"],
  },
  {
    id: "doc-2",
    name: "Estate of Williams - Will.pdf",
    type: "pdf",
    case: "Estate of Williams",
    category: "Evidence",
    uploadedBy: "John Doe",
    uploadedAt: "2023-11-10T14:45:00",
    size: "1.8 MB",
    status: "approved",
    tags: ["will", "probate"],
  },
  {
    id: "doc-3",
    name: "Brown LLC - Contract.docx",
    type: "docx",
    case: "Brown LLC v. Davis Corp",
    category: "Contracts",
    uploadedBy: "John Doe",
    uploadedAt: "2023-11-05T09:15:00",
    size: "1.2 MB",
    status: "pending",
    tags: ["contract", "commercial"],
  },
  {
    id: "doc-4",
    name: "Miller Divorce - Settlement Agreement.pdf",
    type: "pdf",
    case: "Miller Divorce",
    category: "Agreements",
    uploadedBy: "John Doe",
    uploadedAt: "2023-11-01T16:20:00",
    size: "3.5 MB",
    status: "approved",
    tags: ["agreement", "family"],
  },
  {
    id: "doc-5",
    name: "Property Photos.zip",
    type: "zip",
    case: "Smith v. Johnson",
    category: "Evidence",
    uploadedBy: "John Doe",
    uploadedAt: "2023-10-28T11:10:00",
    size: "15.7 MB",
    status: "approved",
    tags: ["photos", "evidence"],
  },
  {
    id: "doc-6",
    name: "Court Order - Oct 15.pdf",
    type: "pdf",
    case: "Brown LLC v. Davis Corp",
    category: "Court Orders",
    uploadedBy: "John Doe",
    uploadedAt: "2023-10-15T13:40:00",
    size: "0.8 MB",
    status: "approved",
    tags: ["order", "commercial"],
  },
  {
    id: "doc-7",
    name: "Witness Statement - Jane Smith.pdf",
    type: "pdf",
    case: "Smith v. Johnson",
    category: "Statements",
    uploadedBy: "John Doe",
    uploadedAt: "2023-10-12T09:20:00",
    size: "1.1 MB",
    status: "pending",
    tags: ["statement", "witness"],
  },
  {
    id: "doc-8",
    name: "Medical Report.pdf",
    type: "pdf",
    case: "Miller Divorce",
    category: "Evidence",
    uploadedBy: "John Doe",
    uploadedAt: "2023-10-05T15:30:00",
    size: "4.2 MB",
    status: "rejected",
    tags: ["medical", "evidence"],
  },
]

// Document categories
const DOCUMENT_CATEGORIES = [
  "All Categories",
  "Pleadings",
  "Evidence",
  "Contracts",
  "Agreements",
  "Court Orders",
  "Statements",
  "Correspondence",
  "Legal Research",
  "Billing",
]

// Document statuses
const DOCUMENT_STATUSES = ["All Statuses", "Approved", "Pending", "Rejected"]

// Function to get icon based on file type
const getFileIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FileTextIcon className="h-6 w-6 text-red-500" />
    case "docx":
      return <FileTextIcon className="h-6 w-6 text-blue-500" />
    case "jpg":
    case "png":
      return <ImageIcon className="h-6 w-6 text-green-500" />
    case "zip":
      return <FileArchiveIcon className="h-6 w-6 text-yellow-500" />
    default:
      return <FileIcon className="h-6 w-6 text-gray-500" />
  }
}

// Function to get status badge
const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
  }
}

export default function DocumentsPage() {
  const { user } = useAuth()
  const [isLawyer, setIsLawyer] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [caseFilter, setCaseFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("All Statuses")
  const [dateFilter, setDateFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [viewDocument, setViewDocument] = useState(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [tagFilter, setTagFilter] = useState("")

  useEffect(() => {
    // Check if user is lawyer or client
    if (user) {
      setIsLawyer(user.role === "lawyer" || user.role === "admin")
    }
  }, [user])

  // Filter documents based on search, filters, and active tab
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.case.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))

    const matchesCase = caseFilter === "all" || doc.case === caseFilter
    const matchesCategory = categoryFilter === "All Categories" || doc.category === categoryFilter
    const matchesStatus = statusFilter === "All Statuses" || doc.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesTag =
      !tagFilter || (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase())))

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && new Date(doc.uploadedAt).toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" && new Date(doc.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && new Date(doc.uploadedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && new Date(doc.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (activeTab === "pleadings" && doc.category === "Pleadings") ||
      (activeTab === "evidence" && doc.category === "Evidence")

    return matchesSearch && matchesCase && matchesCategory && matchesStatus && matchesDate && matchesTab && matchesTag
  })

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "size") {
      const sizeA = Number.parseFloat(a.size)
      const sizeB = Number.parseFloat(b.size)
      return sortOrder === "asc" ? sizeA - sizeB : sizeB - sizeA
    } else if (sortBy === "type") {
      return sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
    } else {
      // Default sort by date
      return sortOrder === "asc"
        ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
        : new Date(b.uploadedAt) - new Date(a.uploadedAt)
    }
  })

  // Get unique values for filters
  const cases = ["all", ...new Set(documents.map((d) => d.case))]

  // Handle document selection
  const toggleDocumentSelection = (docId) => {
    if (selectedDocuments.includes(docId)) {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    } else {
      setSelectedDocuments([...selectedDocuments, docId])
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (action === "download") {
      alert(`Download functionality for ${selectedDocuments.length} documents is under development.`)
    } else if (action === "delete") {
      setShowDeleteDialog(true)
    } else if (action === "approve") {
      alert(`Approval functionality for ${selectedDocuments.length} documents is under development.`)
    }
  }

  // Handle document deletion
  const handleDeleteDocuments = () => {
    alert(`Delete functionality for ${selectedDocuments.length} documents is under development.`)
    setSelectedDocuments([])
    setShowDeleteDialog(false)
  }

  // Handle document upload
  const handleUploadDocument = () => {
    alert("Document upload functionality is under development.")
    setShowUploadDialog(false)
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Documents</h1>
        <div className="flex space-x-2">
          {selectedDocuments.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions ({selectedDocuments.length})</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("download")}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                {isLawyer && (
                  <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleBulkAction("delete")} className="text-red-600">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to the system. Supported formats: PDF, DOCX, JPG, PNG, ZIP.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Drag and drop files here, or click to select files</p>
                    <Button variant="outline" className="mt-4">
                      Select Files
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="uploadCase">Related Case</Label>
                    <Select>
                      <SelectTrigger id="uploadCase">
                        <SelectValue placeholder="Select case" />
                      </SelectTrigger>
                      <SelectContent>
                        {cases
                          .filter((c) => c !== "all")
                          .map((caseItem) => (
                            <SelectItem key={caseItem} value={caseItem}>
                              {caseItem}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uploadCategory">Document Category</Label>
                    <Select>
                      <SelectTrigger id="uploadCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_CATEGORIES.filter((c) => c !== "All Categories").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uploadTags">Tags (comma separated)</Label>
                  <Input id="uploadTags" placeholder="e.g., evidence, contract, important" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadDocument}>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle>Document Library</CardTitle>
                  <CardDescription>Manage and access all your case documents</CardDescription>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search documents..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={showAdvancedFilters ? "bg-muted" : ""}
                  >
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        {sortOrder === "asc" ? (
                          <SortAscIcon className="h-4 w-4" />
                        ) : (
                          <SortDescIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("date")
                          toggleSortOrder()
                        }}
                      >
                        {sortBy === "date" && <CheckIcon className="mr-2 h-4 w-4" />}
                        Date {sortBy === "date" && (sortOrder === "asc" ? "(Oldest first)" : "(Newest first)")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("name")
                          toggleSortOrder()
                        }}
                      >
                        {sortBy === "name" && <CheckIcon className="mr-2 h-4 w-4" />}
                        Name {sortBy === "name" && (sortOrder === "asc" ? "(A-Z)" : "(Z-A)")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("size")
                          toggleSortOrder()
                        }}
                      >
                        {sortBy === "size" && <CheckIcon className="mr-2 h-4 w-4" />}
                        Size {sortBy === "size" && (sortOrder === "asc" ? "(Smallest first)" : "(Largest first)")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("type")
                          toggleSortOrder()
                        }}
                      >
                        {sortBy === "type" && <CheckIcon className="mr-2 h-4 w-4" />}
                        Type {sortBy === "type" && (sortOrder === "asc" ? "(A-Z)" : "(Z-A)")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            {showAdvancedFilters && (
              <div className="px-6 pb-4">
                <div className="p-4 border rounded-md bg-muted/20">
                  <h3 className="text-sm font-medium mb-3">Advanced Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="caseFilter" className="text-xs">
                        Case
                      </Label>
                      <Select value={caseFilter} onValueChange={setCaseFilter}>
                        <SelectTrigger id="caseFilter" className="mt-1">
                          <SelectValue placeholder="Filter by case" />
                        </SelectTrigger>
                        <SelectContent>
                          {cases.map((caseItem) => (
                            <SelectItem key={caseItem} value={caseItem}>
                              {caseItem === "all" ? "All Cases" : caseItem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="categoryFilter" className="text-xs">
                        Category
                      </Label>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger id="categoryFilter" className="mt-1">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="statusFilter" className="text-xs">
                        Status
                      </Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="statusFilter" className="mt-1">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateFilter" className="text-xs">
                        Date
                      </Label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger id="dateFilter" className="mt-1">
                          <SelectValue placeholder="Filter by date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Last 7 Days</SelectItem>
                          <SelectItem value="month">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label htmlFor="tagFilter" className="text-xs">
                      Tags
                    </Label>
                    <Input
                      id="tagFilter"
                      placeholder="Filter by tags..."
                      className="mt-1"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Documents</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="pleadings">Pleadings</TabsTrigger>
                  <TabsTrigger value="evidence">Evidence</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {sortedDocuments.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="w-8 p-2">
                                <Checkbox
                                  checked={
                                    selectedDocuments.length === sortedDocuments.length && sortedDocuments.length > 0
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedDocuments(sortedDocuments.map((doc) => doc.id))
                                    } else {
                                      setSelectedDocuments([])
                                    }
                                  }}
                                />
                              </th>
                              <th className="text-left p-2 font-medium">Document</th>
                              <th className="text-left p-2 font-medium hidden md:table-cell">Case</th>
                              <th className="text-left p-2 font-medium hidden md:table-cell">Category</th>
                              <th className="text-left p-2 font-medium hidden md:table-cell">Date</th>
                              <th className="text-left p-2 font-medium hidden md:table-cell">Status</th>
                              <th className="text-right p-2 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedDocuments.map((doc) => (
                              <tr key={doc.id} className="border-t hover:bg-muted/50">
                                <td className="p-2">
                                  <Checkbox
                                    checked={selectedDocuments.includes(doc.id)}
                                    onCheckedChange={() => toggleDocumentSelection(doc.id)}
                                  />
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center space-x-3">
                                    {getFileIcon(doc.type)}
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-xs text-muted-foreground">{doc.size}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2 hidden md:table-cell">{doc.case}</td>
                                <td className="p-2 hidden md:table-cell">{doc.category}</td>
                                <td className="p-2 hidden md:table-cell">
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </td>
                                <td className="p-2 hidden md:table-cell">{getStatusBadge(doc.status)}</td>
                                <td className="p-2 text-right">
                                  <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="sm" onClick={() => setViewDocument(doc)}>
                                      <EyeIcon className="h-4 w-4" />
                                      <span className="sr-only">View</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => alert("Document download is under development.")}
                                    >
                                      <DownloadIcon className="h-4 w-4" />
                                      <span className="sr-only">Download</span>
                                    </Button>
                                    {isLawyer && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDocuments([doc.id])
                                          setShowDeleteDialog(true)
                                        }}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No documents found</h3>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-4">
                  <div className="space-y-4">
                    {sortedDocuments.length > 0 ? (
                      sortedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-4">
                            {getFileIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex text-sm text-muted-foreground">
                                <span>{doc.case}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.category}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setViewDocument(doc)}>
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert("Document download is under development.")}
                            >
                              <DownloadIcon className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No recent documents found</h3>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="pleadings" className="mt-4">
                  <div className="space-y-4">
                    {sortedDocuments.length > 0 ? (
                      sortedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-4">
                            {getFileIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex text-sm text-muted-foreground">
                                <span>{doc.case}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.category}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setViewDocument(doc)}>
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert("Document download is under development.")}
                            >
                              <DownloadIcon className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No pleadings found</h3>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="evidence" className="mt-4">
                  <div className="space-y-4">
                    {sortedDocuments.length > 0 ? (
                      sortedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-4">
                            {getFileIcon(doc.type)}
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex text-sm text-muted-foreground">
                                <span>{doc.case}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.category}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => setViewDocument(doc)}>
                              <EyeIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert("Document download is under development.")}
                            >
                              <DownloadIcon className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No evidence documents found</h3>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Tips and guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-40 w-full">
                <Image src="/images/bg_6.jpg" alt="Law books" fill className="object-cover rounded-md" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Document Categories</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Pleadings</li>
                  <li>Evidence</li>
                  <li>Contracts</li>
                  <li>Court Orders</li>
                  <li>Agreements</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Best Practices</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Use clear file names</li>
                  <li>Include case reference</li>
                  <li>Organize by category</li>
                  <li>Keep versions updated</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{viewDocument?.name}</DialogTitle>
            <DialogDescription>
              {viewDocument?.case} • {viewDocument?.category} • Uploaded on{" "}
              {viewDocument && new Date(viewDocument.uploadedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <FileTextIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Document preview is under development.</p>
                <p className="text-sm text-muted-foreground mt-1">This feature will be available soon.</p>
              </div>
            </div>
            {viewDocument?.tags && viewDocument.tags.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {viewDocument.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => alert("Document download is under development.")}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => setViewDocument(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDocuments.length} document
              {selectedDocuments.length !== 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocuments}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
