-- Allow authenticated users to sync their own role row from JWT app_metadata.
-- This prevents portal misrouting when user_roles is missing or stale.

CREATE POLICY "Users can insert own synced role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = COALESCE((auth.jwt() -> 'app_metadata' ->> 'role')::public.app_role, 'student')
  AND (role <> 'teacher' OR teacher_access_granted = false)
);

CREATE POLICY "Users can update own synced role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND role = COALESCE((auth.jwt() -> 'app_metadata' ->> 'role')::public.app_role, 'student')
  AND (role <> 'teacher' OR teacher_access_granted = false)
);
