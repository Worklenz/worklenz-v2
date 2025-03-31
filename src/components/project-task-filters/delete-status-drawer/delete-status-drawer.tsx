import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Form from 'antd/es/form';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleDrawer } from '@/features/projects/status/StatusSlice';
import { createStatus, fetchStatusesCategories } from '@/features/taskAttributes/taskStatusSlice';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import useTabSearchParam from '@/hooks/useTabSearchParam';
import { evt_project_board_create_status } from '@/shared/worklenz-analytics-events';
import { fetchTaskGroups } from '@/features/tasks/tasks.slice';
import { fetchBoardTaskGroups } from '@/features/board/board-slice';
import { deleteStatusToggleDrawer, seletedStatusCategory } from '@/features/projects/status/DeleteStatusSlice';
import { Drawer, Alert, Card, Select, Button, Typography, Badge } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  deleteSection,
  IGroupBy,
  setBoardGroupName,
  setEditableSection,
} from '@features/board/board-slice';
import { statusApiService } from '@/api/taskAttributes/status/status.api.service';
import { phasesApiService } from '@/api/taskAttributes/phases/phases.api.service';
import logger from '@/utils/errorLogger';
const { Title, Text } = Typography;
const { Option } = Select;

const DeleteStatusDrawer: React.FC = () => {
    const [currentStatus, setCurrentStatus] = useState<string>('');
    const [deletingStatus, setDeletingStatus] = useState(false);
    const dispatch = useAppDispatch();
    const { trackMixpanelEvent } = useMixpanelTracking();
    const { projectView } = useTabSearchParam();
    const [form] = Form.useForm();
    const { t } = useTranslation('task-list-filters');
    const { editableSectionId, groupBy } = useAppSelector(state => state.boardReducer);
    const isDelteStatusDrawerOpen = useAppSelector(
        state => state.deleteStatusReducer.isDeleteStatusDrawerOpen
    );
    const { isDeleteStatusDrawerOpen, status: selectedForDelete } = useSelector(
        (state) => state.deleteStatusReducer // Adjust this based on how you named it in your root reducer
    );
    const { statusCategories } = useAppSelector(state => state.taskStatusReducer);
    const { projectId } = useAppSelector(state => state.projectReducer);
    const themeMode = useAppSelector(state => state.themeReducer.mode);

    const refreshTasks = useCallback(() => {
        if (!projectId) return;
        const fetchAction = projectView === 'list' ? fetchTaskGroups : fetchBoardTaskGroups;
        dispatch(fetchAction(projectId));
    }, [projectId, projectView, dispatch]);

    const handleDrawerOpenChange = () => {
        if (statusCategories.length === 0) {
            dispatch(fetchStatusesCategories());
        }
    };

    const setReplacingStatus = (value: string) => {
        setCurrentStatus(value);
    };
    const moveAndDelete = async () => {
        const groupId = selectedForDelete?.id;
        if (!projectId || !currentStatus || !groupId) return;
        setDeletingStatus(true);
        try {
            if (groupBy === IGroupBy.STATUS) {
                const replacingStatusId = currentStatus;
                if (!replacingStatusId) return;
                const res = await statusApiService.deleteStatus(groupId, projectId, replacingStatusId);
                if (res.done) {
                    dispatch(deleteSection({ sectionId: groupId }));
                    dispatch(deleteStatusToggleDrawer());
                    refreshTasks();
                } else{
                    console.error('Error deleting status', res);
                }
            } else if (groupBy === IGroupBy.PHASE) {
                const res = await phasesApiService.deletePhaseOption(groupId, projectId);
                if (res.done) {
                    dispatch(deleteSection({ sectionId: groupId }));
                }
            }
        } catch (error) {
            logger.error('Error deleting section', error);
        }finally {
            setDeletingStatus(false);
            dispatch(deleteStatusToggleDrawer());
            refreshTasks();
            dispatch(fetchStatusesCategories());
        }
    };
    useEffect(() => {
        setCurrentStatus(selectedForDelete?.category_id || '');
    }, [isDelteStatusDrawerOpen]);

    return (
        <Drawer
            title="You are deleting a status"
            onClose={() => dispatch(deleteStatusToggleDrawer())}
            open={isDelteStatusDrawerOpen}
            afterOpenChange={handleDrawerOpenChange}
        >
            <Alert type="warning" message="One or more tasks (archived/non-archived) will be affected. Please select another status to move the tasks" />

            <Card className="text-center" style={{ marginTop: 16 }}>
                <Title level={5}>{selectedForDelete?.name}</Title>
                <Title level={4} style={{ margin: '16px 0' }}>
                    <DownOutlined />
                </Title>

                <Select
                    value={currentStatus}
                    onChange={setReplacingStatus}
                    style={{ width: '100%' }}
                    dropdownMatchSelectWidth={false}
                >
                    {statusCategories.map((item) => (
                        <Option
                            key={item.id}
                            disabled={item.id === selectedForDelete?.id}
                            value={item.id}
                        >
                            <Badge
                                color={item.color_code}
                                text={item?.name || null}
                                style={{
                                    opacity: item.id === selectedForDelete?.id ? 0.5 : undefined
                                }}
                            />
                        </Option>
                    ))}
                </Select>

                <Button
                    type="primary"
                    block
                    loading={deletingStatus}
                    disabled={deletingStatus}
                    onClick={moveAndDelete}
                    style={{ marginTop: 16 }}
                >
                    Done
                </Button>
            </Card>
        </Drawer>
    );
};

export default DeleteStatusDrawer;