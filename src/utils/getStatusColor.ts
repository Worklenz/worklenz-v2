import { TaskStatusType } from '../types/task.types';

type ThemeMode = 'default' | 'dark';

const statusColors = {
  default: {
    todo: '#d8d7d8',
    doing: '#c0d5f6',
    done: '#c2e4d0',
  },
  dark: {
    todo: '#3a3a3a',
    doing: '#3d506e',
    done: '#3b6149',
  },
};

export const getStatusColor = (
  status: string,
  themeMode: ThemeMode
): string => {
  const colors = statusColors[themeMode];
  return colors[status as TaskStatusType];
};
