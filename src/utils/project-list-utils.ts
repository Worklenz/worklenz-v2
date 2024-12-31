import { DATE_FORMAT_OPTIONS } from '@/shared/constants';
import { IProjectViewModel } from '@/types/project/projectViewModel.types';
import { toggleArchiveProject } from '@/features/projects/projectsSlice';
import { AppDispatch } from '@/app/store';
import { toggleArchiveProjectForAll } from '@/features/projects/projectsSlice';

interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

export const formatDateRange = ({ startDate, endDate }: DateRange): string => {
  const formattedStart = startDate
    ? new Date(startDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
    : 'N/A';
  const formattedEnd = endDate
    ? new Date(endDate).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
    : 'N/A';

  return `Start date: ${formattedStart}\nEnd date: ${formattedEnd}`;
};

export const getTaskProgressTitle = (data: IProjectViewModel): string => {
  if (!data.all_tasks_count) return 'No tasks available.';
  if (data.all_tasks_count === data.completed_tasks_count) return 'All tasks completed.';
  return `${data.completed_tasks_count || 0}/${data.all_tasks_count || 0} tasks completed.`;
};

export const handleArchive = async (
  recordId: string | undefined,
  dispatch: AppDispatch,
  isOwnerOrAdmin: boolean
) => {
  if (!recordId) return;
  try {
    if (isOwnerOrAdmin) {
      await dispatch(toggleArchiveProjectForAll(recordId));
    } else {
      await dispatch(toggleArchiveProject(recordId));
    }
  } catch (error) {
    console.error('Failed to archive project:', error);
  }
};
