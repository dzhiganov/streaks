import seedActivityTypes from '~/server/db/seed';

export default defineNitroPlugin(async () => {
  await seedActivityTypes();
});