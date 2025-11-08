import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://dciwefcgjgasubizjiil.supabase.co"
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaXdlZmNnamdhc3ViaXpqaWlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU0NDIwNiwiZXhwIjoyMDc4MTIwMjA2fQ.6h060v9bqbBcdLxTfe4L4JILYN9TBSarmBDJVEoHSRY"

export const supabase = createClient(supabaseUrl, supabaseServiceKey)
