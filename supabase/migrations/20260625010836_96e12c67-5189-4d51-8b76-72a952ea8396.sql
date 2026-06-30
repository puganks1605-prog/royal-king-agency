
-- Tighten quote_requests user update policy
DROP POLICY IF EXISTS "Users update own pending requests" ON public.quote_requests;

CREATE POLICY "Users update own pending requests"
ON public.quote_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND admin_response IS NULL
  AND quoted_premium IS NULL
);

-- Restrict user_roles writes to admins only
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
