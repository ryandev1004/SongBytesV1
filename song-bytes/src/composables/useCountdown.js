import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

export function useCountdown(endTime) {
  const timeRemaining = ref(0);
  let timerInterval = null;

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(timeRemaining.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  });

  const formattedDate = computed(() => {
    const totalSeconds = Math.floor(timeRemaining.value / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  });

  const updateTimer = () => {
    const now = new Date().getTime();
    timeRemaining.value = Math.max(0, endTime - now);
  };

  onMounted(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  });

  onBeforeUnmount(() => {
    clearInterval(timerInterval);
  });

  return { timeRemaining, formattedTime, formattedDate };
}