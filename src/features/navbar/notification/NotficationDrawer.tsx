import { Drawer, Empty, Segmented, Typography } from 'antd';
import { useEffect } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import {
  fetchInvitations,
  fetchNotifications,
  setNotificationType,
  toggleDrawer,
} from './notificationSlice';
import { NOTIFICATION_OPTION_READ, NOTIFICATION_OPTION_UNREAD } from '@/shared/constants';
import { useTranslation } from 'react-i18next';
import { useAuthService } from '@/hooks/useAuth';
import { SocketEvents } from '@/shared/socket-events';
import { IWorklenzNotification } from '@/types/notifications/notifications.types';
import { useSocket } from '@/socket/socketContext';
import { ITeamInvitationViewModel } from '@/types/notifications/notifications.types';
import { teamsApiService } from '@/api/teams/teams.api.service';
import { setLoading } from '@/features/projects/insights/project-insights.slice';

const NotficationDrawer = () => {
  const { isDrawerOpen, notificationType } = useAppSelector(state => state.notificationReducer);
  const dispatch = useAppDispatch();
  const { t } = useTranslation('navbar');
  const currentSession = useAuthService().getCurrentSession();
  const { socket, connected } = useSocket();

  const handleInvitationsUpdate = (data: ITeamInvitationViewModel[]) => {
    console.log(data);
  };

  const handleNotificationsUpdate = (data: IWorklenzNotification[]) => {
    console.log(data);
  };

  const handleTeamInvitationsUpdate = (data: ITeamInvitationViewModel[]) => {
    console.log(data);
  };

  const askPushPermission = () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('Permission granted');
          }
        });
      }
    } else {
      console.log('This browser does not support notification permission.');
      return;
    }
  };

  useEffect(() => {
    socket?.on(SocketEvents.INVITATIONS_UPDATE.toString(), handleInvitationsUpdate);
    socket?.on(SocketEvents.NOTIFICATIONS_UPDATE.toString(), handleNotificationsUpdate);
    socket?.on(SocketEvents.TEAM_MEMBER_REMOVED.toString(), handleTeamInvitationsUpdate);

    return () => {
      socket?.removeListener(SocketEvents.INVITATIONS_UPDATE.toString(), handleInvitationsUpdate);
      socket?.removeListener(
        SocketEvents.NOTIFICATIONS_UPDATE.toString(),
        handleNotificationsUpdate
      );
      socket?.removeListener(
        SocketEvents.TEAM_MEMBER_REMOVED.toString(),
        handleTeamInvitationsUpdate
      );
    };
  }, [socket]);

  useEffect(() => {
    askPushPermission();
    dispatch(fetchInvitations());
    if (notificationType) dispatch(fetchNotifications(notificationType));
  }, [notificationType]);

  return (
    <Drawer
      title={
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          {notificationType === NOTIFICATION_OPTION_READ ? 'Read' : ' Unread'} Notifications (0)
        </Typography.Text>
      }
      open={isDrawerOpen}
      onClose={() => dispatch(toggleDrawer())}
    >
      <Segmented<string>
        options={['Unread', 'Read']}
        defaultValue={NOTIFICATION_OPTION_UNREAD}
        onChange={(value: string) => {
          if (value === NOTIFICATION_OPTION_UNREAD)
            dispatch(setNotificationType(NOTIFICATION_OPTION_UNREAD));
          if (value === NOTIFICATION_OPTION_READ)
            dispatch(setNotificationType(NOTIFICATION_OPTION_READ));
        }}
      />

      <Empty
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBlockStart: 32,
        }}
        description={<Typography.Text>You've read all your notifications</Typography.Text>}
      />
    </Drawer>
  );
};

export default NotficationDrawer;
