CREATE POLICY "Enable read access for all users" ON public.students FOR SELECT USING (true);
