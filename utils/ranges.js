import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const getCurrentWeekRange = (date = new Date()) => {
  const monday = dayjs(date).startOf('isoWeek');
  const sunday = dayjs(date).endOf('isoWeek');

  return {
    from: monday.format('YYYY-MM-DD'),
    to: sunday.format('YYYY-MM-DD'),
  };
};

export const getCurrentMonthRange = (date = new Date()) => {
  const firstDayOfMonth = dayjs(date).startOf('month');
  const lastDayOfMonth = dayjs(date).endOf('month');

  return {
    from: firstDayOfMonth.format('YYYY-MM-DD'),
    to: lastDayOfMonth.format('YYYY-MM-DD'),
  };
};

export const getCurrentYearRange = (date = new Date()) => {
  const firstDayOfYear = dayjs(date).startOf('year');
  const lastDayOfYear = dayjs(date).endOf('year');

  return {
    from: firstDayOfYear.format('YYYY-MM-DD'),
    to: lastDayOfYear.format('YYYY-MM-DD'),
  };
};

export const getCurrentDayRange = (date = new Date()) => {
  const start = dayjs(date).startOf('day');
  const end = dayjs(date).endOf('day');

  return {
    from: start.format('YYYY-MM-DD'),
    to: end.format('YYYY-MM-DD'),
  };
};
