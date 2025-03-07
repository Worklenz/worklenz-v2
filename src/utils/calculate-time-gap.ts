import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export function calculateTimeGap(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
}
