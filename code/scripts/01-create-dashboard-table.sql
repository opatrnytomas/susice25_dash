-- Create dashboard table for AI success tracking
CREATE TABLE IF NOT EXISTS public.dashboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  original_message TEXT NOT NULL,
  ai_response TEXT,
  contains_nevim BOOLEAN DEFAULT FALSE,
  forwarded_to_support BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on session_id for faster queries
CREATE INDEX IF NOT EXISTS idx_dashboard_session_id ON public.dashboard(session_id);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_dashboard_created_at ON public.dashboard(created_at DESC);

-- Create index on forwarded_to_support for filtering
CREATE INDEX IF NOT EXISTS idx_dashboard_forwarded_to_support ON public.dashboard(forwarded_to_support);

-- Enable Row Level Security (optional - remove if you don't need it)
-- ALTER TABLE public.dashboard ENABLE ROW LEVEL SECURITY;
