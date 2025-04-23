# Data Security Implementation

## Overview

This document outlines the implementation of user-specific data access control in the application. The system is designed to ensure that users can only access their own data, preventing unintended data sharing between users.

## Database Schema

The updated database schema includes:

- A `user_id` column in the `businesses` table, linking each record to a specific user
- Row Level Security (RLS) policies that enforce user-specific data access
- Indexes for optimized performance

### Database Tables

```sql
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
```

### Row Level Security Policies

The following RLS policies have been implemented:

```sql
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
```

## Implementation in Application Code

### Data Insertion

When saving data to Supabase, the application now includes the user's ID:

```javascript
// LeadGen.tsx - saveToSupabase function
const businessData = filteredResults.map(business => ({
  // ...other fields
  user_id: user.id
}));
```

### Data Fetching

When retrieving data, the application filters by the current user's ID:

```javascript
// Leads.tsx - fetchBusinesses function
const { data, error } = await supabase
  .from('businesses')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

## Migration of Existing Data

A migration script (`src/scripts/migrateData.js`) has been created to help migrate existing data to be associated with users. The script:

1. Identifies records without a user_id
2. Assigns them to appropriate users
3. Updates the database records

To run the migration:

```bash
# Set the Supabase service role key
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run the migration script
node src/scripts/migrateData.js
```

## Security Considerations

1. The application validates user authentication before data operations
2. Row Level Security is enforced at the database level
3. User IDs are automatically assigned during data insertion
4. Existing data is migrated to maintain data integrity

## Troubleshooting

If users report missing data:

1. Check if the user is properly authenticated
2. Verify that the migration script has been run successfully
3. Inspect the database to ensure records have correct user_id values
4. Confirm that RLS policies are properly configured 