export function groupHistoryByActivityType(history) {
  return history.reduce((grouped, entry) => {
    const activityTypeTitle = entry.activity?.type?.title || 'Unknown';
    const activityTitle = entry.activity?.title || 'Unknown Activity';

    if (!grouped[activityTypeTitle]) {
      grouped[activityTypeTitle] = {};
    }

    if (!grouped[activityTypeTitle][activityTitle]) {
      grouped[activityTypeTitle][activityTitle] = {
        title: entry.activity.title,
        icon: entry.activity.icon,
        color: entry.activity.color,
        description: entry.activity.description,
        sum_min: 0,
        week_time_goal_min: entry.activity.week_time_goal_min,
        day_time_goal_min: entry.activity.day_time_goal_min,
        month_time_goal_min: entry.activity.month_time_goal_min,
      };
    }

    grouped[activityTypeTitle][activityTitle].sum_min += entry.time_min;

    return grouped;
  }, {});
}
