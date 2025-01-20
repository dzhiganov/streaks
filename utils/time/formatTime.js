import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatTime = ({ seconds = 0, minutes = 0, hours = 0 }) => {
  const totalDuration = dayjs.duration({
    seconds,
    minutes,
    hours,
  });

  const totalHours = Math.floor(totalDuration.asHours());
  const totalMinutes = totalDuration.minutes();
  const totalSeconds = totalDuration.seconds();

  if (totalHours > 0) {
    return (
      `${totalHours} hour${totalHours !== 1 ? 's' : ''}` +
      (totalMinutes > 0 ? ` ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}` : '')
    );
  }

  if (totalMinutes > 0) {
    return (
      `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}` +
      (totalSeconds > 0 ? ` ${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}` : '')
    );
  }

  return `${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`;
};
