import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { PhaseColorCodes } from '../../../../../../../../shared/constants';
import { Button, Flex, Input, Select, Tag, Typography } from 'antd';
import { CloseCircleOutlined, HolderOutlined } from '@ant-design/icons';
import { LabelType } from '../../../../../../../../types/label.type';
import { useAppDispatch } from '../../../../../../../../hooks/useAppDispatch';
import { setLabelsList } from '../../../../../../../../features/projects/singleProject/task-list-custom-columns/task-list-custom-columns-slice';

const LabelTypeColumn = () => {
  const dispatch = useAppDispatch();
  const [labels, setLabels] = useState<LabelType[]>([
    {
      labelId: nanoid(),
      labelName: 'Untitled label',
      labelColor: PhaseColorCodes[0],
    },
  ]);

  // phase color options
  const phaseOptionColorList = PhaseColorCodes.map(color => ({
    value: color,
    label: (
      <Tag
        color={color}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: 15,
          height: 15,
          borderRadius: '50%',
        }}
      />
    ),
  }));

  // add a new label
  const handleAddLabel = () => {
    const newLabel = {
      labelId: nanoid(),
      labelName: 'Untitled label',
      labelColor: PhaseColorCodes[0],
    };
    setLabels(prevLabels => [...prevLabels, newLabel]);
    dispatch(setLabelsList([...labels, newLabel])); // update the slice with the new label
  };

  // update label name
  const handleUpdateLabelName = (labelId: string, labelName: string) => {
    const updatedLabels = labels.map(label =>
      label.labelId === labelId ? { ...label, labelName } : label
    );
    setLabels(updatedLabels);
    dispatch(setLabelsList(updatedLabels)); // update the slice with the new label name
  };

  // update label color
  const handleUpdateLabelColor = (labelId: string, labelColor: string) => {
    const updatedLabels = labels.map(label =>
      label.labelId === labelId ? { ...label, labelColor } : label
    );
    setLabels(updatedLabels);
    dispatch(setLabelsList(updatedLabels)); // update the slice with the new label color
  };

  // remove a label
  const handleRemoveLabel = (labelId: string) => {
    const updatedLabels = labels.filter(label => label.labelId !== labelId);
    setLabels(updatedLabels);
    dispatch(setLabelsList(updatedLabels)); // update the slice after label removal
  };

  useEffect(() => {
    // initially dispatch the labels to the slice
    dispatch(setLabelsList(labels));
  }, [dispatch, labels]);

  return (
    <div style={{ maxWidth: '100%', minHeight: 180 }}>
      <Typography.Text>Labels</Typography.Text>
      <Flex vertical gap={8}>
        <Flex vertical gap={8} style={{ maxHeight: 120, overflow: 'auto' }}>
          {labels.map(label => (
            <Flex gap={8} key={label.labelId}>
              <HolderOutlined style={{ fontSize: 18 }} />
              <Input
                value={label.labelName}
                onChange={e => handleUpdateLabelName(label.labelId, e.target.value)}
                style={{ width: 'fit-content', maxWidth: 400 }}
              />
              <Flex gap={8} align="center">
                <Select
                  options={phaseOptionColorList}
                  value={label.labelColor}
                  onChange={value => handleUpdateLabelColor(label.labelId, value)}
                  style={{ width: 48 }}
                  suffixIcon={null}
                />
                <CloseCircleOutlined
                  onClick={() => handleRemoveLabel(label.labelId)}
                  style={{ cursor: 'pointer' }}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>

        <Button type="link" onClick={handleAddLabel} style={{ width: 'fit-content', padding: 0 }}>
          + Add a label
        </Button>
      </Flex>
    </div>
  );
};

export default LabelTypeColumn;
