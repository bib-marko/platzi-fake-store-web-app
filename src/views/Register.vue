<template>
  <div class="container">
    <form class="form" @submit.prevent="handleRegister">
      <p>Welcome,<span>create an account to get started</span></p>
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
        Register
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
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { createUser } from '@/api/userApi';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const name = ref('');
const role = ref('');
const avatar = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const handleRegister = async () => {
  let timerInterval;
  Swal.fire({
    title: 'Registering...',
    html: 'Please wait while we create your account.',
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });

  try {
    await createUser({
      name: name.value,
      role: role.value,
      avatar: avatar.value,
      email: email.value,
      password: password.value,
    });
    Swal.close();
    Swal.fire(
      'Success',
      'Your account has been created successfully!',
      'success'
    );
    router.push('/login');
  } catch (error) {
    Swal.close();
    Swal.fire('Error', 'Failed to register. Please try again.', 'error');
  }
};
</script>

<style scoped>
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
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
