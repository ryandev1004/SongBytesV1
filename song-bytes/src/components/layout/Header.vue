
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img :src="logo" style="width: 30px" class="d-inline-block align-text-top" />
        SongBytes
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: APP_ROUTES_NAMES.HOME }"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: APP_ROUTES_NAMES.SONG_LIST }"
              >Library</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              :to="{ name: APP_ROUTES_NAMES.SONG_CREATE }"
              >Request Song</router-link
            >
          </li>
        </ul>
        <ul class="d-flex navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-person-square"></i> &nbsp; Account
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li class="dropdown-item"  v-if="!authStore.isAuthenticated">
                <router-link
                  class="nav-link"
                  :to="{ name: APP_ROUTES_NAMES.LOGIN }"
                  >
                  <i class="bi bi-box-arrow-in-right"></i> &nbsp; Sign In
                  </router-link
                >
              </li>
              <li class="dropdown-item"  v-if="!authStore.isAuthenticated">
                <router-link
                  class="nav-link"
                  :to="{ name: APP_ROUTES_NAMES.SIGN_UP }"
                  >
                  <i class="bi bi-plus-circle"></i> &nbsp; Sign Up
                  </router-link
                >
              </li>
              <li class="dropdown-item" v-if="authStore.isAuthenticated">
                <button class="nav-link"
                @click="[authStore.signOutUser(), router.push({name: APP_ROUTES_NAMES.HOME})]"
                >Sign Out</button>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <button 
              @click="themeStore.setTheme(themeStore.theme === 'dark' ? 'light' : 'dark')" 
              class="nav-link"
            >
              <i :class="themeStore.theme === 'dark' ? 'bi bi-brightness-alt-high' : 'bi bi-moon-fill'"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { APP_ROUTES_NAMES } from '@/constants/routesNames'
import logo from '../../assets/logo.ico'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
const themeStore = useThemeStore()
const router = useRouter()
const authStore = useAuthStore()

</script>


