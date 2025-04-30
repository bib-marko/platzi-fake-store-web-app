<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div id="content" class="content content-full-width">
          <div class="profile">
            <div class="profile-header">
              <div class="profile-header-cover"></div>
              <div class="profile-header-content">
                <div class="profile-header-img">
                  <img
                    :src="
                      authStore.profile?.avatar ||
                      'https://bootdey.com/img/Content/avatar/avatar3.png'
                    "
                    alt="Profile Image"
                  />
                </div>
                <div class="profile-header-info">
                  <h4 class="m-t-10 m-b-5">
                    {{ authStore.profile?.name || 'Loading...' }} ({{
                      authStore.profile?.role
                    }})
                  </h4>
                  <p class="m-b-10">
                    {{ authStore.profile?.email || 'Loading...' }}
                  </p>

                  <button
                    @click="handleLogout"
                    class="btn btn-sm btn-danger mb-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Update Profile Form -->
          <form class="form" @submit.prevent="handleUpdate">
            <p>Update Your Profile,<span>make changes to your account</span></p>
            <input
              v-model="name"
              type="text"
              placeholder="Full Name"
              name="name"
              required
            />
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              name="email"
              required
            />
            <input
              v-model="role"
              type="text"
              placeholder="Role"
              name="role"
              required
            />
            <input
              v-model="avatar"
              type="text"
              placeholder="Avatar Link"
              name="avatar"
              required
            />
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <button class="oauthButton">
              Update Profile
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { updateUser } from '@/api/userApi'; // Import the updateUser function

const authStore = useAuthStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const role = ref('');
const avatar = ref('');
const password = ref('');

// Pre-fill the form with the current user's profile data
onMounted(() => {
  if (authStore.profile) {
    name.value = authStore.profile.name || '';
    email.value = authStore.profile.email || '';
    role.value = authStore.profile.role || '';
    avatar.value = authStore.profile.avatar || '';
  }
});

const handleUpdate = async () => {
  try {
    const userId = authStore.profile?.id; // Assuming the profile contains the user's ID
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Update the user profile using the updateUser function
    await updateUser(userId, {
      name: name.value,
      email: email.value,
      role: role.value,
      avatar: avatar.value,
      password: password.value,
    });

    Swal.fire(
      'Success',
      'Your profile has been updated successfully!',
      'success'
    );

    // Log the user out after updating the profile
    authStore.clearToken();
    router.push('/login');
  } catch (error) {
    Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
  }
};

const handleLogout = () => {
  authStore.clearToken();
  Swal.fire('Success', 'You have logged out successfully!', 'success');
  router.push('/login');
};

authStore.fetchProfile();
</script>

<style scoped>
.profile-header {
  --main-color: #323232;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
}

.profile-header .profile-header-cover {
  background-color: #8d4fff;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.profile-header .profile-header-cover:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0,
    rgba(0, 0, 0, 0.75) 100%
  );
}

.profile-header .profile-header-content {
  color: #fff;
  padding: 25px;
}

.profile-header-img {
  float: left;
  width: 120px;
  height: 120px;
  overflow: hidden;
  position: relative;
  z-index: 10;
  margin: 0 0 -20px;
  padding: 3px;
  border-radius: 4px;
  background: #fff;
}

.profile-header-img img {
  max-width: 100%;
}

.profile-header-info h4 {
  font-weight: 500;
  color: #fff;
}

.profile-header-img + .profile-header-info {
  margin-left: 140px;
}

.profile-header .profile-header-content,
.profile-header .profile-header-tab {
  position: relative;
}

.profile-header .profile-header-tab {
  background: #fff;
  list-style-type: none;
  margin: -10px 0 0;
  padding: 0 0 0 140px;
  white-space: nowrap;
  border-radius: 0;
}

.profile-header .profile-header-tab > li {
  display: inline-block;
  margin: 0;
}

.profile-header .profile-header-tab > li > a {
  display: block;
  color: #929ba1;
  line-height: 20px;
  padding: 10px 20px;
  text-decoration: none;
  font-weight: 700;
  font-size: 12px;
  border: none;
}

.profile-header .profile-header-tab > li.active > a,
.profile-header .profile-header-tab > li > a.active {
  color: #242a30;
}

.profile-content {
  padding: 25px;
  border-radius: 4px;
}

.form {
  --background: #d3d3d3;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding: 20px;
  background: var(--background);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  width: 1000px;
  margin-top: 10px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}

.form > p {
  font-family: var(--font-DelaGothicOne);
  color: var(--font-color);
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form > p > span {
  font-family: var(--font-SpaceMono);
  color: var(--font-color-sub);
  font-weight: 600;
  font-size: 17px;
}

.oauthButton {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 350px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 16px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  transition: all 250ms;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.oauthButton::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #212121;
  z-index: -1;
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: all 250ms;
}

.oauthButton:hover {
  color: #e8e8e8;
}

.oauthButton:hover::before {
  width: 100%;
}

.form > input {
  width: 350px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
