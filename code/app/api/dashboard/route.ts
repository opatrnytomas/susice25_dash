import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = "https://dciwefcgjgasubizjiil.supabase.co"
    const supabaseServiceKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaXdlZmNnamdhc3ViaXpqaWlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU0NDIwNiwiZXhwIjoyMDc4MTIwMjA2fQ.6h060v9bqbBcdLxTfe4L4JILYN9TBSarmBDJVEoHSRY"

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch all messages to calculate success rate
    const { data: allMessages, error: fetchError } = await supabase
      .from("8n8") // Changed table name from "n8n" to "8n8"
      .select("session_id, forwarded_to_support, original_message, ai_response, created_at")
      .order("created_at", { ascending: false })

    if (fetchError) throw fetchError

    if (!allMessages || allMessages.length === 0) {
      return Response.json({
        successRate: 0,
        totalSessions: 0,
        successfulSessions: 0,
        failedSessions: 0,
        recentMessages: [],
      })
    }

    // Calculate success rate based on unique sessions
    const uniqueSessions = new Map<string, boolean>()
    allMessages.forEach((msg) => {
      if (!uniqueSessions.has(msg.session_id)) {
        // forwarded_to_support = true means failed, false means successful
        uniqueSessions.set(msg.session_id, !msg.forwarded_to_support)
      }
    })

    const totalSessions = uniqueSessions.size
    const successfulSessions = Array.from(uniqueSessions.values()).filter((isSuccess) => isSuccess).length
    const failedSessions = totalSessions - successfulSessions
    const successRate = totalSessions > 0 ? (successfulSessions / totalSessions) * 100 : 0

    // Get recent messages (last 10)
    const recentMessages = allMessages.slice(0, 10).map((msg) => ({
      session_id: msg.session_id,
      original_message: msg.original_message,
      ai_response: msg.ai_response,
      created_at: msg.created_at,
    }))

    return Response.json({
      successRate,
      totalSessions,
      successfulSessions,
      failedSessions,
      recentMessages,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return Response.json({ error: "Chyba při načítání dat" }, { status: 500 })
  }
}
