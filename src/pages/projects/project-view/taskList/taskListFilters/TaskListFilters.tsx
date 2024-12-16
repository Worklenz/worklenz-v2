// Ant Design Components
import { Checkbox, Flex, Typography } from 'antd';

// Components
import SearchDropdown from './SearchDropdown';
import SortFilterDropdown from './SortFilterDropdown';
import LabelsFilterDropdown from './LabelsFilterDropdown';
import MembersFilterDropdown from './MembersFilterDropdown';
import GroupByFilterDropdown from './GroupByFilterDropdown';
import ShowFieldsFilterDropdown from './ShowFieldsFilterDropdown';
import PriorityFilterDropdown from './PriorityFilterDropdown';

// Hooks & Utils
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

// Redux Actions
import { fetchPriorities } from '@/features/taskAttributes/taskPrioritySlice';
import { fetchLabels } from '@/features/taskAttributes/taskLabelSlice';

interface TaskListFiltersProps {
  position: 'board' | 'list';
}

const TaskListFilters: React.FC<TaskListFiltersProps> = ({ position }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('task-list-filters');

  // Selectors
  const priorities = useAppSelector(state => state.priorityReducer.priorities);
  const labels = useAppSelector(state => state.taskLabelsReducer.labels);
  const members = useAppSelector(state => state.memberReducer.membersList);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!priorities.length) {
        await dispatch(fetchPriorities());
      }
      if (!labels.length) {
        await dispatch(fetchLabels());
      }
    };

    fetchInitialData();
  }, [dispatch, priorities.length, labels.length]);

  const renderCommonFilters = () => (
    <>
      <SearchDropdown />
      <SortFilterDropdown />
      <PriorityFilterDropdown priorities={priorities} />
      <LabelsFilterDropdown labels={labels} />
      <MembersFilterDropdown members={members} />
    </>
  );

  const renderListSpecificFilters = () => (
    <>
      <GroupByFilterDropdown />
      <Flex gap={12} wrap="wrap">
        <Flex gap={4} align="center">
          <Checkbox />
          <Typography.Text>{t('showArchivedText')}</Typography.Text>
        </Flex>
        <ShowFieldsFilterDropdown />
      </Flex>
    </>
  );

  return (
    <Flex gap={8} align="center" justify="space-between">
      <Flex gap={8} wrap="wrap">
        {renderCommonFilters()}
        {position === 'list' && <GroupByFilterDropdown />}
      </Flex>

      {position === 'list' && renderListSpecificFilters()}
    </Flex>
  );
};

export default TaskListFilters;
