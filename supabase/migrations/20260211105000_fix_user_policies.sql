-- Fix infinite recursion in user_roles policies
-- The issue is caused by policies that query user_roles table directly within a policy for user_roles
-- We must use the SECURITY DEFINER function `has_role` for admin checks, AND ensure no circular dependency in other policies

-- Drop potentially conflicting/recursive policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;

-- Re-create safe policies

-- 1. Simple policy for users to view their own role (no recursion)
-- This only checks auth.uid() against the row's user_id, no extra queries
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- 2. Admin policy using SECURITY DEFINER function
-- public.has_role() is SECURITY DEFINER, so it bypasses RLS when checking the user_roles table inside the function
-- valid for ALL operations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
