-- Enable realtime for contact_messages
ALTER TABLE public.contact_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;

-- Enable realtime for subscribers
ALTER TABLE public.subscribers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;

-- Enable realtime for theme_settings
ALTER TABLE public.theme_settings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_settings;