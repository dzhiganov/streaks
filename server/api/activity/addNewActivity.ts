import { getServerSession } from '#auth';
import { defineEventHandler, readBody } from 'h3';
import { Activity } from '~/server/models/user.model';
import { User } from '~~/server/models/user.model';

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

    const activity = await Activity.create({
      title: body.title,
      description: body.description,
      type: body.type,
      icon: body.icon,
      color: body.color,
      active: body.active ?? true,
      week_time_goal_min: body.week_time_goal_min ?? 0,
      day_time_goal_min: body.day_time_goal_min ?? 0,
      month_time_goal_min: body.month_time_goal_min ?? 0,
      created_at: new Date(),
      created_by: session.user.userId,
    });

    await User.findByIdAndUpdate(session.user.userId, {
      $push: {
        activities: activity._id,
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error: ', err);
  }
});
