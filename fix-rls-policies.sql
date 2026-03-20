-- Fix: Add missing INSERT and UPDATE policies for users table

-- Allow service role and authenticated users during registration
CREATE POLICY "users_insert_service_role" ON public.users
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Allow users to update their own profile
CREATE POLICY "users_update_self" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow admins to update any user
CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE) 
  WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- Allow public select for user info (limited fields)
CREATE POLICY "users_select_public" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
