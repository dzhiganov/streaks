import { defineNuxtPlugin } from '#app';
import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient();

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      nuxtApp.payload.vueQueryState = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    hydrate(queryClient, nuxtApp.payload.vueQueryState || {});
  }

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  });
});
