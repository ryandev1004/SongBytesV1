<template>
  <div class="container py-4">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-border text-secondary">
        <span class="visually-hidden"> Loading...</span>
      </div>
    </div>
    <EditSongModal
      v-model="isEditModalOpen"
      :song="selectedSong"
      @songUpdated="fetchSongs"
    />
    <div class="border rounded pb-3 px-2">
      <div
        class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4"
      >
        <div>
          <h1 class="text-secondary">Library</h1>
          <p class="mb-0 text-muted small">Manage and track your collected songs</p>
        </div>
        <a href="#" class="btn btn-success btn-sm gap-2 rounded-1 px-4 py-2">
          <i class="bi bi-plus-square"></i> &nbsp;
          <span>View Auctions</span>
        </a>
      </div>
      <hr class="mt-2" />

      <div class="card-body p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead>
              <tr>
                <th class="ps-3 small text-muted">Song</th>
                <th class="small text-muted">Artist</th>
                <th class="small text-muted">Bytes</th>
                <th class="small text-muted">Tags</th>
                <th class="small text-muted">Active Bids</th>
                <th class="pe-3 text-end small text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in songs" :key="song.id">
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <img
                      :src="song.albumCover || `https://placehold.co/50x50`"
                      class="rounded object-fit-cover me-2"
                      style="width: 50px; height: 50px"
                    />
                    <div>
                      <div class="fw-semibold small">{{ song.name }}</div>
                      <small
                        class="text-muted text-truncate d-inline-block"
                        style="max-width: 200px"
                      >
                        {{ song.album }}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge bg-light bg-opacity-10 text-light small">
                    {{ song.artist }}
                  </span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="fw-semibold small">&curren; {{ song.bytes.toLocaleString() }}</span>
                    <span v-if="!song.offMarket" class="text-danger small"> &curren; {{ song.highestBid.toLocaleString() }} </span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      class="badge bg-info bg-opacity-10 text-info small"
                      v-for="tag in song.tags"
                      :key="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    class="badge bg-opacity-10 small"
                    :class="{'bg-warning text-warning': song.offMarket, 'bg-success text-success': !song.offMarket }"
                  >
                    {{ song.offMarket ? 'Off Market' : 'Active' }}
                  </span>
                </td>
                <td class="pe-3 text-end">
                  <button class="btn btn-sm btn-outline-secondary m-2" @click="toggleModal(song)">
                    <i class="bi bi-pencil-fill"></i> Edit
                  </button>

                  <button class="btn btn-sm btn-outline-danger" @click="handleDelete(song.id)">
                    <i class="bi bi-wallet"></i> Quick Sell
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import songService from '@/services/songService'
import { useSwal } from '@/composables/useSwal'
import EditSongModal from '@/components/Song/modals/EditSongModal.vue'
import { useAuthStore } from '@/stores/authStore'
const { showSuccess, showConfirm } = useSwal()
const authStore = useAuthStore()
const songs = ref([])
const loading = ref(false)
const isEditModalOpen = ref(false)
const selectedSong = ref(null)


onMounted(() => {
  fetchSongs()
})

function toggleModal(song) {
  selectedSong.value = song
  isEditModalOpen.value = !isEditModalOpen.value
}

const fetchSongs = async () => {
  loading.value = true
  try {
    songs.value = await songService.getUserLibrary(authStore.user.uid)
  } catch (error) {
    console.error('Error fetching songs:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (songId) => {
  loading.value = true
  try {
    const confirmed = await showConfirm('Are you sure you want to quick sell this song?')
    if (confirmed.isConfirmed) {
      await songService.deleteSong(songId)
      songs.value = songs.value.filter((song) => song.id !== songId)
      showSuccess('Song quick sold successfully!')
    }
  } catch (error) {
    console.error('Error deleting song:', error)
  } finally {
    loading.value = false
  }
}
</script>
