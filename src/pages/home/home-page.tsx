import { Suspense, useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Col, Flex, Skeleton } from 'antd';

import GreetingWithTime from './greeting-with-time';
import TasksList from '@/pages/home/task-list/tasks-list';
import TodoList from '@/pages/home/todo-list/todo-list';
import ProjectDrawer from '@/components/projects/project-drawer/project-drawer';
import CreateProjectButton from '@/components/projects/project-create-button/project-create-button';
import RecentAndFavouriteProjectList from '@/pages/home/recent-and-favourite-project-list/recent-and-favourite-project-list';

import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthService } from '@/hooks/useAuth';

import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjects } from '@/features/home-page/home-page.slice';

import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';

const DESKTOP_MIN_WIDTH = 1024;
const TASK_LIST_MIN_WIDTH = 500;
const SIDEBAR_MAX_WIDTH = 400;

const HomePage = () => {
  const dispatch = useAppDispatch();

  const isDesktop = useMediaQuery({ query: `(min-width: ${DESKTOP_MIN_WIDTH}px)` });
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();
  useDocumentTitle('Home');

  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths } = useAppSelector(state => state.projectHealthReducer);

  useEffect(() => {
    const fetchLookups = async () => {
      const fetchPromises = [
        dispatch(fetchProjectHealth()),
        dispatch(fetchProjectCategories()),
        dispatch(fetchProjectStatuses()),
        dispatch(fetchProjects()),
      ].filter(Boolean);

      await Promise.all(fetchPromises);
    };

    fetchLookups();
  }, [dispatch]);

  const CreateProjectButtonComponent = () =>
    isDesktop ? (
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        {isOwnerOrAdmin && <CreateProjectButton />}
      </div>
    ) : (
      isOwnerOrAdmin && <CreateProjectButton />
    );

  const MainContent = () =>
    isDesktop ? (
      <Flex gap={24} align="flex-start" className="w-full mt-12">
        <Flex style={{ minWidth: TASK_LIST_MIN_WIDTH, width: '100%' }}>
          <TasksList />
        </Flex>
        <Flex vertical gap={24} style={{ width: '100%', maxWidth: SIDEBAR_MAX_WIDTH }}>
          <TodoList />
          <RecentAndFavouriteProjectList />
        </Flex>
      </Flex>
    ) : (
      <Flex vertical gap={24} className="mt-6">
        <TasksList />
        <TodoList />
        <RecentAndFavouriteProjectList />
      </Flex>
    );

  return (
    <div className="my-24 min-h-[90vh]">
      <Col className="flex flex-col gap-6">
        <GreetingWithTime />
        <CreateProjectButtonComponent />
      </Col>

      <MainContent />

      <ProjectDrawer
        categories={projectCategories}
        statuses={projectStatuses}
        healths={projectHealths}
      />
    </div>
  );
};

export default HomePage;
