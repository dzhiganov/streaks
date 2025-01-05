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
      };
    }

    grouped[activityTypeTitle][activityTitle].sum_min += entry.time_min;

    return grouped;
  }, {});
}
