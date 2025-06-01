import { setupAdminUser } from './setupAdminUser';
import { setupTestUsers } from './setupTestUsers';

// This function sets up all required users for the application
export async function setupAllUsers() {
  try {
    // First set up the admin user from the admin setup utility
    await setupAdminUser();
    
    // Then set up the test users
    await setupTestUsers();
    
    console.log('All users setup complete');
  } catch (error) {
    console.error('User setup failed:', error);
  }
}
