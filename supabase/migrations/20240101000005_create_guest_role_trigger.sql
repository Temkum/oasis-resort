-- Function to assign guest role to new profiles
CREATE OR REPLACE FUNCTION public.assign_guest_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'guest')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to assign guest role on profile creation
CREATE OR REPLACE TRIGGER assign_guest_role_on_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_guest_role();
