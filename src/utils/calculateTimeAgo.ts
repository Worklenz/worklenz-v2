import {
  differenceInMinutes,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  formatDistanceToNow,
} from 'date-fns';

import { differenceInSeconds } from 'date-fns';

export function calculateTimeAgo(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();

  const diffInSeconds = differenceInSeconds(now, date);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  if (differenceInYears(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (differenceInMonths(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (differenceInWeeks(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (differenceInDays(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (differenceInHours(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (differenceInMinutes(now, date) > 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return 'Just now';
}
