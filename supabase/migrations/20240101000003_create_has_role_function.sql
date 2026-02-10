-- Create has_role function for checking user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = _user_id 
    AND user_roles.role = _role
  );
END;
$$;

-- Grant usage to authenticated users
GRANT EXECUTE ON FUNCTION public.has_role(UUID, TEXT) TO authenticated;
