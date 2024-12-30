import React from 'react';
import UserGreetingWithTime from './UserGreetingWithTime';
import TasksList from './taskList/TasksList';
import TodoList from './todoList/TodoList';
import RecentAndFavouriteProjecList from './recentAndFavouriteProjectList/RecentAndFavouriteProjectList';
import { Col, Flex } from 'antd';
import { useMediaQuery } from 'react-responsive';
import CreateProjectDrawer from '../../features/projects/createProject/CreateProjectDrawer';
import CreateProjectButton from '../../features/projects/createProject/CreateProjectButton';
import { useDocumentTitle } from '../../hooks/useDoumentTItle';
import { useAppSelector } from '../../hooks/useAppSelector';


const Homepage = () => {
  // media queries from react-responsive package
  const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });
  const themeMode = useAppSelector((state) => state.themeReducer.mode);

  useDocumentTitle('Home');

  return (
    <div style={{ paddingTop: 96, minHeight: '100vh', position: 'relative'}}>
      <div style={{ background: themeMode === 'dark' ? '#1A1E3A' : '#E7ECFF', width: '60%', height: '100vh', position:'absolute', borderTopRightRadius: '50%', borderBottomRightRadius: '30%', top: -1, left: -65}}></div>
      <Col style={{ display: 'flex', flexDirection: 'column', gap: 24, }}>
        <UserGreetingWithTime />
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
            <RecentAndFavouriteProjecList />
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
          <RecentAndFavouriteProjecList />
        </Flex>
      )}

      {/* drawers */}
      {/* create project drawer  */}
      <CreateProjectDrawer />
    </div>
  );
};

export default Homepage;
