export default defineNitroPlugin(async () => {
  try {
    // await seedActivityTypes();
  } catch (error) {
    console.error('Error populating database:', error);
  }
});
