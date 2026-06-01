-- Create wa_groups table for WhatsApp group directory
CREATE TABLE IF NOT EXISTS public.wa_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  wa_link TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wa_groups ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view active WhatsApp groups"
  ON public.wa_groups
  FOR SELECT
  USING (is_active = true);
