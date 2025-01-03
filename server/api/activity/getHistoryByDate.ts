import * as Models from "~~/server/models/user.model";
import { defineEventHandler, getQuery } from "h3";
import { getServerSession } from "#auth";

function groupHistoryByActivityType(history) {
    return history.reduce((grouped, entry) => {
      const activityTypeTitle = entry.activity?.type?.title || 'Unknown';
      const activityTitle = entry.activity?.title || 'Unknown Activity';
  
      if (!grouped[activityTypeTitle]) {
        grouped[activityTypeTitle] = {};
      }

      console.log('entry.activity', entry.activity)
  
      if (!grouped[activityTypeTitle][activityTitle]) {
        grouped[activityTypeTitle][activityTitle] = {
          title: entry.activity.title,
          icon: entry.activity.icon,
          color: entry.activity.color,
          description: entry.activity.description,
          sum_min: 0,
        };
      }
  
      grouped[activityTypeTitle][activityTitle].sum_min += entry.time_min;
  
      return grouped;
    }, {});
  }

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const session = await getServerSession(event);

    const startOfDay = new Date(String(query.date));
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(String(query.date));
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await Models.Log.find({
        created_by: session.user.userId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }).select('activity created_by date from to time_min created_at created_by')
        .populate({
          path: 'activity',
          model: Models.Activity,
          select: 'title color icon type description',
          populate: {
            path: 'type',
            model: Models.ActivityType,
            select: 'title',
          },
        });

    return {
        history: groupHistoryByActivityType(logs)
    };
  } catch (error) {
    console.error('Error fetching history:', error.message);
    throw error;
  }
})

