import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mwoysjrkdgmnkpxvwitw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3lzanJrZGdtbmtweHZ3aXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTA1NTAsImV4cCI6MjA5ODY2NjU1MH0.QF-biT64UwmKX2GkXSPPYf5i8hpUIFnm7cPGncwFK1Y"
);

export default supabase;