import GreetingWithTime from './greeting-with-time';
import TasksList from '@/pages/home/task-list/tasks-list';
import TodoList from '@/pages/home/todo-list/todo-list';
import { Col, Flex } from 'antd';
import { useMediaQuery } from 'react-responsive';
import ProjectDrawer from '@components/projects/projectDrawer/ProjectDrawer';
import CreateProjectButton from '@components/projects/projectDrawer/CreateProjectButton';
import RecentAndFavouriteProjectList from '@/pages/home/recent-and-favourite-project-list/recent-and-favourite-project-list';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';

const HomePage = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  useDocumentTitle('Home');

  const createProjectButton = isDesktop ? (
    <div className="absolute right-0 top-1/2 -translate-y-1/2">
      <CreateProjectButton />
    </div>
  ) : (
    <CreateProjectButton />
  );

  const content = isDesktop ? (
    <Flex
      gap={24}
      align="flex-start"
      style={{
        width: '100%',
        marginBlockStart: 48,
      }}
    >
      <Flex style={{ minWidth: 500, width: '100%' }}>
        <TasksList />
      </Flex>
      <Flex vertical gap={24} style={{ width: '100%', maxWidth: 400 }}>
        <TodoList />
        <RecentAndFavouriteProjectList />
      </Flex>
    </Flex>
  ) : (
    <Flex
      vertical
      gap={24}
      style={{
        marginBlockStart: 24,
      }}
    >
      <TasksList />
      <TodoList />
      <RecentAndFavouriteProjectList />
    </Flex>
  );

  return (
    <div style={{ marginBlock: 96, minHeight: '90vh' }}>
      <Col style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GreetingWithTime />
        {createProjectButton}
      </Col>

      {content}

      <ProjectDrawer />
    </div>
  );
};

export default HomePage;
