export const durationDateFormat = (date: Date | null): string => {
  if (!date) return '-';

  const givenDate = new Date(date);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate.getTime() - givenDate.getTime();

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths =
    currentDate.getMonth() -
    givenDate.getMonth() +
    12 * (currentDate.getFullYear() - givenDate.getFullYear());
  const diffInYears = currentDate.getFullYear() - givenDate.getFullYear();

  if (diffInYears > 0) {
    return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
  } else if (diffInMonths > 0) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? '1 minute ago'
      : `${diffInMinutes} minutes ago`;
  } else {
    return diffInSeconds === 1
      ? '1 second ago'
      : `${diffInSeconds} seconds ago`;
  }
};
