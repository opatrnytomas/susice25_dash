"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, MessageSquare, TrendingUp } from "lucide-react"

interface Message {
  session_id: string
  original_message: string
  ai_response: string
  created_at: string
}

interface DashboardData {
  successRate: number
  totalSessions: number
  successfulSessions: number
  failedSessions: number
  recentMessages: Message[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) throw new Error("Failed to fetch data")
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítání dat...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-semibold">Chyba při načítání</p>
          <p className="text-muted-foreground text-sm">{error || "Neznámá chyba"}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Úspěšnost Dashboard</h1>
          <p className="text-muted-foreground">Analýza výkonu AI odpovědí a přesnosti systému</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Success Rate */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Úspěšnost AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{data.successRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Bez eskalace na support</p>
            </CardContent>
          </Card>

          {/* Total Sessions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Celkem relací
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{data.totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">Session ID</p>
            </CardContent>
          </Card>

          {/* Successful */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Úspěšné</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{data.successfulSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">Bez eskalace</p>
            </CardContent>
          </Card>

          {/* Failed */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Eskalované</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{data.failedSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">Eskalace na support</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Poslední zprávy
            </CardTitle>
            <CardDescription>Nejnovější interakce AI a jejich odpovědi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentMessages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Zatím žádné zprávy</p>
              ) : (
                data.recentMessages.map((message) => (
                  <div
                    key={message.session_id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        Session: {message.session_id.slice(0, 8)}...
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleString("cs-CZ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Original Message */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Původní zpráva</p>
                        <p className="text-sm text-foreground line-clamp-3">{message.original_message}</p>
                      </div>

                      {/* AI Response */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">AI odpověď</p>
                        <p className="text-sm text-foreground line-clamp-3">{message.ai_response}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
