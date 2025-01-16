import { getServerSession } from '#auth';
import { defineEventHandler, getQuery } from 'h3';
import * as Models from '~~/server/models/user.model';
import { groupHistoryByActivityType } from './utils';
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);

    const fromDate = query.from ? new Date(String(query.from)) : null;
    const toDate = query.to ? new Date(String(query.to)) : null;

    if (!fromDate || isNaN(fromDate.getTime())) {
      throw new Error('Invalid or missing "from" date');
    }

    if (!toDate || isNaN(toDate.getTime())) {
      throw new Error('Invalid or missing "to" date');
    }

    if (fromDate > toDate) {
      throw new Error('"from" date must be earlier than "to" date');
    }
    toDate.setHours(23, 59, 59, 999);

    const logs = await Models.Log.find({
      created_by: session.user.userId,
      date: {
        $gte: fromDate,
        $lte: toDate,
      },
    })
      .select('activity created_by date from to time_min created_at')
      .populate({
        path: 'activity',
        model: Models.Activity,
        select:
          'title color icon type description week_time_goal_min day_time_goal_min month_time_goal_min',
        populate: {
          path: 'type',
          model: Models.ActivityType,
          select: 'title',
        },
      });

    return {
      history: groupHistoryByActivityType(logs),
    };
  } catch (error) {
    console.error('Error fetching history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
