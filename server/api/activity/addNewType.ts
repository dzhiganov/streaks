import { getServerSession } from '#auth';
import { defineEventHandler, readBody } from 'h3';
import { ActivityType, User } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in.',
      });
    }

    const activityType = await ActivityType.create({
      title: body.title,
      description: body.description,
      is_default: false,
      created_at: new Date(),
      created_by: session.user.userId,
    });

    await User.findByIdAndUpdate(session.user.userId, {
      $push: {
        activity_types: activityType._id,
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error: ', err);
  }
});
