import GreetingWithTime from './greeting-with-time';
import TasksList from '@/pages/home/task-list/tasks-list';
import TodoList from '@/pages/home/todo-list/todo-list';
import { Col, Flex } from 'antd';
import { useMediaQuery } from 'react-responsive';
import ProjectDrawer from '@components/projects/projectDrawer/ProjectDrawer';
import CreateProjectButton from '@components/projects/projectDrawer/CreateProjectButton';
import RecentAndFavouriteProjectList
  from '@/pages/home/recent-and-favourite-project-list/recent-and-favourite-project-list';

const HomePage = () => {
  // media queries from react-responsive package
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <div style={{ marginBlock: 96, minHeight: '90vh' }}>
      <Col style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GreetingWithTime />
        {isDesktop ? (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            {/* tailwind css used to position this button  */}
            <CreateProjectButton />
          </div>
        ) : (
          <CreateProjectButton />
        )}
      </Col>

      {isDesktop ? (
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
      )}

      <ProjectDrawer />
    </div>
  );
};

export default HomePage;
