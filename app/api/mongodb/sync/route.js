import { NextResponse } from "next/server"
import { syncProfileToMongo, syncCaseToMongo, syncDocumentToMongo, syncEventToMongo } from "@/lib/mongodb"

export async function POST(request) {
  try {
    const { type, data } = await request.json()

    switch (type) {
      case "profile":
        await syncProfileToMongo(data)
        break
      case "case":
        await syncCaseToMongo(data)
        break
      case "document":
        await syncDocumentToMongo(data)
        break
      case "event":
        await syncEventToMongo(data)
        break
      default:
        return NextResponse.json({ error: "Invalid sync type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("MongoDB sync error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
