-- Add user_id column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

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

-- Update existing records to associate with current users if needed
-- This will need to be run manually with appropriate logic to assign records
-- For example: UPDATE businesses SET user_id = 'specific-user-id' WHERE user_id IS NULL; 