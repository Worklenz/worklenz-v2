import { TaskStatusType } from '../types/task.types';

type ThemeMode = 'default' | 'dark';

const statusColors = {
  default: {
    todo: '#d8d7d8',
    doing: '#c0d5f6',
    done: '#c2e4d0',
  },
  dark: {
    todo: '#989898',
    doing: '#4190ff',
    done: '#46d980',
  },
};

export const getStatusColor = (
  status: string,
  themeMode: ThemeMode
): string => {
  const colors = statusColors[themeMode];
  return colors[status as TaskStatusType];
};
