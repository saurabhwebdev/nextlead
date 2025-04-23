-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  feedback_type TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT,
  page TEXT,
  browser_info TEXT,
  status TEXT DEFAULT 'new',
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback(user_id);

-- Create index on feedback_type
CREATE INDEX IF NOT EXISTS feedback_type_idx ON feedback(feedback_type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON feedback(created_at);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own feedback
CREATE POLICY "Users can insert their own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own feedback
CREATE POLICY "Users can view their own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow only admins to update feedback
CREATE POLICY "Only admins can update feedback" ON feedback
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email = 'admin@example.com'
    )
  );

-- Function to notify when new feedback is submitted
CREATE OR REPLACE FUNCTION notify_new_feedback()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_feedback',
    json_build_object(
      'id', NEW.id,
      'feedback_type', NEW.feedback_type,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call notification function on insert
CREATE TRIGGER trigger_notify_new_feedback
AFTER INSERT ON feedback
FOR EACH ROW
EXECUTE FUNCTION notify_new_feedback(); 