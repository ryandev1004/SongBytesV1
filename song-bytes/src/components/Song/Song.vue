<template>
  <Transition name="fade" appear>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 border shadow">
        <div class="position-relative">
          <img
            :src="song.albumCover || `https://placehold.co/600x400`"
            class="card-img-top object-fit-cover"
            style="height: 200px"
          />
          <div
            v-if="isExpiring"
            class="position-absolute top-0 start-0 m-2 px-2 py-1 bg-danger text-white rounded-pill text-sm"
          >
            <i class="bi bi-hourglass-split"></i>
            {{ formattedTime }}
          </div>
          <div
            v-else
            class="position-absolute top-0 start-0 m-2 px-2 py-1 bg-success text-white rounded-pill text-sm"
          >
            <i class="bi bi-hourglass-split"></i>
            {{ formattedDate }}
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-2">{{ song.name }}</h5>
          <p class="card-text text-muted text-truncate-lines-2 mb-3">
            {{ song.album }} - {{ song.artist }}
          </p>
          <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
            <div class="fw-bold me-2 fs-5 text-muted text-truncate" >
              <span> &curren; {{ song.bytes.toLocaleString() }}</span>
            </div>
            <div class="d-flex flex-column flex-shrink-0 gap-2">
              <button class="btn btn-success fs-6 py-2 px-4 btn-sm" data-bs-toggle="modal">
                <i class="bi bi-bank"></i> Place Bid
              </button>
              <button class="btn btn-success fs-6 py-2 px-4 btn-sm" data-bs-toggle="modal">
                <i class="bi bi-wallet"></i> Buy Out
              </button>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="(tag, index) in song.tags" :key="index" class="badge bg-secondary px-2 rounded-4"> {{ tag }} </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps({
  song: {
    type: Object,
    required: true,
  }
})
const { formattedTime, timeRemaining, formattedDate } = useCountdown(
   props.song.auctionEndTime ? new Date(props.song.auctionEndTime).getTime() : null
) // 24 hours from now

const isExpiring = computed(() => {
  return timeRemaining.value <= 86400000
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
