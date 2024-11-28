import { Checkbox, Flex, Typography } from 'antd';
import SearchDropdown from './SearchDropdown';
import SortFilterDropdown from './SortFilterDropdown';
import LabelsFilterDropdown from './LabelsFilterDropdown';
import MembersFilterDropdown from './MembersFilterDropdown';
import GroupByFilterDropdown from './GroupByFilterDropdown';
import ShowFieldsFilterDropdown from './ShowFieldsFilterDropdown';
import PriorityFilterDropdown from './PriorityFilterDropdown';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { fetchPriorities } from '@/features/taskAttributes/taskPrioritySlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchLabels } from '@/features/taskAttributes/taskLabelSlice';

interface TaskListFiltersProps {
  position: 'board' | 'list';
}

const TaskListFilters: React.FC<TaskListFiltersProps> = ({ position }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('taskListFilters');

  const priorities = useAppSelector(state => state.priorityReducer.priorities);
  const labels = useAppSelector(state => state.taskLabelsReducer.labels);
  const members = useAppSelector(state => state.memberReducer.membersList);

  useEffect(() => {
    if (!priorities.length) dispatch(fetchPriorities());
    if (!labels.length) dispatch(fetchLabels());
  }, [dispatch, priorities, labels]);

  return (
    <Flex gap={8} align="center" justify="space-between">
      <Flex gap={8} wrap={'wrap'}>
        {/* search dropdown  */}
        <SearchDropdown />
        {/* sort dropdown  */}
        <SortFilterDropdown />
        {/* prioriy dropdown  */}
        <PriorityFilterDropdown priorities={priorities} />
        {/* labels dropdown  */}
        <LabelsFilterDropdown labels={labels} />
        {/* members dropdown  */}
        <MembersFilterDropdown members={members} />
        {/* group by dropdown */}
        {position === 'list' && <GroupByFilterDropdown />}
      </Flex>

      {position === 'list' && (
        <Flex gap={12} wrap={'wrap'}>
          <Flex gap={4} align="center">
            <Checkbox />
            <Typography.Text>{t('showArchivedText')}</Typography.Text>
          </Flex>
          {/* show fields dropdown  */}
          <ShowFieldsFilterDropdown />
        </Flex>
      )}
    </Flex>
  );
};

export default TaskListFilters;
