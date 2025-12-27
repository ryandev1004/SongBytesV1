<template>
  <div class="container">
    <div class="row border p-4 my-4 rounded">
      <div class="col-9">
        <form v-on:submit.prevent="handleSubmit">
          <div class="text-center">
            <h2>Want to collect your favorite song?</h2>
            <span
              >Fill out the form below with your song's information and it'll be yours!</span
            >
          </div>
          <hr />
          <div v-if="errorList.length > 0" class="alert alert-danger pb-0">
            Please fix the following errors:
            <ul>
              <li v-for="error in errorList" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div class="mt-3">
            <span class="text-muted">Song Name:</span>
            <input type="text" v-model.trim.lazy="songObj.name" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Album Name:</span>
            <input type="text" v-model.trim="songObj.album" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Artist Name:</span>
            <input type="text" v-model.trim.lazy="songObj.artist" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Song Streams:</span>
            <input type="number" v-model.number="songObj.streams" class="form-control" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              type="text"
              v-model="songObj.tags"
              class="form-control"
              placeholder="e.g., rock, shoegaze, hip-hop"
            />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              class="form-check-input"
              v-model="songObj.offMarket"
              type="checkbox"
              role="switch"
            />
            <label class="form-check-label"> Off-Market? </label>
          </div>
          <div class="my-3">
            <label class="form-label">Album Cover</label>
            <div class="input-group">
              <input type="file" class="form-control" 
              @change="handleImageUpload"
              :disable="isImageLoading"
              />
            </div>
          </div>
          <div class="pt-3">
            <button class="btn btn-success m-2 w-25" :disabled="loading || isImageLoading">
              <span v-if="loading || isImageLoading" class="spinner-border spinner-border-sm me-2"></span>Submit
            </button>
            <a href="/" class="btn btn-secondary m-2 w-25"> Cancel </a>
          </div>
        </form>
      </div>
      <div class="col-3 pt-5">
        <img
          :src="songObj.albumCover || `https://placehold.co/600x400`"
          class="img-fluid rounded"
          alt="Song
        preview"
        />
        <div class="mt-2 text-center">
          <span>{{ songObj.name }}</span>
          <br />
          <span class="text-muted">{{ songObj.artist }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSwal } from '@/composables/useSwal'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import songService from '@/services/songService'
import { APP_ROUTES_NAMES } from '@/constants/routesNames'
import { useAuthStore } from '@/stores/authStore'
import { uploadToCloudinary } from '@/utilities/cloudinary'

const { showSuccess, showError } = useSwal()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const isImageLoading = ref(false)
const errorList = reactive([])
const songObj = reactive({
  name: '',
  album: '',
  artist: '',
  streams: 0,
  tags: [],
  offMarket: false,
  albumCover: 'https://placehold.co/600x400',
  bytes: 0, // currency for song purchases will be calculated via server
  highestBid: -1, // default value for highest bid
})

async function handleSubmit() {
  try {
    loading.value = true
    errorList.length = 0 // Clear previous errors

    if (songObj.name.length === 0) {
      errorList.push('Song name is required.')
    }
    if (songObj.artist.length === 0) {
      errorList.push('Artist name is required.')
    }

    if (errorList.length === 0) {
      const songData = {
        ...songObj,
        streams: Number(songObj.streams),
        tags: songObj.tags.length > 0 ? songObj.tags.split(',').map((tag) => tag.trim()) : [],
        offMarket: Boolean(songObj.offMarket),
        auctionEndTime: null,
        highestBid: Boolean(songObj.offMarket) ? -1 : 0,
        bytes: Number(songObj.streams) * 0.02,
      }
      await songService.requestSong(songData, authStore.user.uid)
      showSuccess('Congrats! You now are the proud owner of: ' + songObj.name)
      router.push({ name: APP_ROUTES_NAMES.SONG_LIST })
      console.log('Song submitted:', songData)
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  isImageLoading.value = true;

  try {
    const imageUrl = await uploadToCloudinary(file);
    songObj.albumCover = imageUrl;
  } catch (error) {
    showError('Failed to upload image. Please try again.');
    console.error('Image upload error:', error);
  } finally {
    isImageLoading.value = false;
  }
}

</script>
