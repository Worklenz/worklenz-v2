import { format } from 'date-fns';

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy, h:mm:ss a');
};
