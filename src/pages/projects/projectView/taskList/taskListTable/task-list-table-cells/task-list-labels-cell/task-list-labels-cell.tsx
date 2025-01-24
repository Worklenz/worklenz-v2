import { Flex } from 'antd';
import React from 'react';
import CustomColordLabel from '../../../../../../../components/taskListCommon/labelsSelector/CustomColordLabel';
import CustomNumberLabel from '../../../../../../../components/taskListCommon/labelsSelector/CustomNumberLabel';
import LabelsSelector from '../../../../../../../components/taskListCommon/labelsSelector/LabelsSelector';
import { LabelType } from '../../../../../../../types/label.type';

type TaskListLabelsCellProps = {
  labels: LabelType[];
  taskId: string;
};

const TaskListLabelsCell = ({ labels, taskId }: TaskListLabelsCellProps) => {
  return (
    <Flex>
      {labels && labels?.length <= 2 ? (
        labels?.map((label) => <CustomColordLabel label={label} />)
      ) : (
        <Flex>
          <CustomColordLabel label={labels ? labels[0] : null} />
          <CustomColordLabel label={labels ? labels[1] : null} />
          {/* this component show other label names  */}
          <CustomNumberLabel
            // this label list get the labels without 1, 2 elements
            labelList={labels ? labels : null}
          />
        </Flex>
      )}
      <LabelsSelector taskId={taskId} />
    </Flex>
  );
};

export default TaskListLabelsCell;
