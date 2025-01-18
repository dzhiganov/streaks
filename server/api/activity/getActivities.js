import { getServerSession } from '#auth';
import { defineEventHandler } from 'h3';
import { Activity, Log } from '~~/server/models/user.model';

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const activities = await Activity.find({ created_by: session.user.userId });

    const logs = await Log.find({
      created_by: session.user.userId,
      created_at: {
        $gte: startOfMonth,
        $lt: endOfMonth,
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

      const logDate = new Date(log.date);
      const now = new Date();

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      if (logDate.toDateString() === now.toDateString()) {
        acc[activityId].day += log.time_min;
      }
      if (logDate >= startOfWeek && logDate <= endOfWeek) {
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
        week_rest_time_min: activity.week_time_goal_min
          ? Math.max(0, activity.week_time_goal_min - activityLogs.week)
          : 0,
        day_rest_time_min: activity.day_time_goal_min
          ? Math.max(0, activity.day_time_goal_min - activityLogs.day)
          : 0,
        month_rest_time_min: activity.month_time_goal_min
          ? Math.max(0, activity.month_time_goal_min - activityLogs.month)
          : 0,
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
