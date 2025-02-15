import { onMounted, onUnmounted, ref } from 'vue';

export function useTheme() {
  const theme = ref(document.documentElement.dataset.theme || 'light');

  const observer = new MutationObserver(() => {
    theme.value = document.documentElement.dataset.theme || 'light';
  });

  onMounted(() => {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  });

  onUnmounted(() => {
    observer.disconnect();
  });

  return theme;
}
