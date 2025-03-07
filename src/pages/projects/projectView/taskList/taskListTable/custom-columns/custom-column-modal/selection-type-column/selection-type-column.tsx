import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { PhaseColorCodes } from '../../../../../../../../shared/constants';
import { Button, Flex, Input, Select, Tag, Typography } from 'antd';
import { CloseCircleOutlined, HolderOutlined } from '@ant-design/icons';

import { useAppDispatch } from '../../../../../../../../hooks/useAppDispatch';
import { setSelectionsList } from '../../../../../../../../features/projects/singleProject/task-list-custom-columns/task-list-custom-columns-slice';

export type SelectionType = {
  selectionId: string;
  selectionName: string;
  selectionColor: string;
};

const SelectionTypeColumn = () => {
  const dispatch = useAppDispatch();
  const [selections, setSelections] = useState<SelectionType[]>([
    {
      selectionId: nanoid(),
      selectionName: 'Untitled selection',
      selectionColor: PhaseColorCodes[0],
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

  // add a new selection
  const handleAddSelection = () => {
    const newSelection = {
      selectionId: nanoid(),
      selectionName: 'Untitled selection',
      selectionColor: PhaseColorCodes[0],
    };
    setSelections(prevSelections => [...prevSelections, newSelection]);
    dispatch(setSelectionsList([...selections, newSelection])); // update the slice with the new selection
  };

  // update selection name
  const handleUpdateSelectionName = (selectionId: string, selectionName: string) => {
    const updatedSelections = selections.map(selection =>
      selection.selectionId === selectionId ? { ...selection, selectionName } : selection
    );
    setSelections(updatedSelections);
    dispatch(setSelectionsList(updatedSelections)); // update the slice with the new selection name
  };

  // update selection color
  const handleUpdateSelectionColor = (selectionId: string, selectionColor: string) => {
    const updatedSelections = selections.map(selection =>
      selection.selectionId === selectionId ? { ...selection, selectionColor } : selection
    );
    setSelections(updatedSelections);
    dispatch(setSelectionsList(updatedSelections)); // update the slice with the new selection color
  };

  // remove a selection
  const handleRemoveSelection = (selectionId: string) => {
    const updatedSelections = selections.filter(selection => selection.selectionId !== selectionId);
    setSelections(updatedSelections);
    dispatch(setSelectionsList(updatedSelections)); // update the slice after selection removal
  };

  useEffect(() => {
    // initially dispatch the selections to the slice
    dispatch(setSelectionsList(selections));
  }, [dispatch, selections]);

  return (
    <div style={{ maxWidth: '100%', minHeight: 180 }}>
      <Typography.Text>Selections</Typography.Text>
      <Flex vertical gap={8}>
        <Flex vertical gap={8} style={{ maxHeight: 120, overflow: 'auto' }}>
          {selections.map(selection => (
            <Flex gap={8} key={selection.selectionId}>
              <HolderOutlined style={{ fontSize: 18 }} />
              <Input
                value={selection.selectionName}
                onChange={e => handleUpdateSelectionName(selection.selectionId, e.target.value)}
                style={{ width: 'fit-content', maxWidth: 400 }}
              />
              <Flex gap={8} align="center">
                <Select
                  options={phaseOptionColorList}
                  value={selection.selectionColor}
                  onChange={value => handleUpdateSelectionColor(selection.selectionId, value)}
                  style={{ width: 48 }}
                  suffixIcon={null}
                />

                <CloseCircleOutlined
                  onClick={() => handleRemoveSelection(selection.selectionId)}
                  style={{ cursor: 'pointer' }}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>

        <Button
          type="link"
          onClick={handleAddSelection}
          style={{ width: 'fit-content', padding: 0 }}
        >
          + Add a selection
        </Button>
      </Flex>
    </div>
  );
};

export default SelectionTypeColumn;
