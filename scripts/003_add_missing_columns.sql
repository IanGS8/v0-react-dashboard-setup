-- Add focus_area to guilds
ALTER TABLE public.guilds ADD COLUMN IF NOT EXISTS focus_area text;

-- Add role to guild_members
ALTER TABLE public.guild_members ADD COLUMN IF NOT EXISTS role text not null default 'member';

-- Add course and semester to profiles for match context
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester integer;
