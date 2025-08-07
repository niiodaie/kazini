-- Create truth_tests table for async truth testing
CREATE TABLE IF NOT EXISTS truth_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  verdict TEXT,
  score INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  answered_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_truth_tests_created_by ON truth_tests(created_by);
CREATE INDEX IF NOT EXISTS idx_truth_tests_created_at ON truth_tests(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE truth_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own truth tests" ON truth_tests
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own truth tests" ON truth_tests
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own truth tests" ON truth_tests
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own truth tests" ON truth_tests
  FOR DELETE USING (auth.uid() = created_by);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_truth_tests_updated_at 
  BEFORE UPDATE ON truth_tests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

