import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

  const body = await req.json();

  const email = body?.data?.attributes?.user_email;
  if (!email) return new Response('Invalid payload', { status: 400 });

  const { error } = await supabase
    .from('profiles')
    .update({ plan: 'pro' })
    .eq('email', email);

  if (error) {
    console.error('Supabase error:', error);
    return new Response('Failed to update user plan', { status: 500 });
  }

  return new Response('User upgraded to Pro!', { status: 200 });
});