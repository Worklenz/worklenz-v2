import { Button } from 'antd';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { toggleLng } from './localesSlice';

const LanguageSelector = () => {
  const language = useAppSelector((state) => state.localesReducer.lng);
  const dispatch = useAppDispatch();

  const handleLanguageChange = () => {
    dispatch(toggleLng());
  };

  return (
    <Button
      shape="circle"
      onClick={handleLanguageChange}
      style={{
        textTransform: 'capitalize',
        fontWeight: 500,
        minWidth: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label={`Change language to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      {language === 'en' ? 'Es' : 'En'}
    </Button>
  );
};

export default LanguageSelector;
