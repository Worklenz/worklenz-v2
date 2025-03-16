import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import TaskListFilters from '../taskList/task-list-filters/task-list-filters';
import { Empty, Flex, Skeleton } from 'antd';
import BoardSectionCardContainer from './board-section/board-section-container';
import {
  fetchBoardTaskGroups,
  reorderTaskGroups,
  moveTaskBetweenGroups,
} from '@features/board/board-slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
  DragOverlay,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import BoardViewTaskCard from './board-section/board-task-card/board-view-task-card';
import { useSearchParams } from 'react-router-dom';
import { fetchStatusesCategories } from '@/features/taskAttributes/taskStatusSlice';
import useTabSearchParam from '@/hooks/useTabSearchParam';
import { useSocket } from '@/socket/socketContext';
import { useAuthService } from '@/hooks/useAuth';
import { SocketEvents } from '@/shared/socket-events';
import { tasksApiService } from '@/api/tasks/tasks.api.service';
import alertService from '@/services/alerts/alertService';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import { evt_project_task_list_drag_and_move } from '@/shared/worklenz-analytics-events';
import apiClient from '@/api/api-client';
import { API_BASE_URL } from '@/shared/constants';
import { ITaskStatusCreateRequest } from '@/types/tasks/task-status-create-request';
import { statusApiService } from '@/api/taskAttributes/status/status.api.service';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useDragCursor from '@/hooks/useDragCursor';

const ProjectViewBoard = () => {
  const dispatch = useAppDispatch();
  const { projectView } = useTabSearchParam();
  const { socket } = useSocket();
  const authService = useAuthService();
  const currentSession = authService.getCurrentSession();
  const { trackMixpanelEvent } = useMixpanelTracking();

  const { projectId } = useAppSelector(state => state.projectReducer);
  const { taskGroups, groupBy, loadingGroups, error } = useAppSelector(state => state.boardReducer);
  const { statusCategories, loading: loadingStatusCategories } = useAppSelector(
    state => state.taskStatusReducer
  );
  const [activeItem, setActiveItem] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use our custom hook to handle cursor styles during drag
  useDragCursor(isDragging);
  
  // Store the original source group ID when drag starts
  const originalSourceGroupIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (projectId && groupBy && projectView === 'kanban') {
      if (!loadingGroups) {
        dispatch(fetchBoardTaskGroups(projectId));
      }
    }
  }, [dispatch, projectId, groupBy, projectView]);

  // Add CSS styles for drag and drop
  useIsomorphicLayoutEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Base styles for draggable items */
      .board-task-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      /* Style when dragging */
      .board-task-card[data-dragging="true"] {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 100;
      }
      
      /* Style for droppable areas during drag */
      .board-section[data-droppable="true"] {
        transition: background-color 0.2s ease;
      }
      
      /* Style for valid drop targets */
      .board-section[data-over="true"] {
        background-color: rgba(0, 120, 212, 0.05);
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(active.data.current);
    setIsDragging(true);
    
    // Mark the dragged element
    const draggedElement = document.querySelector(`[data-id="${active.id}"]`);
    if (draggedElement) {
      draggedElement.setAttribute('data-dragging', 'true');
    }
    
    // Store the original source group ID when drag starts
    if (active.data.current?.type === 'task') {
      originalSourceGroupIdRef.current = active.data.current.sectionId;
      console.log('Original source group ID stored:', originalSourceGroupIdRef.current);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Update visual feedback for drop targets
    document.querySelectorAll('.board-section').forEach(section => {
      section.setAttribute('data-over', 'false');
    });
    
    // Highlight the current drop target
    if (over.data.current?.type === 'section') {
      const sectionElement = document.querySelector(`[data-section-id="${over.id}"]`);
      if (sectionElement) {
        sectionElement.setAttribute('data-over', 'true');
      }
    } else if (over.data.current?.type === 'task') {
      const sectionId = over.data.current?.sectionId;
      const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (sectionElement) {
        sectionElement.setAttribute('data-over', 'true');
      }
    }

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    const isOverSection = over.data.current?.type === 'section';

    // Handle task movement between sections
    if (isActiveTask && (isOverTask || isOverSection)) {
      // If we're over a task, we want to insert at that position
      // If we're over a section, we want to append to the end
      const activeTaskId = active.data.current?.task.id;
      
      // Use the original source group ID from ref instead of the potentially modified one
      const sourceGroupId = originalSourceGroupIdRef.current || active.data.current?.sectionId;
      
      // Fix: Ensure we correctly identify the target group ID
      let targetGroupId;
      if (isOverTask) {
        // If over a task, get its section ID
        targetGroupId = over.data.current?.sectionId;
      } else if (isOverSection) {
        // If over a section directly
        targetGroupId = over.id;
      } else {
        // Fallback
        targetGroupId = over.id;
      }

      // Find the target index
      let targetIndex = -1;
      if (isOverTask) {
        const overTaskId = over.data.current?.task.id;
        const targetGroup = taskGroups.find(group => group.id === targetGroupId);
        if (targetGroup) {
          targetIndex = targetGroup.tasks.findIndex(task => task.id === overTaskId);
        }
      }

      // Dispatch the action to move the task
      dispatch(
        moveTaskBetweenGroups({
          taskId: activeTaskId,
          sourceGroupId,
          targetGroupId,
          targetIndex,
        })
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset drag state and visual feedback
    setIsDragging(false);
    
    // Reset all dragging attributes
    document.querySelectorAll('[data-dragging="true"]').forEach(element => {
      element.setAttribute('data-dragging', 'false');
    });
    
    // Reset all drop target highlights
    document.querySelectorAll('.board-section').forEach(section => {
      section.setAttribute('data-over', 'false');
    });
    
    // More detailed logging
    console.log('Active object:', JSON.stringify(active, null, 2));
    console.log('Over object:', JSON.stringify(over, null, 2));
    console.log('Active data:', active.data.current);
    console.log('Over data:', over?.data.current);
    console.log('Original source group ID:', originalSourceGroupIdRef.current);
    
    if (!over || !projectId) {
      setActiveItem(null);
      originalSourceGroupIdRef.current = null; // Reset the ref
      return;
    }

    const isActiveTask = active.data.current?.type === 'task';
    const isActiveSection = active.data.current?.type === 'section';

    // Handle task dragging between columns
    if (isActiveTask) {
      const task = active.data.current?.task;
      
      // Use the original source group ID from ref instead of the potentially modified one
      const sourceGroupId = originalSourceGroupIdRef.current || active.data.current?.sectionId;
      
      // Fix: Ensure we correctly identify the target group ID
      let targetGroupId;
      if (over.data.current?.type === 'task') {
        // If dropping on a task, get its section ID
        targetGroupId = over.data.current?.sectionId;
      } else if (over.data.current?.type === 'section') {
        // If dropping directly on a section
        targetGroupId = over.id;
      } else {
        // Fallback to the over ID if type is not specified
        targetGroupId = over.id;
      }
      
      console.log('Source Group ID:', sourceGroupId);
      console.log('Target Group ID:', targetGroupId);

      // Find source and target groups
      const sourceGroup = taskGroups.find(group => group.id === sourceGroupId);
      const targetGroup = taskGroups.find(group => group.id === targetGroupId);

      if (!sourceGroup || !targetGroup || !task) {
        console.error('Could not find source or target group, or task is undefined');
        setActiveItem(null);
        originalSourceGroupIdRef.current = null; // Reset the ref
        return;
      }

      // Verify that we have different groups when moving between columns
      if (sourceGroupId === targetGroupId) {
        console.log('Same group movement detected');
      } else {
        console.log('Cross-group movement detected');
      }

      // Find indices
      let fromIndex = sourceGroup.tasks.findIndex(t => t.id === task.id);
      
      // Handle case where task is not found in source group (might have been moved already in UI)
      if (fromIndex === -1) {
        console.warn('Task not found in source group. Using task sort_order from task object.');
        
        // Use the sort_order from the task object itself
        const fromSortOrder = task.sort_order;
        
        // Calculate target index and position
        let toIndex = -1;
        if (over.data.current?.type === 'task') {
          const overTaskId = over.data.current?.task.id;
          toIndex = targetGroup.tasks.findIndex(t => t.id === overTaskId);
        } else {
          // If dropping on a section, append to the end
          toIndex = targetGroup.tasks.length;
        }

        // Calculate toPos similar to Angular implementation
        const toPos = targetGroup.tasks[toIndex]?.sort_order || 
                      targetGroup.tasks[targetGroup.tasks.length - 1]?.sort_order || 
                      -1;

        // Prepare socket event payload
        const body = {
          project_id: projectId,
          from_index: fromSortOrder,
          to_index: toPos,
          to_last_index: !toPos,
          from_group: sourceGroupId,
          to_group: targetGroupId,
          group_by: groupBy || 'status',
          task,
          team_id: currentSession?.team_id
        };

        console.log('Emitting socket event with payload (task not found in source):', body);

        // Emit socket event
        if (socket) {
          socket.emit(SocketEvents.TASK_SORT_ORDER_CHANGE.toString(), body);
          
          // Set up listener for task progress update
          socket.once(SocketEvents.TASK_SORT_ORDER_CHANGE.toString(), () => {
            if (task.is_sub_task) {
              socket.emit(SocketEvents.GET_TASK_PROGRESS.toString(), task.parent_task_id);
            } else {
              socket.emit(SocketEvents.GET_TASK_PROGRESS.toString(), task.id);
            }
          });
        }

        // Track analytics event
        trackMixpanelEvent(evt_project_task_list_drag_and_move);
        
        setActiveItem(null);
        originalSourceGroupIdRef.current = null; // Reset the ref
        return;
      }
      
      // Calculate target index and position
      let toIndex = -1;
      if (over.data.current?.type === 'task') {
        const overTaskId = over.data.current?.task.id;
        toIndex = targetGroup.tasks.findIndex(t => t.id === overTaskId);
      } else {
        // If dropping on a section, append to the end
        toIndex = targetGroup.tasks.length;
      }

      // Calculate toPos similar to Angular implementation
      const toPos = targetGroup.tasks[toIndex]?.sort_order || 
                    targetGroup.tasks[targetGroup.tasks.length - 1]?.sort_order || 
                    -1;

      // Prepare socket event payload
      const body = {
        project_id: projectId,
        from_index: sourceGroup.tasks[fromIndex].sort_order,
        to_index: toPos,
        to_last_index: !toPos,
        from_group: sourceGroupId, // Use the direct IDs instead of group objects
        to_group: targetGroupId,   // Use the direct IDs instead of group objects
        group_by: groupBy || 'status', // Use the current groupBy value
        task,
        team_id: currentSession?.team_id
      };

      console.log('Emitting socket event with payload:', body);

      // Emit socket event
      if (socket) {
        socket.emit(SocketEvents.TASK_SORT_ORDER_CHANGE.toString(), body);
        
        // Set up listener for task progress update
        socket.once(SocketEvents.TASK_SORT_ORDER_CHANGE.toString(), () => {
          if (task.is_sub_task) {
            socket.emit(SocketEvents.GET_TASK_PROGRESS.toString(), task.parent_task_id);
          } else {
            socket.emit(SocketEvents.GET_TASK_PROGRESS.toString(), task.id);
          }
        });
      }

      // Track analytics event
      trackMixpanelEvent(evt_project_task_list_drag_and_move);
    }
    // Handle column reordering
    else if (isActiveSection) {
      const sectionId = active.id;
      const fromIndex = taskGroups.findIndex(group => group.id === sectionId);
      const toIndex = taskGroups.findIndex(group => group.id === over.id);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        // Create a new array with the reordered groups
        const reorderedGroups = [...taskGroups];
        const [movedGroup] = reorderedGroups.splice(fromIndex, 1);
        reorderedGroups.splice(toIndex, 0, movedGroup);
        
        // Dispatch action to reorder columns with the new array
        dispatch(reorderTaskGroups(reorderedGroups));
        
        // Prepare column order for API
        const columnOrder = reorderedGroups.map(group => group.id);
        
        // Call API to update status order
        try {
          // Use the correct API endpoint based on the Angular code
          const requestBody: ITaskStatusCreateRequest = {
            status_order: columnOrder
          };
          
          const response = await statusApiService.updateStatusOrder(requestBody, projectId);
          if (!response.done) {
            const revertedGroups = [...reorderedGroups];
            const [movedBackGroup] = revertedGroups.splice(toIndex, 1);
            revertedGroups.splice(fromIndex, 0, movedBackGroup);
            dispatch(reorderTaskGroups(revertedGroups));
            alertService.error('Failed to update column order', 'Please try again');
          }
        } catch (error) {
          // Revert the change if API call fails
          const revertedGroups = [...reorderedGroups];
          const [movedBackGroup] = revertedGroups.splice(toIndex, 1);
          revertedGroups.splice(fromIndex, 0, movedBackGroup);
          dispatch(reorderTaskGroups(revertedGroups));
          alertService.error('Failed to update column order', 'Please try again');
        }
      }
    }

    setActiveItem(null);
    originalSourceGroupIdRef.current = null; // Reset the ref
  };

  useEffect(() => {
    if (!statusCategories.length && projectId) {
      dispatch(fetchStatusesCategories());
    }
  }, [dispatch, projectId]);

  return (
    <Flex vertical gap={16}>
      <TaskListFilters position={'board'} />

      <Skeleton active loading={loadingGroups}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <BoardSectionCardContainer
            datasource={taskGroups}
            group={groupBy as 'status' | 'priority' | 'phases'}
          />
          <DragOverlay>
            {activeItem?.type === 'task' && (
              <BoardViewTaskCard task={activeItem.task} sectionId={activeItem.sectionId} />
            )}
          </DragOverlay>
        </DndContext>
      </Skeleton>
    </Flex>
  );
};

export default ProjectViewBoard;
