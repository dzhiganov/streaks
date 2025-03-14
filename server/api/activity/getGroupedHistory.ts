import { getServerSession } from '#auth';
import { defineEventHandler, getQuery } from 'h3';
import * as Models from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in.',
      });
    }

    const { date, from, to, limit = '5' } = query;
    const limitNumber = Math.max(1, parseInt(limit, 10));

    if (!date && (!from || !to)) {
      throw new Error('Either "date" or "range" (from and to) must be provided');
    }

    let dateFilter = {};
    if (date) {
      const specificDate = new Date(String(date));
      if (isNaN(specificDate.getTime())) {
        throw new Error('Invalid "date" parameter');
      }
      specificDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(specificDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dateFilter = { date: { $gte: specificDate, $lt: nextDay } };
    } else if (from && to) {
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

    const groupedHistory = logs.reduce((acc, log) => {
      const activityType = log.activity.type.title;
      const activityTitle = log.activity.title;
      const activityId = log.activity._id.toString();
      const activityTypeId = log.activity.type._id.toString();

      if (!acc[activityType]) {
        acc[activityType] = {};
      }

      if (!acc[activityType][activityTitle]) {
        acc[activityType][activityTitle] = {
          activityId,
          typeId: activityTypeId,
          type: activityType,
          sum: 0,
          rows: [],
          color: log.activity.color,
        };
      }

      acc[activityType][activityTitle].sum += log.time_min;
      acc[activityType][activityTitle].rows.push(log);

      return acc;
    }, {});

    const limitedHistory = Object.entries(groupedHistory).reduce((acc, [type, activities]) => {
      acc[type] = Object.entries(activities).reduce((activityAcc, [title, data]) => {
        activityAcc[title] = {
          sum: data.sum,
          rows: data.rows.slice(0, Number(limit) === 0 ? data.rows.length : limitNumber),
          color: data.color,
        };
        return activityAcc;
      }, {});
      return acc;
    }, {});

    return {
      history: limitedHistory,
      limit: Number(limit) === 0 ? null : limitNumber,
      from,
      to,
    };
  } catch (error) {
    console.error('Error fetching history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
