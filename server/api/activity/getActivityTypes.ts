import { getServerSession } from '#auth';
import { defineEventHandler } from 'h3';
import { ActivityType } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in.',
      });
    }

    if (!session?.user?.userId) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const activity_types = await ActivityType.find({
      $or: [{ created_by: session.user.userId }, { is_default: true }],
    }).select('title description created_by is_default');

    return {
      success: true,
      activity_types,
    };
  } catch (err) {
    console.error('Error fetching activity types:', err.message);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch activity types' });
  }
});
