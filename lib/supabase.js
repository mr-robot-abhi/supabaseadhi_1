import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

// Initialize Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

// Sample users for demo purposes
const SAMPLE_USERS = [
  { email: "lawyer@example.com", password: "password123", name: "John Lawyer", role: "lawyer" },
  { email: "client@example.com", password: "password123", name: "Jane Client", role: "client" },
]

// Authentication functions
export async function signUp(email, password, name, role) {
  // Check if it's a sample user
  const sampleUser = SAMPLE_USERS.find((u) => u.email === email)

  if (sampleUser && password === "password123") {
    // For sample users, use special handling
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // If the user doesn't exist in Supabase yet, create them
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: sampleUser.name,
            role: sampleUser.role,
          },
        },
      })

      if (signUpError) throw signUpError

      // Create profile record
      if (signUpData.user) {
        await supabase.from("profiles").upsert({
          id: signUpData.user.id,
          user_id: signUpData.user.id,
          name: sampleUser.name,
          role: sampleUser.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        // MongoDB sync is now handled in server-side API routes
      }

      // Try signing in again
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      return signInData
    }

    return data
  }

  // Regular signup for non-sample users
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: role === "lawyer" ? "lawyer" : "client",
      },
    },
  })

  if (error) throw error

  // Create profile record
  if (data.user) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      user_id: data.user.id,
      name,
      role: role === "lawyer" ? "lawyer" : "client",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    // MongoDB sync is now handled in server-side API routes
  }

  return data
}

export async function signIn(email, password) {
  // Check if it's a sample user
  const sampleUser = SAMPLE_USERS.find((u) => u.email === email)

  if (sampleUser && password === "password123") {
    // For sample users, try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // If the user doesn't exist in Supabase yet, create them
      return await signUp(email, password, sampleUser.name, sampleUser.role)
    }

    return data
  }

  // Regular sign in for non-sample users
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
    },
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned" error
    // If profile doesn't exist, create one
    if (error.code === "PGRST116") {
      const newProfile = {
        user_id: user.id,
        name: user.user_metadata?.name || user.email.split("@")[0],
        role: user.user_metadata?.role || "client",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      await supabase.from("profiles").insert(newProfile)

      // MongoDB sync is now handled in server-side API routes

      return newProfile
    }

    throw error
  }

  return (
    data || {
      user_id: user.id,
      name: user.user_metadata?.name || user.email.split("@")[0],
      role: user.user_metadata?.role || "client",
    }
  )
}

// Case management functions
export async function createCase(caseData) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const profile = await getProfile()

  const newCase = {
    title: caseData.title,
    case_number: caseData.caseNumber,
    case_type: caseData.caseType,
    bench: caseData.bench,
    court_type: caseData.courtType,
    court: caseData.court,
    court_hall: caseData.courtHall,
    court_complex: caseData.courtComplex,
    district: caseData.district,
    filing_date: caseData.filingDate ? new Date(caseData.filingDate).toISOString() : null,
    hearing_date: caseData.hearingDate ? new Date(caseData.hearingDate).toISOString() : null,
    client_name: caseData.client,
    client_type: caseData.clientType,
    opposing_party: caseData.opposingParty,
    opposing_counsel: caseData.opposingCounsel,
    description: caseData.description,
    status: caseData.status || "active",
    priority: caseData.priority || "normal",
    is_urgent: caseData.isUrgent || false,
    case_stage: caseData.caseStage,
    act_sections: caseData.actSections,
    relief_sought: caseData.reliefSought,
    judge_name: caseData.judgeName,
    notes: caseData.notes,
    client_id: profile.role === "client" ? user.id : null,
    created_by: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("cases").insert(newCase).select().single()
  if (error) throw error

  // MongoDB sync is now handled in server-side API routes

  // Auto-add calendar event for the hearing date if provided
  if (caseData.hearingDate) {
    try {
      const hearingDate = new Date(caseData.hearingDate)
      await createEvent(
        data.id,
        `Hearing: ${caseData.title}`,
        `Court hearing for case ${caseData.caseNumber || caseData.title}`,
        hearingDate.toISOString(),
        caseData.court || "Court",
        "hearing",
      )
    } catch (eventError) {
      console.error("Error creating hearing event:", eventError)
      // Continue even if event creation fails
    }
  }

  // Add initial review event one week from now
  try {
    await createEvent(
      data.id,
      `Initial Review: ${caseData.title}`,
      "Review new case documents and prepare strategy",
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      "Office",
      "meeting",
    )
  } catch (eventError) {
    console.error("Error creating review event:", eventError)
    // Continue even if event creation fails
  }

  return data
}

export async function getCases() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const profile = await getProfile()

    let query = supabase.from("cases").select("*")

    // Filter cases based on user role
    if (profile.role === "client") {
      query = query.eq("client_id", user.id)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting cases:", error)
    return []
  }
}

export async function getCaseById(caseId) {
  try {
    const { data, error } = await supabase.from("cases").select("*").eq("id", caseId).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting case by ID:", error)
    return null
  }
}

export async function updateCase(caseId, caseData) {
  const updateData = {
    ...caseData,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("cases").update(updateData).eq("id", caseId).select().single()
  if (error) throw error

  // MongoDB sync is now handled in server-side API routes

  return data
}

// Document management functions
export async function uploadDocument(caseId, file, metadata = {}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const timestamp = Date.now()
  const filePath = `${caseId}/${timestamp}_${file.name}`

  const { data: uploadData, error: uploadError } = await supabase.storage.from("case-documents").upload(filePath, file)

  if (uploadError) throw uploadError

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("case-documents").getPublicUrl(filePath)

  // Create document record
  const documentData = {
    case_id: caseId,
    file_name: file.name,
    file_path: filePath,
    file_type: file.type,
    file_size: file.size,
    public_url: publicUrl,
    uploaded_by: user.id,
    category: metadata.category || "Other",
    status: metadata.status || "pending",
    tags: metadata.tags || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("documents").insert(documentData).select().single()
  if (error) throw error

  // MongoDB sync is now handled in server-side API routes

  return data
}

export async function getDocuments(caseId = null) {
  try {
    let query = supabase.from("documents").select("*")

    if (caseId) {
      query = query.eq("case_id", caseId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })
    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting documents:", error)
    return []
  }
}

export async function updateDocument(documentId, updates) {
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("documents").update(updateData).eq("id", documentId).select().single()
  if (error) throw error

  // MongoDB sync is now handled in server-side API routes

  return data
}

export async function deleteDocument(documentId) {
  try {
    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", documentId)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("case-documents").remove([document.file_path])

    if (storageError) throw storageError

    // Delete from database
    const { error } = await supabase.from("documents").delete().eq("id", documentId)
    if (error) throw error

    // MongoDB sync is now handled in server-side API routes

    return true
  } catch (error) {
    console.error("Error deleting document:", error)
    return false
  }
}

// Calendar functions
export async function createEvent(caseId, eventName, eventDetails, eventDate, location = "", eventType = "hearing") {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const eventData = {
      case_id: caseId,
      title: eventName,
      description: eventDetails,
      date: eventDate,
      location: location,
      type: eventType,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("calendar_events").insert(eventData).select().single()
    if (error) throw error

    // MongoDB sync is now handled in server-side API routes

    return data
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export async function getEvents(startDate = null, endDate = null, caseId = null) {
  try {
    let query = supabase.from("calendar_events").select("*")

    if (startDate) {
      query = query.gte("date", startDate)
    }

    if (endDate) {
      query = query.lte("date", endDate)
    }

    if (caseId) {
      query = query.eq("case_id", caseId)
    }

    const { data, error } = await query.order("date", { ascending: true })
    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error getting events:", error)
    return []
  }
}

export async function updateEvent(eventId, updates) {
  try {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .update(updateData)
      .eq("id", eventId)
      .select()
      .single()
    if (error) throw error

    // MongoDB sync is now handled in server-side API routes

    return data
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

export async function deleteEvent(eventId) {
  try {
    const { error } = await supabase.from("calendar_events").delete().eq("id", eventId)
    if (error) throw error

    // MongoDB sync is now handled in server-side API routes

    return true
  } catch (error) {
    console.error("Error deleting event:", error)
    return false
  }
}

export async function seedDefaultEvents() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Check if we already have events
    const { data: existingEvents } = await supabase.from("calendar_events").select("id")
    if (existingEvents && existingEvents.length > 0) {
      return // Don't seed if we already have events
    }

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const twoWeeks = new Date(today)
    twoWeeks.setDate(twoWeeks.getDate() + 14)

    const defaults = [
      {
        title: "Team Meeting",
        description: "Weekly case review and strategy discussion",
        date: tomorrow.toISOString(),
        location: "Office Conference Room",
        type: "meeting",
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: "Court Hearing: Smith v. Johnson",
        description: "Initial hearing for the Smith v. Johnson case",
        date: nextWeek.toISOString(),
        location: "Bangalore Urban District Court, Hall 4",
        type: "hearing",
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: "Document Submission Deadline",
        description: "Final deadline for submitting evidence documents",
        date: twoWeeks.toISOString(),
        location: "Commercial Court, Bangalore",
        type: "deadline",
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    const { data, error } = await supabase.from("calendar_events").insert(defaults).select()
    if (error) throw error

    // MongoDB sync is now handled in server-side API routes

    return data
  } catch (error) {
    console.error("Error seeding default events:", error)
    return []
  }
}
