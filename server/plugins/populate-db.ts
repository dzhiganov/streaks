import seedActivityTypes from '~/server/db/seed';

export default defineNitroPlugin(async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      await seedActivityTypes();
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
});
