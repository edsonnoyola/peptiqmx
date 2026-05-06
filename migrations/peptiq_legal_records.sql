-- PEPTIQ MX · Legal Records Table
-- Run once in Supabase Studio SQL Editor

CREATE TABLE IF NOT EXISTS public.peptiq_legal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type text NOT NULL CHECK (record_type IN ('consent','action_ack','health_profile')),
  email text,
  signature text,
  action_key text,
  agreement_version text,
  payload jsonb NOT NULL,
  user_agent text,
  client_ip text,
  netlify_request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peptiq_legal_email ON public.peptiq_legal_records (email);
CREATE INDEX IF NOT EXISTS idx_peptiq_legal_type ON public.peptiq_legal_records (record_type);
CREATE INDEX IF NOT EXISTS idx_peptiq_legal_created ON public.peptiq_legal_records (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_peptiq_legal_signature ON public.peptiq_legal_records (signature);

-- RLS off · service role only writes (no public access)
ALTER TABLE public.peptiq_legal_records ENABLE ROW LEVEL SECURITY;

-- Block all anon access
CREATE POLICY "no_public_access" ON public.peptiq_legal_records
  FOR ALL TO anon USING (false);

-- Service role bypass (default)
COMMENT ON TABLE public.peptiq_legal_records IS 'PEPTIQ MX legal acknowledgment records · Acuerdo Marco v1.5 · cumplimiento LFPDPPP';
