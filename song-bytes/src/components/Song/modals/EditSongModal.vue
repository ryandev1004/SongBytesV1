<template>
  <Modal :isModalOpen="modalStatus" @close="closeModal">
    <template #modal-header>
      <h5 class="modal-title">Edit Song</h5>
    </template>
    <template #modal-body>
      <form id="editSongForm" @submit.prevent="handleEdit">
        <div class="mt-1">
          <label class="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            class="form-control"
            placeholder="Tags (comma-separated)"
            v-model="songObj.tags"
          />
        </div>
        <div class="form-check form-switch pt-3">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="offmarket"
            v-model="songObj.offMarket"
          />
          <label class="form-check-label" for="offmarket"> Off-Market? </label>
        </div>
      </form>
    </template>
    <template #modal-footer>
      <button type="button" class="btn btn-secondary" @click="toggleModal">Close</button>
      <button type="submit" form="editSongForm" class="btn btn-primary">Save changes</button>
    </template>
  </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue'
import songService from '@/services/songService'
import { useSwal } from '@/composables/useSwal'
import { ref, reactive, watch } from 'vue'

const { showSuccess, showConfirm } = useSwal()

const modalStatus = defineModel({type: Boolean, required: true})

const { song } = defineProps({
  song: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['songUpdated'])

const loading = ref(false)
const songObj = reactive({
  name: '',
  album: '',
  artist: '',
  streams: 0,
  tags: '',
  offMarket: false,
  albumCover: 'https://placehold.co/600x400',
  bytes: 0,
  highestBid: -1,
})

// Watch for changes to the song prop and update songObj accordingly
watch(
  () => song?.id,
  async (newId) => {
    if (!newId) return

    loading.value = true
    try {
      const songData = await songService.getSongById(newId)
      Object.assign(songObj, {
        ...songData,
        tags: Array.isArray(songData.tags) ? songData.tags.join(', ') : '',
      })
    } catch (error) {
      console.error('Error fetching song data:', error)
    } finally {
      loading.value = false
    }
  },
)

const closeModal = () => {
  modalStatus.value = false
}

const handleEdit = async () => {
  loading.value = true
  try {
    const confirmed = await showConfirm('Are you sure you want to save changes to this song?')
    if (confirmed.isConfirmed) {
      const updatedSong = {
        ...songObj,
        tags: songObj.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }
      await songService.updateSong(song.id, updatedSong)
      showSuccess('Song updated successfully!')
      emit('songUpdated') // Emit event to parent
      closeModal()
    }
  } catch (error) {
    console.error('Error editing song:', error)
  } finally {
    loading.value = false
  }
}
</script>
