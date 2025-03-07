import { Badge, Button, Card, Checkbox, Empty, Flex, Input, List, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ITaskLabel } from '@/types/tasks/taskLabel.types';
import { InputRef } from 'antd/es/input';
import { useEffect, useMemo } from 'react'; // Add useMemo for filtering

interface LabelsDropdownProps {
  labelsList: ITaskLabel[];
  themeMode: string;
  createLabelText: string;
  selectedLabels: ITaskLabel[];
  labelsInputRef: React.RefObject<InputRef>;
  onLabelChange: (e: CheckboxChangeEvent, label: ITaskLabel) => void;
  onCreateLabelTextChange: (value: string) => void;
  onApply: () => void;
  t: (key: string) => string;
  loading: boolean;
}

const LabelsDropdown = ({
  labelsList,
  themeMode,
  createLabelText,
  selectedLabels,
  labelsInputRef,
  onLabelChange,
  onCreateLabelTextChange,
  onApply,
  loading,
  t
}: LabelsDropdownProps) => {
  useEffect(() => {
    if (labelsInputRef.current) {
      labelsInputRef.current.focus();
    }
  }, []);

  // Filter labels based on createLabelText
  const filteredLabels = useMemo(() => {
    if (!createLabelText.trim()) return labelsList; // Show all labels if input is empty
    return labelsList.filter(label =>
      label.name?.toLowerCase().includes(createLabelText.toLowerCase())
    );
  }, [labelsList, createLabelText]);

  return (
    <Card className="custom-card" styles={{ body: { padding: 8 } }}>
      <Flex vertical>
        {/* Always show the list, filtered by input */}
        <List
          style={{
            padding: 0,
            overflow: 'auto',
            maxHeight: filteredLabels.length > 10 ? '200px' : 'auto', // Set max height if more than 10 labels
            maxWidth: 250,
          }}
        >
          {filteredLabels.length ? (
            filteredLabels.map(label => (
              <List.Item
          className={themeMode === 'dark' ? 'custom-list-item dark' : 'custom-list-item'}
          key={label.id}
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-start',
            padding: '4px 8px',
            border: 'none',
            cursor: 'pointer',
          }}
              >
          <Checkbox
            id={label.id}
            checked={selectedLabels.some(l => l.id === label.id)}
            onChange={e => onLabelChange(e, label)}
          >
            <Badge color={label.color_code} text={label.name} />
          </Checkbox>
              </List.Item>
            ))
          ) : (
            <Empty description={createLabelText ? t('noMatchingLabels') : t('noLabels')} />
          )}
        </List>

        <Flex style={{ paddingTop: 8 }} vertical justify="space-between" gap={8}>
          <Input
            ref={labelsInputRef}
            value={createLabelText}
            onChange={e => onCreateLabelTextChange(e.currentTarget.value)}
            placeholder={t('createLabel')}
            onPressEnter={onApply}
          />
          {createLabelText && filteredLabels.length === 0 && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t('hitEnterToCreate')}
            </Typography.Text>
          )}
          {filteredLabels.length > 0 && (
            <Button
              type="primary"
              size="small"
              onClick={onApply}
              style={{ width: '100%' }}
            >
              {t('apply')}
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default LabelsDropdown;