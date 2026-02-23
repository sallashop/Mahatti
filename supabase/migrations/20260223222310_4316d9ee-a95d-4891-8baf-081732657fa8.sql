
-- Add fuel availability columns to stations table
ALTER TABLE public.stations
ADD COLUMN IF NOT EXISTS benzine_available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS diesel_available boolean DEFAULT true;
