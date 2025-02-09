import { RestClient } from './rest-client';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  postcode: string;
  accessToken: string;
}

const PASSWORD = 'Testing1234!';

export async function ensureTestUser(client: RestClient, email: string = 'test@example.com'): Promise<TestUser> {
  try {
    // First try to find existing user
    const usersResponse = await client.get(`/api/users?email=${encodeURIComponent(email)}`);
    const users = usersResponse.body;

    console.log('users found:', users);
    
    if (users && Array.isArray(users) && users.length > 0) {
      const existingUser = users[0];
      // User exists, get auth token
      const authResponse = await client.post('/api/auth/token', {
        email,
        password: PASSWORD,
        grant_type: 'password'
      });

      const auth = authResponse.body;
      if (!auth || !auth.access_token) {
        throw new Error('Failed to get auth token');
      }

      client.setAuthToken(auth.access_token);
      return {
        id: auth.user.id,
        email: existingUser.email,
        name: existingUser.name,
        postcode: existingUser.postcode,
        accessToken: auth.access_token
      };
    }

    // Create new test user
    const authResponse = await client.post('/api/auth/signup', {
      email,
      name: 'Test User',
      password: PASSWORD,
      phone: '+1234567890',
      postcode: 'AB12CD'
    });

    const auth = authResponse.body;
    if (!auth || !auth.access_token || !auth.user_id) {
      throw new Error('Failed to create test user');
    }

    client.setAuthToken(auth.access_token);
    const user = auth.user;
      return {
      id: user.id,
      email: user.email,
      name: user.name,
      postcode: 'AB12CD',
      accessToken: auth.access_token
    };
  } catch (error) {
    console.error('Error in ensureTestUser:', error);
    throw error;
  }
}