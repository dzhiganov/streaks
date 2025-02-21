import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { signOut, getSession, ...t } = useAuth();
  const session = await getSession();

  if (session.user.trialExpired) {
    return navigateTo('/error?message=trial_expired');
  }
});
