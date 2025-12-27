<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Create Account</h4>
            <hr/>
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="form.email" class="form-control" id="email" required />
              </div>
              <div class="mb-2">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="form.password" class="form-control" id="password" required />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Confirm Password</label>
                <input type="password" v-model="form.confirmPassword" class="form-control" id="confirmPassword" required />
              </div>
              <button :disabled="authStore.isLoading" type="submit" class="btn btn-success w-100">
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                Create Account
              </button>
              <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
            </form>
            <p class="mt-3 form-label text-center">
              Already have an account?
              <router-link :to="APP_ROUTES_NAMES.LOGIN">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useSwal } from '@/composables/useSwal';
import { APP_ROUTES_NAMES } from '@/constants/routesNames';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const { showSuccess, showError } = useSwal();
const error = ref("");
const form = reactive({
    email: '',
    password: '',
    confirmPassword: '',
})

const submitForm = async () => {
    if(form.password !== form.confirmPassword) {
        error.value = "Passwords do not match.";
        return;
    }
    try {
        error.value = "";
        showSuccess("Account created successfully!");
        authStore.signUpUser(form.email, form.password);
        router.push({ name: APP_ROUTES_NAMES.HOME });
    } catch (err) {
        showError("An error occurred during signup. Please try again.");
    }
}

</script>
