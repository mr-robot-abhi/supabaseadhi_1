import { NextResponse } from "next/server"
import { deleteDocumentFromMongo, deleteEventFromMongo } from "@/lib/mongodb"

export async function POST(request) {
  try {
    const { type, id } = await request.json()

    switch (type) {
      case "document":
        await deleteDocumentFromMongo(id)
        break
      case "event":
        await deleteEventFromMongo(id)
        break
      default:
        return NextResponse.json({ error: "Invalid delete type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("MongoDB delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
