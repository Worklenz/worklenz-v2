import { useAuthService } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/useAppSelector';

const useIsProjectManager = () => {
  const currentSession = useAuthService().getCurrentSession();
  const { project } = useAppSelector(state => state.projectReducer);
  
  return currentSession?.team_member_id === project?.project_manager?.id;
};

export default useIsProjectManager; 