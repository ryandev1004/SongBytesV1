<template>
  <Teleport to="#modal">
    <Transition name="modal-fade">
      <div
        v-if="isModalOpen"
        class="modal d-block"
        :class="{ show: isVisible }"
        tabindex="-1"
        @click.self="handleClose"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <slot name="modal-header">
                <h1>This is the modal header!</h1>
              </slot>
              <button
                type="button"
                class="btn-close"
                @click="handleClose"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <slot name="modal-body">
                <p>This is the modal body!</p>
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="modal-footer">
                <p>And this is the modal footer!</p>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="backdrop-fade">
      <div v-if="isModalOpen" class="modal-backdrop"></div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref} from 'vue'

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])
const isVisible = ref(false)

const handleClose = () => {
  emit('close')
}


</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s linear;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.2s linear;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.modal-backdrop {
  opacity: 0.5;
}
</style>
