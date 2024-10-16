import { StarFilled } from '@ant-design/icons'
import { Button, ConfigProvider, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../styles/colors'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { ProjectType } from '../../../types/project.types'
import { toggleFavouriteProjectSelection } from '../../../features/projects/projectSlice'

type AddFavouriteProjectButtonProps = {
    record: ProjectType
}

const AddFavouriteProjectButton = ({
                                       record,
                                   }: AddFavouriteProjectButtonProps) => {
    const dispatch = useAppDispatch()
    const [checkIconColor, setCheckIconColor] = useState<string>(
        colors.lightGray,
    )

    // function for handle favourite project toggle
    const handleToggleFavoriteProject = () => {
        dispatch(toggleFavouriteProjectSelection(record.projectId))
    }

    // this useEffect handles the button color status when click  the favourite button
    useEffect(
        () =>
            record.isFavourite
                ? setCheckIconColor(colors.yellow)
                : setCheckIconColor(colors.lightGray),

        [handleToggleFavoriteProject],
    )

    return (
        <ConfigProvider wave={{ disabled: true }}>
            <Tooltip title={'Add to favourites'}>
                <Button
                    className="borderless-icon-btn"
                    style={{ backgroundColor: colors.transparent }}
                    shape="circle"
                    icon={<StarFilled style={{ color: checkIconColor }} />}
                    onClick={handleToggleFavoriteProject}
                />
            </Tooltip>
        </ConfigProvider>
    )
}

export default AddFavouriteProjectButton
