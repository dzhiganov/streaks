import { getServerSession } from '#auth';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import minMax from 'dayjs/plugin/minMax.js';
import { defineEventHandler, getQuery } from 'h3';
import { Activity, Log } from '~~/server/models/user.model';

dayjs.extend(minMax);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You must be logged in.',
      });
    }

    const now = dayjs();
    const query = getQuery(event);

    let startOfCurrentRange;
    let endOfCurrentRange;
    if (query.from && query.to) {
      startOfCurrentRange = dayjs(query.from);
      endOfCurrentRange = dayjs(query.to);
    } else {
      startOfCurrentRange = now.startOf('isoWeek'); // Monday
      endOfCurrentRange = now.endOf('isoWeek');
    }

    const diffDays = endOfCurrentRange.diff(startOfCurrentRange, 'day') + 1;
    const endOfPreviousRange = startOfCurrentRange.subtract(1, 'day');
    const startOfPreviousRange = endOfPreviousRange.subtract(diffDays - 1, 'day');

    const logs = await Log.find({
      created_by: session.user.userId,
      created_at: {
        $gte: startOfPreviousRange.toDate(),
        $lte: endOfCurrentRange.toDate(),
      },
    })
      .select('activity time_min date created_at')
      .populate({
        path: 'activity',
        model: Activity,
        select: 'title week_time_goal_min day_time_goal_min',
      });

    let totalCurrentRange = 0;
    let totalPreviousRange = 0;
    let mostActiveDay = { date: '', totalMin: 0 };
    let leastActiveDay = { date: '', totalMin: Infinity };

    const perActivityCurrentRange: Record<string, number> = {};
    const perActivityPreviousRange: Record<string, number> = {};
    const currentRangeDaySums: Record<string, number> = {};
    const activityNames: Record<string, string> = {};

    for (const log of logs) {
      const logDate = dayjs(log.date);
      const activity = log.activity;
      const activityId = activity._id.toString();
      const minutes = log.time_min;

      if (!activityNames[activityId]) {
        activityNames[activityId] = activity.title ?? 'Unknown';
      }

      if (logDate.isBetween(startOfCurrentRange, endOfCurrentRange, 'day', '[]')) {
        totalCurrentRange += minutes;
        perActivityCurrentRange[activityId] = (perActivityCurrentRange[activityId] || 0) + minutes;

        const dateKey = logDate.format('YYYY-MM-DD');
        currentRangeDaySums[dateKey] = (currentRangeDaySums[dateKey] || 0) + minutes;
      }

      if (logDate.isBetween(startOfPreviousRange, endOfPreviousRange, 'day', '[]')) {
        totalPreviousRange += minutes;
        perActivityPreviousRange[activityId] =
          (perActivityPreviousRange[activityId] || 0) + minutes;
      }
    }

    // Determine most and least productive day
    for (const [date, totalMin] of Object.entries(currentRangeDaySums)) {
      if (totalMin > mostActiveDay.totalMin) {
        mostActiveDay = { date, totalMin };
      }
      if (totalMin < leastActiveDay.totalMin) {
        leastActiveDay = { date, totalMin };
      }
    }

    // Handle cases where no logs exist
    if (leastActiveDay.totalMin === Infinity) {
      leastActiveDay = { date: '', totalMin: 0 };
    }

    const overallPerformance = totalCurrentRange;

    const performanceByActivity = Object.entries(perActivityCurrentRange).map(([id, total]) => ({
      activityId: id,
      activityName: activityNames[id] || 'Unknown',
      totalMin: total,
    }));

    const dateRange = {
      start: startOfCurrentRange.format('YYYY-MM-DD'),
      end: endOfCurrentRange.format('YYYY-MM-DD'),
    };

    const report = {
      dateRange,
      overallPerformance,
      performanceByActivity,
      mostActiveDay,
      leastActiveDay,
    };

    return { report };
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
});
