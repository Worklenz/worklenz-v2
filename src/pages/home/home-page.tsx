import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Col, Flex } from 'antd';

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

import { homePageApiService } from '@/api/home-page/home-page.api.service';

import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjects } from '@/features/home-page/home-page.slice';

import { IProjectViewModel } from '@/types/project/projectViewModel.types';

const DESKTOP_MIN_WIDTH = 1024;
const TASK_LIST_MIN_WIDTH = 500;
const SIDEBAR_MAX_WIDTH = 400;
const MY_PROJECTS_FILTER_KEY = 'my-dashboard-active-projects-filter';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectsList, setProjectsList] = useState<IProjectViewModel[]>([]);
  const [projectSegment, setProjectSegment] = useState<'Recent' | 'Favourites'>('Recent');

  const isDesktop = useMediaQuery({ query: `(min-width: ${DESKTOP_MIN_WIDTH}px)` });
  const dispatch = useAppDispatch();
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();
  useDocumentTitle('Home');

  const { projectCategories } = useAppSelector(state => state.projectCategoriesReducer);
  const { projectStatuses } = useAppSelector(state => state.projectStatusesReducer);
  const { projectHealths } = useAppSelector(state => state.projectHealthReducer);

  const getActiveProjectsFilter = useCallback(() => {
    return +(localStorage.getItem(MY_PROJECTS_FILTER_KEY) || 0);
  }, []);

  const setActiveProjectsFilter = useCallback((value: number) => {
    localStorage.setItem(MY_PROJECTS_FILTER_KEY, value.toString());
  }, []);

  const getProjectsList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await homePageApiService.getProjects(getActiveProjectsFilter());
      if (res.done) {
        setProjectsList(res.body);
      }
    } finally {
      setIsLoading(false);
    }
  }, [getActiveProjectsFilter]);

  const handleSegmentChange = useCallback(
    (value: 'Recent' | 'Favourites') => {
      setProjectSegment(value);
      setActiveProjectsFilter(value === 'Recent' ? 0 : 1);
      getProjectsList();
    },
    [getProjectsList, setActiveProjectsFilter]
  );

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

  useEffect(() => {
    getProjectsList();
  }, [getProjectsList]);

  const CreateProjectButtonComponent = () => (
    isDesktop ? (
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        {isOwnerOrAdmin && <CreateProjectButton />}
      </div>
    ) : (
      isOwnerOrAdmin && <CreateProjectButton />
    )
  );

  const MainContent = () => (
    isDesktop ? (
      <Flex gap={24} align="flex-start" className="w-full mt-12">
        <Flex style={{ minWidth: TASK_LIST_MIN_WIDTH, width: '100%' }}>
          <TasksList />
        </Flex>
        <Flex vertical gap={24} style={{ width: '100%', maxWidth: SIDEBAR_MAX_WIDTH }}>
          <TodoList />
          <RecentAndFavouriteProjectList 
            handleRefresh={getProjectsList}
            projectsList={projectsList}
            projectSegment={projectSegment}
            handleSegmentChange={handleSegmentChange}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
    ) : (
      <Flex vertical gap={24} className="mt-6">
        <TasksList />
        <TodoList />
        <RecentAndFavouriteProjectList 
          handleRefresh={getProjectsList}
          projectsList={projectsList}
          projectSegment={projectSegment}
          handleSegmentChange={handleSegmentChange}
          isLoading={isLoading}
        />
      </Flex>
    )
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
        onDelete={() => {}}
      />
    </div>
  );
};

export default HomePage;