export const formatTime = (
  { seconds = 0, minutes = 0, hours = 0 } = {},
  { short = false } = {},
) => {
  const HOUR = short ? 'h' : 'hour';
  const MINUTE = short ? 'm' : 'minute';
  const SECOND = short ? 's' : 'second';

  // Convert all to seconds
  let totalSeconds = seconds + minutes * 60 + hours * 3600;

  if (totalSeconds < 60) {
    return `${totalSeconds} ${SECOND}${totalSeconds !== 1 && !short ? 's' : ''}`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  totalSeconds %= 60;

  if (totalMinutes < 60) {
    return `${totalMinutes} ${MINUTE}${totalMinutes !== 1 && !short ? 's' : ''}`;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    `${totalHours} ${HOUR}${totalHours !== 1 && !short ? 's' : ''}` +
    (remainingMinutes > 0
      ? ` ${remainingMinutes} ${MINUTE}${remainingMinutes !== 1 && !short ? 's' : ''}`
      : '')
  );
};
