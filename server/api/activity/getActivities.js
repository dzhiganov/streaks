import { getServerSession } from '#auth';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import { defineEventHandler } from 'h3';
import { Activity, Log } from '~~/server/models/user.model';

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

    const startOfWeek = now.startOf('isoWeek');
    const endOfWeek = now.endOf('isoWeek');

    const startOfMonth = now.startOf('month');
    const endOfMonth = now.add(1, 'month').startOf('month');

    const lowerBound = startOfWeek.isBefore(startOfMonth) ? startOfWeek : startOfMonth;
    const upperBound = endOfWeek.isAfter(endOfMonth) ? endOfWeek : endOfMonth;

    const logs = await Log.find({
      created_by: session.user.userId,
      created_at: {
        $gte: lowerBound.toDate(),
        $lt: upperBound.toDate(),
      },
    })
      .select('activity time_min date')
      .populate({
        path: 'activity',
        model: Activity,
        select: 'week_time_goal_min day_time_goal_min month_time_goal_min',
      });

    const logsByActivity = logs.reduce((acc, log) => {
      const activityId = log.activity._id.toString();
      acc[activityId] = acc[activityId] || { week: 0, day: 0, month: 0 };
      const logDate = dayjs(log.date);

      if (logDate.isSame(now, 'day')) {
        acc[activityId].day += log.time_min;
      }
      if (logDate.isBetween(startOfWeek, endOfWeek, null, '[]')) {
        acc[activityId].week += log.time_min;
      }
      if (logDate.isSame(now, 'month')) {
        acc[activityId].month += log.time_min;
      }

      return acc;
    }, {});

    const activities = await Activity.find({ created_by: session.user.userId });
    const updatedActivities = activities.map((activity) => {
      const activityLogs = logsByActivity[activity._id.toString()] || { week: 0, day: 0, month: 0 };

      return {
        ...activity.toObject(),
        week_rest_time_min: activity.week_time_goal_min
          ? activity.week_time_goal_min - activityLogs.week
          : 0,
        day_rest_time_min: activity.day_time_goal_min
          ? activity.day_time_goal_min - activityLogs.day
          : 0,
        month_rest_time_min: activity.month_time_goal_min
          ? activity.month_time_goal_min - activityLogs.month
          : 0,
      };
    });

    return {
      activities: updatedActivities.filter((activity) => activity.active),
    };
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
});
