-- Resolve logged-in user role in a single secure DB call.

CREATE OR REPLACE FUNCTION public.get_my_access_context()
RETURNS TABLE(role public.app_role, teacher_access_granted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role public.app_role;
BEGIN
  BEGIN
    jwt_role := (auth.jwt() -> 'app_metadata' ->> 'role')::public.app_role;
  EXCEPTION
    WHEN others THEN
      jwt_role := NULL;
  END;

  RETURN QUERY
  SELECT ur.role, ur.teacher_access_granted
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY
    SELECT COALESCE(jwt_role, 'student'::public.app_role), false;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_access_context() TO authenticated;
