import { getServerSession } from '#auth';
import { createError, defineEventHandler, getQuery } from 'h3';
import * as Models from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);
    const { from, to, range } = query;
    if (!from || !to) {
      throw new Error('Range requires "from" and "to" parameters');
    }

    const fromDate = new Date(String(from));
    const toDate = new Date(String(to));
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()))
      throw new Error('Invalid "from" or "to" parameter');
    if (fromDate > toDate) throw new Error('"from" date must be earlier than "to" date');
    toDate.setHours(23, 59, 59, 999);
    const dateFilter = { date: { $gte: fromDate, $lte: toDate } };

    // Group by month if range is "year"; otherwise, group by day.
    const grouping = range === 'year' ? 'month' : 'day';

    const logs = await Models.Log.find({
      created_by: session.user.userId,
      ...dateFilter,
    })
      .select('activity date time_min')
      .populate({
        path: 'activity',
        model: Models.Activity,
        select: 'title color type',
        populate: {
          path: 'type',
          model: Models.ActivityType,
          select: 'title',
        },
      });

    const groupedHistory = {};
    logs.forEach((log) => {
      const activityType = log.activity.type.title;
      const activityTitle = log.activity.title;
      const activityId = log.activity._id.toString();
      const typeId = log.activity.type._id.toString();

      // Compute the grouping key based on the required aggregation.
      const logDate = new Date(log.date);
      let key = '';
      if (grouping === 'day') {
        key = logDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (grouping === 'month') {
        key = logDate.toISOString().slice(0, 7); // YYYY-MM
      }

      if (!groupedHistory[activityType]) {
        groupedHistory[activityType] = {};
      }
      if (!groupedHistory[activityType][activityTitle]) {
        groupedHistory[activityType][activityTitle] = {
          activityId,
          typeId,
          type: activityType,
          title: activityTitle,
          sum: 0,
          aggregated: {},
          color: log.activity.color,
        };
      }
      const agg = groupedHistory[activityType][activityTitle];
      agg.sum += log.time_min;
      agg.aggregated[key] = (agg.aggregated[key] || 0) + log.time_min;
    });

    // Convert aggregated data to sorted rows.
    Object.keys(groupedHistory).forEach((type) => {
      Object.keys(groupedHistory[type]).forEach((activity) => {
        const agg = groupedHistory[type][activity].aggregated;
        const rows = Object.entries(agg).map(([date, time_min]) => ({ date, time_min }));
        rows.sort((a, b) => a.date.localeCompare(b.date));
        groupedHistory[type][activity].rows = rows;
        delete groupedHistory[type][activity].aggregated;
      });
    });

    return { history: groupedHistory, from, to };
  } catch (error) {
    console.error('Error fetching aggregated history:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
