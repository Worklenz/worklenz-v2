import Avatars from '@/components/avatars/avatars';
import { setActiveMembers } from '@/features/project/project.slice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SocketEvents } from '@/shared/socket-events';
import { useSocket } from '@/socket/socketContext';
import { InlineMember } from '@/types/teamMembers/inlineMember.types';
import logger from '@/utils/errorLogger';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import { useEffect } from 'react';

const ProjectViewExtra = () => {
  const { projectId, activeMembers } = useAppSelector(state => state.projectReducer);
  const { socket, connected } = useSocket();
  const dispatch = useAppDispatch();

  const JOIN_TXT = 'join';
  const LEAVE_TXT = 'leave';

  const emitJoinOrLeave = (type: string) => {
    socket?.emit(SocketEvents.JOIN_OR_LEAVE_PROJECT_ROOM.toString(), {type, id: projectId});
  };

  const handleMemberView = (res: any) => {
    // dispatch(setActiveMembers(res));
  };

  const handleProjectUpdates = (res: any) => {
        console.log(res);

  };

  const handleProjectDataChange = (res: any) => {
    console.log(res);
  };

  useEffect(() => {
    emitJoinOrLeave(JOIN_TXT);
    socket?.on(SocketEvents.JOIN_OR_LEAVE_PROJECT_ROOM.toString(), handleMemberView);
    socket?.on(SocketEvents.PROJECT_UPDATES_AVAILABLE.toString(), handleProjectUpdates);
    socket?.on(SocketEvents.PROJECT_DATA_CHANGE.toString(), handleProjectDataChange);

    return () => {
      emitJoinOrLeave(LEAVE_TXT);
      socket?.removeListener(SocketEvents.JOIN_OR_LEAVE_PROJECT_ROOM.toString(), handleMemberView);
      socket?.removeListener(SocketEvents.PROJECT_UPDATES_AVAILABLE.toString(), handleProjectUpdates);
      socket?.removeListener(SocketEvents.PROJECT_DATA_CHANGE.toString(), handleProjectDataChange);
    };
  }, [activeMembers, connected]);

  return (
    <div>
      <Avatars members={activeMembers as InlineMember[] || []} />
      <span style={{ position: 'relative', top: '-10px' }}>
        <Tooltip title="Members who are active on this project will be displayed here.">
          <QuestionCircleOutlined />
        </Tooltip>
      </span>
      <span
        style={{
          position: 'relative',
          right: '20px',
          top: '10px',
        }}
      >
        <Badge status="success" dot className="profile-badge" />
      </span>
    </div>
  );
};

export default ProjectViewExtra;
