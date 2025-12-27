<template>
  <div>
    <div
      class="w-100 position-relative overflow-hidden mb-4 py-5 d-flex align-items-center"
      :style="{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '50vh'
      }"
    >
      <!-- Overlay -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div class="container-fluid position-relative z-1">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8 col-xl-7">
            <h1 class="display-4 fw-bold text-white">Welcome to SongBytes</h1>
            <p class="lead text-white">Discover, share, and collect your favorite songs all in one place.</p>
            <div class="input-group mx-auto shadow-lg rounded-4 mt-4" style="max-width: 700px">
              <input
                type="text"
                v-model="searchValue"
                class="form-control border-0 py-2 px-4 fs-5 rounded-4"
                placeholder="Search your favorite song..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="mb-4 text-center display-6">Auction House</div>
      <hr />
      <div class="row g-3 mb-5 align-items-center">
        <div class="col-md-auto">
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              id="tagDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-tags"></i> TAGS
            </button>
            <ul
              class="dropdown-menu shadow overflow-auto"
              aria-labelledby="tagDropdown"
              style="max-height: 250px"
            >
              <li v-for="tag in availableTags" class="px-3 py-2" :key="tag.name">
                <div class="form-check">
                  <input
                    class="form-check-input me-2"
                    type="checkbox"
                    :value="tag.name"
                    v-model="selectedTag"
                  />
                  <label class="form-check-label text-truncate d-block" style="max-width: 200px"
                    >{{ tag.name }} ({{ tag.count }})</label
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-auto ms-md-auto">
          <div class="dropdown">
            <button
              class="btn btn-secondary"
              type="button"
              id="sortDropdown"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-filter"></i>
            </button>
            <div class="dropdown-menu">
              <button
                v-for="(sort, index) in sortOptions"
                :key="index"
                class="dropdown-item"
                :class="{ active: selectedSort === sort }"
                data-toggle="button"
                @click="selectedSort = selectedSort === sort ? '' : sort"
              >
                {{ sort }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div v-if="displayedSongs.length > 0" class="row g-4 mb-4">
          <Song v-for="song in displayedSongs" :key="song.id" :song="song" />
        </div>
        <div v-else class="text-center py-5">
          <div class="fs-4 text-muted">No songs found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { SORT_NAMES, PRICE_HIGH_LOW, PRICE_LOW_HIGH, AZ, ZA } from '@/constants/sortNames'
import heroImage from '@/assets/stock/header.jpg'
import songService from '@/services/songService'
import Song from '@/components/Song/Song.vue'

const songs = ref([])
const loading = ref(false)
const searchValue = ref('')
const tags = ref([])
const selectedTag = ref([])
const selectedSort = ref('')
const sortOptions = ref([...SORT_NAMES])

onMounted(() => {
  fetchSongs()
  fetchTags()
})

// Computed Properties that checks for tag filters, searches, and sorts
const displayedSongs = computed(() => {
  let filtered = songs.value
  // Tag filter
  if (selectedTag.value.length > 0) {
    filtered = filtered.filter((song) =>
      selectedTag.value.every((tag) => song.tags.includes(tag))
    )
  }
  // Filter by search
  if (searchValue.value.trim()) {
    const search = searchValue.value.toLowerCase()
    filtered = filtered.filter((song) =>
      song.name.toLowerCase().includes(search) ||
      song.artist.toLowerCase().includes(search) ||
      song.album.toLowerCase().includes(search)
    )
  }
  // Sort
  if (selectedSort.value === PRICE_LOW_HIGH) {
    return [...filtered].sort((a, b) => a.bytes - b.bytes)
  } else if (selectedSort.value === PRICE_HIGH_LOW) {
    return [...filtered].sort((a, b) => b.bytes - a.bytes)
  } else if (selectedSort.value === AZ) {
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
  } else if (selectedSort.value === ZA) {
    return [...filtered].sort((a, b) => b.name.localeCompare(a.name))
  }

  return filtered
})

const availableTags = computed(() => {
  let filtered = songs.value

  if (selectedTag.value.length > 0) {
    filtered = filtered.filter((song) =>
      selectedTag.value.every((tag) => song.tags.includes(tag))
    )
  }
  return tags.value
    .map((tag) => ({
      name: tag.name,
      count: filtered.filter((song) => song.tags.includes(tag.name)).length,
    }))
    .filter((tag) => tag.count > 0)
})

const fetchSongs = async () => {
  loading.value = true
  try {
    songs.value = await songService.getOnMarketSongs()
  } catch (error) {
    console.error('Error fetching songs:', error)
  } finally {
    loading.value = false
  }
}

const fetchTags = async () => {
  loading.value = true
  try {
    const tagsData = await songService.getOnMarketTagCounts()
    tags.value = tagsData
  } catch (error) {
    console.error('Error fetching tags:', error)
  } finally {
    loading.value = false
  }
}
</script>
