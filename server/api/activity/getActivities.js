import { getServerSession } from '#auth';
import { defineEventHandler } from 'h3';
import { Activity, Log } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    const activities = await Activity.find({ created_by: session.user.userId });

    const logs = await Log.find({ created_by: session.user.userId })
      .select('activity time_min date')
      .populate({
        path: 'activity',
        model: Activity,
        select: 'week_time_goal_min day_time_goal_min month_time_goal_min',
      });

    const logsByActivity = logs.reduce((acc, log) => {
      const activityId = log.activity._id.toString();
      acc[activityId] = acc[activityId] || { week: 0, day: 0, month: 0 };

      const logDate = new Date(log.date);
      const now = new Date();

      if (logDate.toDateString() === now.toDateString()) {
        acc[activityId].day += log.time_min;
      }
      if (
        logDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()) &&
        logDate <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()))
      ) {
        acc[activityId].week += log.time_min;
      }
      if (logDate.getFullYear() === now.getFullYear() && logDate.getMonth() === now.getMonth()) {
        acc[activityId].month += log.time_min;
      }

      return acc;
    }, {});

    const updatedActivities = activities.map((activity) => {
      const activityLogs = logsByActivity[activity._id.toString()] || { week: 0, day: 0, month: 0 };

      return {
        ...activity.toObject(),
        week_rest_time_min: Math.max(0, activity.week_time_goal_min - activityLogs.week),
        day_rest_time_min: Math.max(0, activity.day_time_goal_min - activityLogs.day),
        month_rest_time_min: Math.max(0, activity.month_time_goal_min - activityLogs.month),
      };
    });

    return {
      activities: updatedActivities,
    };
  } catch (err) {
    console.error('Error: ', err);
    throw err;
  }
});
