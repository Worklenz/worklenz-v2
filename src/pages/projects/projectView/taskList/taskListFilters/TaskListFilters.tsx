import { Checkbox, Flex, Typography } from 'antd';
import SearchDropdown from './SearchDropdown';
import SortFilterDropdown from './SortFilterDropdown';
import LabelsFilterDropdown from './LabelsFilterDropdown';
import MembersFilterDropdown from './MembersFilterDropdown';
import GroupByFilterDropdown from './GroupByFilterDropdown';
import ShowFieldsFilterDropdown from './ShowFieldsFilterDropdown';
import PriorityFilterDropdown from './PriorityFilterDropdown';

interface TaskListFiltersProps {
  position: 'board' | 'list';
}

const TaskListFilters: React.FC<TaskListFiltersProps> = ({ position }) => {
  return (
    <Flex gap={8} align="center" justify="space-between">
      <Flex gap={8} wrap={'wrap'}>
        {/* search dropdown  */}
        <SearchDropdown />
        {/* sort dropdown  */}
        <SortFilterDropdown />
        {/* prioriy dropdown  */}
        <PriorityFilterDropdown />
        {/* labels dropdown  */}
        <LabelsFilterDropdown />
        {/* members dropdown  */}
        <MembersFilterDropdown />
        {/* group by dropdown */}
        {position === 'list' && <GroupByDropdown />}
      </Flex>

      {position === 'list' && (
        <Flex gap={12} wrap={'wrap'}>
          <Flex gap={4} align="center">
            <Checkbox />
            <Typography.Text>Show archvied</Typography.Text>
          </Flex>
          {/* show fields dropdown  */}
          <ShowFieldsFilterDropdown />
        </Flex>
      )}
    </Flex>
  );
};

export default TaskListFilters;
