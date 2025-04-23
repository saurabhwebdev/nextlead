-- Create businesses table if it doesn't exist
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  rating TEXT,
  reviews TEXT,
  open_state TEXT,
  description TEXT,
  service_options TEXT,
  latitude TEXT,
  longitude TEXT,
  search_query TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON businesses(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS businesses_created_at_idx ON businesses(created_at);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policy to restrict read access to own data
CREATE POLICY "Users can view their own data" ON businesses
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to restrict insert access
CREATE POLICY "Users can insert their own data" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to restrict update access
CREATE POLICY "Users can update their own data" ON businesses
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to restrict delete access
CREATE POLICY "Users can delete their own data" ON businesses
  FOR DELETE USING (auth.uid() = user_id); 