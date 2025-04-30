const API_BASE_URL = 'https://api.escuelajs.co/api/v1';

export const registerUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      throw new Error('Failed to log in');
    }
    const data = await response.json();
    return data; // Returns token and user information
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const data = await response.json();
    return data; // Returns user profile information
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
