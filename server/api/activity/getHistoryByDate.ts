import { getServerSession } from '#auth';
import { defineEventHandler, getQuery } from 'h3';
import * as Models from '~~/server/models/user.model';
import { groupHistoryByActivityType } from './utils';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);

    const startOfDay = new Date(String(query.date));
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(String(query.date));
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await Models.Log.find({
      created_by: session?.user?.userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .select('activity created_by date from to time_min created_at created_by')
      .populate({
        path: 'activity',
        model: Models.Activity,
        select: 'title color icon type description',
        populate: {
          path: 'type',
          model: Models.ActivityType,
          select: 'title',
        },
      });

    console.log('query.date', query.date, logs);

    return {
      history: groupHistoryByActivityType(logs),
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
});
