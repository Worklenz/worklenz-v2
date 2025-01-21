export const getDatesDuration = (start: Date, end: Date): number => {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error('Invalid date objects provided');
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
};
