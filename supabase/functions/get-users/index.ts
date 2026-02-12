import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

interface ProfileWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  user_roles: Array<{ role: string }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const { data: requesterRole, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || requesterRole?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: usersData, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select(
        `
        id,
        user_id,
        full_name,
        avatar_url,
        created_at,
        user_roles(role)
      `,
      )
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Profile fetch failed:', usersError.code);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (!usersData || usersData.length === 0) {
      return new Response(JSON.stringify({ users: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      data: { users: authUsers },
      error: authError,
    } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });

    if (authError) {
      console.error('Auth fetch failed:', authError.code);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch auth data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const authUsersMap = new Map((authUsers ?? []).map((u) => [u.id, u]));

    const usersWithDetails = (usersData as ProfileWithRole[]).map((profile) => {
      const authUser = authUsersMap.get(profile.user_id);
      const roleData =
        profile.user_roles?.length > 0 ? profile.user_roles[0] : null;

      return {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        email: authUser?.email ?? 'Unknown',
        role: roleData?.role ?? 'guest',
        email_confirmed: !!authUser?.email_confirmed_at,
        last_sign_in: authUser?.last_sign_in_at ?? null,
      };
    });

    return new Response(JSON.stringify({ users: usersWithDetails }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error(
      'Unexpected error:',
      error instanceof Error ? error.message : 'Unknown',
    );
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
