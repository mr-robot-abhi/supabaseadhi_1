import { MongoClient } from "mongodb"
import { env } from "./env"

// MongoDB connection
let mongoClient = null
let mongoDb = null

export async function connectToMongo() {
  if (!mongoClient && env.MONGODB_URI) {
    try {
      mongoClient = new MongoClient(env.MONGODB_URI)
      await mongoClient.connect()
      mongoDb = mongoClient.db("adhivakta")
      console.log("Connected to MongoDB")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      // Return empty objects to prevent errors
      return { client: null, db: null }
    }
  }
  return { client: mongoClient, db: mongoDb }
}

export async function syncProfileToMongo(profile) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("profiles").updateOne(
        { user_id: profile.user_id },
        {
          $set: {
            ...profile,
            created_at: new Date(),
            updated_at: new Date(),
          },
        },
        { upsert: true },
      )
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}

export async function syncCaseToMongo(caseData) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("cases").updateOne(
        { supabase_id: caseData.id },
        {
          $set: {
            ...caseData,
            updated_at: new Date(),
          },
        },
        { upsert: true },
      )
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}

export async function syncDocumentToMongo(document) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("documents").updateOne(
        { supabase_id: document.id },
        {
          $set: {
            ...document,
            updated_at: new Date(),
          },
        },
        { upsert: true },
      )
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}

export async function syncEventToMongo(event) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("calendar_events").updateOne(
        { supabase_id: event.id },
        {
          $set: {
            ...event,
            updated_at: new Date(),
          },
        },
        { upsert: true },
      )
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}

export async function deleteDocumentFromMongo(documentId) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("documents").deleteOne({ supabase_id: documentId })
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}

export async function deleteEventFromMongo(eventId) {
  try {
    const { db } = await connectToMongo()
    if (db) {
      await db.collection("calendar_events").deleteOne({ supabase_id: eventId })
    }
  } catch (error) {
    console.error("MongoDB sync error:", error)
  }
}
