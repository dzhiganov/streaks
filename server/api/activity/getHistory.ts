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

    const { date, from, to, page = '1', pageSize = '10' } = query;
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSizeNumber = Math.max(1, parseInt(pageSize, 10));

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

    // Count total items (for pagination metadata)
    const totalItems = await Models.Log.countDocuments({
      created_by: session.user.userId,
      ...dateFilter,
    });

    // Fetch logs with pagination
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
      })
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber);

    return {
      history: logs,
      pagination: {
        page: pageNumber,
        pageSize: pageSizeNumber,
        totalPages: Math.ceil(totalItems / pageSizeNumber),
        totalItems,
      },
    };
  } catch (error) {
    console.error('Error fetching history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
