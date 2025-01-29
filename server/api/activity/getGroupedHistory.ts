import { getServerSession } from '#auth';
import { defineEventHandler, getQuery } from 'h3';
import * as Models from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);

    const { date, from, to } = query;

    if (!date && (!from || !to)) {
      throw new Error('Either "date" or "range" (from and to) must be provided');
    }

    let dateFilter = {};
    if (date) {
      // Filter by a specific date
      const specificDate = new Date(String(date));
      if (isNaN(specificDate.getTime())) {
        throw new Error('Invalid "date" parameter');
      }
      specificDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(specificDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dateFilter = { date: { $gte: specificDate, $lt: nextDay } };
    } else if (from && to) {
      // Filter by a range of dates
      const fromDate = new Date(String(from));
      const toDate = new Date(String(to));
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error('Invalid "from" or "to" parameter');
      }
      if (fromDate > toDate) {
        throw new Error('"from" date must be earlier than "to" date');
      }
      toDate.setHours(23, 59, 59, 999);
      dateFilter = { date: { $gte: fromDate, $lte: toDate } };
    }

    // Fetch logs based on the calculated date filter
    const logs = await Models.Log.find({
      created_by: session.user.userId,
      ...dateFilter,
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

    // Group logs by Activity Type and then by Activity
    const groupedHistory = logs.reduce((acc, log) => {
      const activityType = log.activity.type.title;
      const activityTitle = log.activity.title;

      if (!acc[activityType]) {
        acc[activityType] = {};
      }

      if (!acc[activityType][activityTitle]) {
        acc[activityType][activityTitle] = {
          sum: 0,
          rows: [],
        };
      }

      // Add log details to rows and update the sum
      acc[activityType][activityTitle].rows.push(log);
      acc[activityType][activityTitle].sum += log.time_min;

      return acc;
    }, {});

    return {
      history: groupedHistory,
    };
  } catch (error) {
    console.error('Error fetching history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
