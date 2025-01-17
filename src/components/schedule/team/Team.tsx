import { useMemo, useState } from 'react';
import GranttChart from './grant-chart/grantt-chart';
import { Member } from '../../../types/schedule/schedule.types';

interface teamProps {
  date: Date | null;
}

const Team: React.FC<teamProps> = ({ date }) => {
  const [members, setMembers] = useState<Member[]>([]);

  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/scheduler-data/TeamData.json');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return <GranttChart members={members} date={date} />;
};

export default Team;
