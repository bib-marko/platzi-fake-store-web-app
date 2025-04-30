<template>
  <div class="container mt-5">
    <h1>User Management</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="editUser(user.id)">
                Edit
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteUser(user.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchUsers, deleteUser } from '@/api/userApi';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const users = ref([]);
const loading = ref(true);
const router = useRouter();

const loadUsers = async () => {
  try {
    users.value = await fetchUsers();
  } catch (error) {
    Swal.fire('Error', 'Failed to load users. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};

const editUser = (id: number) => {
  router.push(`/edit-user/${id}`);
};

const deleteUserHandler = async (id: number) => {
  try {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirmed.isConfirmed) {
      await deleteUser(id);
      Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      loadUsers();
    }
  } catch (error) {
    Swal.fire('Error', 'Failed to delete user. Please try again.', 'error');
  }
};

onMounted(loadUsers);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid #f3f3f3;
  border-top: 0.25em solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
