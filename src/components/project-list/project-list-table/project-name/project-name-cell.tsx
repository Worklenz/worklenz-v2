import { toggleFavoriteProject } from "@/features/projects/projectsSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { IProjectViewModel } from "@/types/project/projectViewModel.types";
import { formatDateRange } from "@/utils/project-list-utils";
import { CalendarOutlined } from "@ant-design/icons";
import { Rate, Badge, Tooltip } from "antd";
import { useCallback } from "react";
import { NavigateFunction } from "react-router-dom";

export const ProjectNameCell: React.FC<{ record: IProjectViewModel; navigate: NavigateFunction }> = ({
    record,
    navigate,
  }) => {
    const dispatch = useAppDispatch();
  
    const handleFavorite = useCallback(async () => {
      if (record.id) await dispatch(toggleFavoriteProject(record.id));
    }, [dispatch, record.id]);
  
    const selectProject = (record: IProjectViewModel) => {
      if (!record.id) return;
  
      let viewTab = 'tasks-list';
      switch (record.team_member_default_view) {
        case 'TASK_LIST':
          viewTab = 'tasks-list';
          break;
        case 'BOARD':
          viewTab = 'board';
          break;
        default:
          viewTab = 'tasks-list';
      }
  
      const searchParams = new URLSearchParams({
        tab: viewTab,
        pinned_tab: viewTab,
      });
  
      navigate({
        pathname: `/worklenz/projects/${record.id}`,
        search: searchParams.toString(),
      });
    };
  
    return (
      <div className="flex items-center" onClick={() => selectProject(record)} >
        <Rate
          value={record.favorite ? 1 : 0}
          onChange={handleFavorite}
          count={1}
          className="mr-2"
          tooltips={['Add to favourites']}
        />
        <Badge color="geekblue" className="mr-2" />
        <span className="cursor-pointer">
          {record.name}
          {(record.start_date || record.end_date) && (
            <Tooltip
              title={formatDateRange({
                startDate: record.start_date || null,
                endDate: record.end_date || null,
              })}
              overlayStyle={{ width: '200px' }}
            >
              <CalendarOutlined className="ml-2" />
            </Tooltip>
          )}
        </span>
      </div>
    );
  };