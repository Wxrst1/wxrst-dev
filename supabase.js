
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waibolkrbjhvcozdfbrp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhaWJvbGtyYmpodmNvemRmYnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NDA3NTQsImV4cCI6MjA4MzMxNjc1NH0.h40dyQtP-7wzKE6oxA30zGjZ_vOawzbqANKnF7ND31w';

export const supabase = createClient(supabaseUrl, supabaseKey);
