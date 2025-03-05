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

    const query = getQuery(event);
    const year = parseInt(query.year, 10);
    const month = query.month ? parseInt(query.month, 10) - 1 : null; // Convert month number (1-12) to index (0-11)
    const mode = month !== null ? 'month' : 'year';

    let startOfCurrentRange, endOfCurrentRange;
    if (mode === 'month') {
      startOfCurrentRange = dayjs().year(year).month(month).startOf('month');
      endOfCurrentRange = startOfCurrentRange.endOf('month');
    } else {
      startOfCurrentRange = dayjs().year(year).startOf('year');
      endOfCurrentRange = startOfCurrentRange.endOf('year');
    }

    // Previous period
    let startOfPreviousRange, endOfPreviousRange;
    if (mode === 'month') {
      startOfPreviousRange = startOfCurrentRange.subtract(1, 'month').startOf('month');
      endOfPreviousRange = startOfPreviousRange.endOf('month');
    } else {
      startOfPreviousRange = startOfCurrentRange.subtract(1, 'year').startOf('year');
      endOfPreviousRange = startOfPreviousRange.endOf('year');
    }

    // Fetch logs
    const logs = await Log.find({
      created_by: session.user.userId,
      created_at: {
        $gte: startOfPreviousRange.toDate(),
        $lte: endOfCurrentRange.toDate(),
      },
    })
      .select('activity time_min date created_at')
      .populate({ path: 'activity', model: Activity, select: 'title color' });

    let totalCurrentRange = 0;
    let totalPreviousRange = 0;
    let mostActive = { label: '', totalMin: 0 };
    let leastActive = { label: '', totalMin: Infinity };

    const perActivityCurrent = {};
    const perActivityPrevious = {};
    const activityNames = {};
    const activityColors = {};
    const periodSums = {};

    for (const log of logs) {
      const logDate = dayjs(log.date);
      const activity = log.activity;
      const activityId = activity._id.toString();
      const minutes = log.time_min;

      if (!activityNames[activityId]) {
        activityNames[activityId] = activity.title ?? 'Unknown';
        activityColors[activityId] = activity.color ?? '#000000';
      }

      const key = mode === 'month' ? logDate.format('YYYY-MM-DD') : logDate.format('YYYY-MM');

      if (logDate.isBetween(startOfCurrentRange, endOfCurrentRange, 'day', '[]')) {
        totalCurrentRange += minutes;
        perActivityCurrent[activityId] = (perActivityCurrent[activityId] || 0) + minutes;
        periodSums[key] = (periodSums[key] || 0) + minutes;
      }

      if (logDate.isBetween(startOfPreviousRange, endOfPreviousRange, 'day', '[]')) {
        totalPreviousRange += minutes;
        perActivityPrevious[activityId] = (perActivityPrevious[activityId] || 0) + minutes;
      }
    }

    for (const [key, totalMin] of Object.entries(periodSums)) {
      if (totalMin > mostActive.totalMin) mostActive = { label: key, totalMin };
      if (totalMin < leastActive.totalMin) leastActive = { label: key, totalMin };
    }

    if (leastActive.totalMin === Infinity) leastActive = { label: '', totalMin: 0 };

    // Calculate % changes
    const overallChange = totalPreviousRange
      ? ((totalCurrentRange - totalPreviousRange) / totalPreviousRange) * 100
      : 0;

    const activityProgress = Object.entries(perActivityCurrent).map(([id, total]) => {
      // Calculate percentage for each activity based on the current period total
      const percentage = totalCurrentRange > 0 ? ((total / totalCurrentRange) * 100).toFixed(2) : 0;

      return {
        activityId: id,
        activityName: activityNames[id],
        totalMin: total,
        percentage: percentage, // Add the percentage for current period
        activityColor: activityColors[id],
      };
    });

    // Ensure the `performanceByActivity` is correctly returned

    // Convert most/least active labels
    if (mode === 'month') {
      mostActive.label = `${dayjs(mostActive.label).format('DD MMMM')} (${dayjs(mostActive.label).format('dddd')})`;
      leastActive.label = `${dayjs(leastActive.label).format('DD MMMM')} (${dayjs(leastActive.label).format('dddd')})`;
    } else {
      mostActive.label = dayjs(mostActive.label, 'YYYY-MM').format('MMMM YYYY');
      leastActive.label = dayjs(leastActive.label, 'YYYY-MM').format('MMMM YYYY');
    }

    // Get the period label
    const periodLabel =
      mode === 'month' ? dayjs(startOfCurrentRange).format('MMMM') : year.toString();

    return {
      report: {
        dateRange: {
          start: startOfCurrentRange.format('YYYY-MM-DD'),
          end: endOfCurrentRange.format('YYYY-MM-DD'),
        },
        overallPerformance: totalCurrentRange,
        performanceByActivity: activityProgress,
        overallChange,
        mostActive,
        leastActive,
        periodLabel,
        mode,
      },
    };
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
});
