import seedActivityTypes from '~/server/db/seed';

export default defineNitroPlugin(async () => {
  if (process.env.NITRO_BUILD) return;

  await seedActivityTypes();
});
