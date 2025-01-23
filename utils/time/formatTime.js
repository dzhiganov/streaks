export const formatTime = ({ seconds = 0, minutes = 0, hours = 0 }) => {
  // Convert all to seconds
  let totalSeconds = seconds + minutes * 60 + hours * 3600;

  if (totalSeconds < 60) {
    return `${totalSeconds} second${totalSeconds !== 1 ? 's' : ''}`;
  }

  const totalMinutes = Math.floor(totalSeconds / 60);
  totalSeconds %= 60;

  if (totalMinutes < 60) {
    return `${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}`;
  }

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    `${totalHours} hour${totalHours !== 1 ? 's' : ''}` +
    (remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : '')
  );
};
