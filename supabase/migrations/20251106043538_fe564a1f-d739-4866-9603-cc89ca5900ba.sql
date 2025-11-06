-- Ensure unique constraint on user_roles (user_id, role)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Create admin policies for user_roles if they don't exist
DO $$ BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins can view all roles'
  ) THEN
    CREATE POLICY "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  -- INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins can insert roles'
  ) THEN
    CREATE POLICY "Admins can insert roles"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  -- UPDATE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins can update roles'
  ) THEN
    CREATE POLICY "Admins can update roles"
    ON public.user_roles
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;

  -- DELETE policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins can delete roles'
  ) THEN
    CREATE POLICY "Admins can delete roles"
    ON public.user_roles
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;