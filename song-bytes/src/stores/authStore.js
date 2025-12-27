import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, auth } from '@/utilities/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'


export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const initialized = ref(false)
  const isAuthenticated = computed(() => user.value !== null)

  // Session Persistence
  const initializeAuth = async() => {
    onAuthStateChanged(auth, async (firebaseuser) => {
      if(firebaseuser) {
        user.value = firebaseuser
      } else {
        clearUser();
      }
    })
  }

  const signUpUser = async (email, password) => {
    isLoading.value = true
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        await setDoc(doc(db, 'users', userCredentials.user.uid), {
          email: email,
          createdAt: new Date()
        })
        clearUser();
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = () => {
    user.value = null
  }

  const signIn = async (email, password) => {
    isLoading.value = true
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        user.value = userCredentials.user
        error.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const signOutUser = async () => {
    isLoading.value = true
    try {
        await signOut(auth)
        clearUser();
        error.value = null
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    error,
    isLoading,
    isAuthenticated,
    initialized,

    //getters
    isAuthenticated,

    // Action
    signUpUser,
    signIn,
    signOutUser,
    initializeAuth
  }
})
