import { getServerSession } from '#auth';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import minMax from 'dayjs/plugin/minMax.js';
import { defineEventHandler } from 'h3';
import { Report } from '~~/server/models/report.model';
import { Activity, Log } from '~~/server/models/user.model';

dayjs.extend(minMax);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const now = dayjs();

    // Calculate Monday–Sunday boundaries for current week
    const startOfCurrentWeek = now.startOf('isoWeek'); // Monday
    const endOfCurrentWeek = now.endOf('isoWeek'); // Sunday

    // For the previous week
    const startOfPreviousWeek = startOfCurrentWeek.subtract(1, 'week');
    const endOfPreviousWeek = endOfCurrentWeek.subtract(1, 'week');

    // Fetch logs from previous-week start to current-week end
    const logs = await Log.find({
      created_by: session.user.userId,
      created_at: {
        $gte: startOfPreviousWeek.toDate(),
        $lte: endOfCurrentWeek.toDate(),
      },
    })
      .select('activity time_min date created_at')
      .populate({
        path: 'activity',
        model: Activity,
        select: 'title week_time_goal_min day_time_goal_min',
      });

    // Basic accumulators
    let totalCurrentWeek = 0;
    let totalPreviousWeek = 0;
    const perActivityCurrentWeek: Record<string, number> = {};
    const perActivityPreviousWeek: Record<string, number> = {};
    const currentWeekDaySums: Record<string, number> = {};

    // We'll also collect activity names here
    const activityNames: Record<string, string> = {};

    for (const log of logs) {
      const logDate = dayjs(log.date);
      const activity = log.activity;
      const activityId = activity._id.toString();
      const minutes = log.time_min;

      // Store name in a lookup
      if (!activityNames[activityId]) {
        activityNames[activityId] = activity.title ?? 'Unknown';
      }

      // Current week sums
      if (logDate.isBetween(startOfCurrentWeek, endOfCurrentWeek, 'day', '[]')) {
        totalCurrentWeek += minutes;
        perActivityCurrentWeek[activityId] = (perActivityCurrentWeek[activityId] || 0) + minutes;

        // Tally day sums (for pick vs. weak day)
        const dateKey = logDate.format('YYYY-MM-DD');
        currentWeekDaySums[dateKey] = (currentWeekDaySums[dateKey] || 0) + minutes;
      }

      // Previous week sums
      if (logDate.isBetween(startOfPreviousWeek, endOfPreviousWeek, 'day', '[]')) {
        totalPreviousWeek += minutes;
        perActivityPreviousWeek[activityId] = (perActivityPreviousWeek[activityId] || 0) + minutes;
      }
    }

    // 1) Overall performance (current week)
    const overallPerformance = totalCurrentWeek; // in minutes

    // 2) Performance by activity (with name)
    const performanceByActivity = Object.entries(perActivityCurrentWeek).map(([id, total]) => ({
      activityId: id,
      activityName: activityNames[id] || 'Unknown',
      totalMin: total,
    }));

    // 3) Pick day & 4) Weak day
    let bestDay = { date: '', totalMin: 0 };
    let worstDay = { date: '', totalMin: Infinity };
    for (const [day, total] of Object.entries(currentWeekDaySums)) {
      if (total > bestDay.totalMin) {
        bestDay = { date: day, totalMin: total };
      }
      if (total < worstDay.totalMin) {
        worstDay = { date: day, totalMin: total };
      }
    }
    // If no data at all, worstDay remains Infinity
    if (worstDay.totalMin === Infinity) {
      worstDay = { date: '', totalMin: 0 };
    }

    // 5) Comparison with previous week
    let overallDifferencePercentage = 0;

    if (totalPreviousWeek > 0) {
      overallDifferencePercentage =
        ((overallPerformance - totalPreviousWeek) / totalPreviousWeek) * 100;
    } else if (overallPerformance > 0) {
      // If there was no activity last week but there's activity now, consider it a 100%+ increase
      overallDifferencePercentage = 100;
    } else {
      // No activity both weeks
      overallDifferencePercentage = 0;
    }

    const activityDifferences = Object.entries(perActivityCurrentWeek).map(([id, curr]) => {
      const prev = perActivityPreviousWeek[id] || 0;
      return {
        activityId: id,
        activityName: activityNames[id] || 'Unknown',
        differenceMin: curr - prev,
      };
    });

    // Add week ranges to final report
    const dateRangeCurrentWeek = {
      start: startOfCurrentWeek.format('YYYY-MM-DD'),
      end: endOfCurrentWeek.format('YYYY-MM-DD'),
    };
    const dateRangePreviousWeek = {
      start: startOfPreviousWeek.format('YYYY-MM-DD'),
      end: endOfPreviousWeek.format('YYYY-MM-DD'),
    };

    // Construct final weekly report
    const report = {
      // Weekly ranges
      dateRangeCurrentWeek,
      dateRangePreviousWeek,

      // Data
      overallPerformance,
      performanceByActivity,
      bestDay,
      worstDay,
      comparison: {
        overallPerformance,
        totalPreviousWeek,
        overallDifferencePercentage,
        activityDifferences,
      },
    };

    const res = await Report.create({
      user_id: session.user.userId,
      data: report,
      type: 'weekly',
      period_start: startOfCurrentWeek.toDate(),
      period_end: endOfCurrentWeek.toDate(),
    });

    console.log('Report created: ', res);
  } catch (err) {
    console.error('Error while creating weekly report: ', err);
    throw err;
  }
});
