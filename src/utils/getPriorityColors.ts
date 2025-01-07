import { TaskPriorityType } from '../types/task.types';

type ThemeMode = 'default' | 'dark';

const priorityColors = {
  default: {
    high: '#f6bfc0',
    medium: '#f9e3b1',
    low: '#c2e4d0',
  },
  dark: {
    high: '#ff4141',
    medium: '#ffc227',
    low: '#46d980',
  },
};

export const getPriorityColor = (
  priority: string,
  themeMode: ThemeMode
): string => {
  const colors = priorityColors[themeMode];
  return colors[priority as TaskPriorityType];
};
