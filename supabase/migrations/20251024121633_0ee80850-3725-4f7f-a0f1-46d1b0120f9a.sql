-- Enable realtime for founder_settings
ALTER TABLE public.founder_settings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.founder_settings;