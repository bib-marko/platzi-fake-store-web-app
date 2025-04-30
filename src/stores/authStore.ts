import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getProfile } from '@/api/authApi';

export const useAuthStore = defineStore('authStore', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const profile = ref<{
    id: number;
    name: string;
    email: string;
    avatar;
    role: string;
  } | null>(null);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const clearToken = () => {
    token.value = null;
    profile.value = null;
    localStorage.removeItem('token');
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    try {
      const userProfile = await getProfile(token.value);
      profile.value = userProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      clearToken();
    }
  };

  return {
    token,
    profile,
    setToken,
    clearToken,
    fetchProfile,
  };
});
