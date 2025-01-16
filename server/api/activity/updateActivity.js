import { getServerSession } from '#auth';
import { defineEventHandler, readBody } from 'h3';
import { Activity } from '~/server/models/user.model';
import { User } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const { id, ...body } = await readBody(event);
    const session = await getServerSession(event);

    const activity = await Activity.findByIdAndUpdate(id, body);

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
