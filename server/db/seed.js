import { ActivityType } from '~~/server/models/user.model';

export default async function seedActivityTypes() {
  try {
    const existingCount = await ActivityType.countDocuments();

    if (existingCount === 0) {
      console.log('Seeding default activity types...');

      await ActivityType.insertMany([
        { title: 'Hobby', description: 'Hobby', is_default: true },
        { title: 'Work', description: 'Work', is_default: true },
        { title: 'Family & Friends', description: 'Family & Friends', is_default: true },
      ]);

      console.log('✅ Default activity types added.');
    } else {
      console.log('⚠️ Default activity types already exist. Skipping seeding.');
    }
  } catch (error) {
    console.error('❌ Error seeding default activity types:', error.message);
  }
}
