import mixpanel, { Dict } from 'mixpanel-browser';
import { useCallback, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { initMixpanel } from '@/utils/mixpanelInit';

export const useMixpanelTracking = () => {
  const auth = useAuth();

  const token = useMemo(() => {
    const host = window.location.host;
    if (host === "uat.worklenz.com" || host === "dev.worklenz.com") {
      return import.meta.env.VITE_MIXPANEL_TOKEN;
    }
    if (host === "app.worklenz.com") {
      return import.meta.env.VITE_MIXPANEL_TOKEN;
    }
    return import.meta.env.VITE_MIXPANEL_TOKEN;
  }, []);

  useEffect(() => {
    initMixpanel(token);
  }, [token]);

  const setIdentity = useCallback((user: any) => {
    if (user?.id) {
      mixpanel.identify(user.id);
      mixpanel.people.set({
        $user_id: user.id,
        $name: user.name,
        $email: user.email,
        $avatar: user.avatar_url
      });
    }
  }, []);

  const reset = useCallback(() => {
    mixpanel.reset();
  }, []);

  const trackMixpanelEvent = useCallback((event: string, properties?: Dict) => {
    try {
      const currentUser = auth.getCurrentSession();
      const props = {
        ...(properties || {}),
        ...(currentUser?.user_no ? { id: currentUser.user_no } : {})
      };

      mixpanel.track(event, props);
    } catch (e) {
      // ignore
    }
  }, [auth]);

  return {
    setIdentity,
    reset,
    trackMixpanelEvent
  };
};
