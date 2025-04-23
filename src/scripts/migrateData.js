// This script helps migrate existing data to be associated with users
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://uiokhjnhqeorzamkabju.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // This should be the service role key, not anon key

// Only run this with a valid service role key
if (!supabaseServiceKey) {
  console.error('Error: Service role key is required to run this migration.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateData() {
  try {
    // 1. Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw usersError;
    }
    
    if (!users || users.length === 0) {
      console.log('No users found to migrate data.');
      return;
    }
    
    // 2. Get records without user_id
    const { data: unassignedRecords, error: recordsError } = await supabase
      .from('businesses')
      .select('id')
      .is('user_id', null);
    
    if (recordsError) {
      throw recordsError;
    }
    
    if (!unassignedRecords || unassignedRecords.length === 0) {
      console.log('No unassigned records found.');
      return;
    }
    
    console.log(`Found ${unassignedRecords.length} unassigned records.`);
    
    // Map to store which user has been assigned to how many records
    const userCounts = {};
    
    // Determine which user to assign records to (using the first user as default)
    const defaultUserId = users[0].id;
    console.log(`Using default user ID: ${defaultUserId}`);
    
    // 3. Update records to assign to the default user
    // NOTE: In a real scenario, you might want more sophisticated logic
    // to determine which records belong to which users
    const { data: updateResult, error: updateError } = await supabase
      .from('businesses')
      .update({ user_id: defaultUserId })
      .is('user_id', null);
    
    if (updateError) {
      throw updateError;
    }
    
    console.log(`Successfully assigned ${unassignedRecords.length} records to user ${defaultUserId}`);
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run the migration
migrateData()
  .then(() => console.log('Migration completed.'))
  .catch(err => console.error('Migration failed:', err)); 