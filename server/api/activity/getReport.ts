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
    const now = dayjs();
    const query = getQuery(event);

    // Use provided date range or fallback to current ISO week (Mon-Sun)
    let startOfCurrentRange;
    let endOfCurrentRange;
    if (query.start && query.end) {
      startOfCurrentRange = dayjs(query.start);
      endOfCurrentRange = dayjs(query.end);
    } else {
      startOfCurrentRange = now.startOf('isoWeek');
      endOfCurrentRange = now.endOf('isoWeek');
    }

    // Compute previous range of equal length immediately preceding the current range
    const diffDays = endOfCurrentRange.diff(startOfCurrentRange, 'day') + 1;
    const endOfPreviousRange = startOfCurrentRange.subtract(1, 'day');
    const startOfPreviousRange = endOfPreviousRange.subtract(diffDays - 1, 'day');

    // Fetch logs covering both previous and current ranges
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

    // Accumulators for the current and previous ranges
    let totalCurrentRange = 0;
    let totalPreviousRange = 0;
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

      // Sum logs in the current range
      if (logDate.isBetween(startOfCurrentRange, endOfCurrentRange, 'day', '[]')) {
        totalCurrentRange += minutes;
        perActivityCurrentRange[activityId] = (perActivityCurrentRange[activityId] || 0) + minutes;
        const dateKey = logDate.format('YYYY-MM-DD');
        currentRangeDaySums[dateKey] = (currentRangeDaySums[dateKey] || 0) + minutes;
      }

      // Sum logs in the previous range
      if (logDate.isBetween(startOfPreviousRange, endOfPreviousRange, 'day', '[]')) {
        totalPreviousRange += minutes;
        perActivityPreviousRange[activityId] =
          (perActivityPreviousRange[activityId] || 0) + minutes;
      }
    }

    // 1) Overall performance in the current range (in minutes)
    const overallPerformance = totalCurrentRange;

    // 2) Performance by activity in the current range
    const performanceByActivity = Object.entries(perActivityCurrentRange).map(([id, total]) => ({
      activityId: id,
      activityName: activityNames[id] || 'Unknown',
      totalMin: total,
    }));

    // 3) Determine best and worst days within the current range
    let bestDay = { date: '', totalMin: 0 };
    let worstDay = { date: '', totalMin: Infinity };
    for (const [day, total] of Object.entries(currentRangeDaySums)) {
      if (total > bestDay.totalMin) {
        bestDay = { date: day, totalMin: total };
      }
      if (total < worstDay.totalMin) {
        worstDay = { date: day, totalMin: total };
      }
    }
    if (worstDay.totalMin === Infinity) {
      worstDay = { date: '', totalMin: 0 };
    }

    // 4) Comparison with the previous range
    let overallDifferencePercentage = 0;
    if (totalPreviousRange > 0) {
      overallDifferencePercentage =
        ((overallPerformance - totalPreviousRange) / totalPreviousRange) * 100;
    } else if (overallPerformance > 0) {
      overallDifferencePercentage = 100;
    } else {
      overallDifferencePercentage = 0;
    }
    const activityDifferences = Object.entries(perActivityCurrentRange).map(([id, curr]) => {
      const prev = perActivityPreviousRange[id] || 0;
      return {
        activityId: id,
        activityName: activityNames[id] || 'Unknown',
        differenceMin: curr - prev,
      };
    });

    // Final report includes the current and previous date ranges
    const dateRangeCurrent = {
      start: startOfCurrentRange.format('YYYY-MM-DD'),
      end: endOfCurrentRange.format('YYYY-MM-DD'),
    };
    const dateRangePrevious = {
      start: startOfPreviousRange.format('YYYY-MM-DD'),
      end: endOfPreviousRange.format('YYYY-MM-DD'),
    };

    const report = {
      dateRangeCurrent,
      dateRangePrevious,
      overallPerformance,
      performanceByActivity,
      bestDay,
      worstDay,
      comparison: {
        overallPerformance,
        totalPreviousRange,
        overallDifferencePercentage,
        activityDifferences,
      },
    };

    return { report };
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
});
