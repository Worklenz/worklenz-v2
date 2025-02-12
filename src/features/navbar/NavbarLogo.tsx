import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '@/assets/images/logo.png';
import logoDark from '@/assets/images/logo-dark-mode.png';

import { useAppSelector } from '@/hooks/useAppSelector';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const NavbarLogo = () => {
  const { t } = useTranslation('navbar');
  const themeMode = useSelector((state: RootState) => state.themeReducer.mode);

  return (
    <Link to={'/worklenz/home'}>
      <img
        src={themeMode === 'dark' ? logoDark : logo}
        alt={t('logoAlt')}
        style={{ width: '100%', maxWidth: 140 }}
      />
    </Link>
  );
};

export default NavbarLogo;
