import React, { useEffect, useState } from 'react'
import { Button, Card, Flex, Input, Segmented, Tooltip } from 'antd'
import { PageHeader } from '@ant-design/pro-components'
import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import './ProjectList.css'
import AllProjectList from '../../components/ProjectList/allProjectList/AllProjectList'
import CreateProjectButton from '../../features/projects/createProject/CreateProjectButton'
import CreateProjectDrawer from '../../features/projects/createProject/CreateProjectDrawer'
import FavouriteProjectList from '../../components/ProjectList/favouriteProjectList/FavouriteProjectList'
import ArchiveProjectList from '../../components/ProjectList/archivedProjectList/ArchiveProjectList'
import { useTranslation } from 'react-i18next'

const ProjectList: React.FC = () => {

    const { t } = useTranslation("ProjectList")

    const [projectSegment, setProjectSegment] = useState<
        'All' | 'Favourites' | 'Archived'
    >('All')
    const [isLoading, setIsLoading] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedTerm, setDebouncedTerm] = useState('')

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    useEffect(() => {
        if (debouncedTerm) {
            performSearch(debouncedTerm)
        }
    }, [debouncedTerm])

    const performSearch = (query: string) => {
        console.log('Searching for:', query)
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
    }

    const handleSegmentChange = (value: 'All' | 'Favourites' | 'Archived') => {
        if (value === 'All') {
            setProjectSegment('All')
            handleRefresh()
        } else if (value === 'Favourites') {
            setProjectSegment('Favourites')
            handleRefresh()
        } else {
            setProjectSegment('Archived')
            handleRefresh()
        }
    }

    return (
        <div style={{ marginBlock: 65, minHeight: '90vh' }}>
            <PageHeader
                className="site-page-header"
                title={`2 ${t('projects')}`}
                style={{ padding: '16px 0' }}
                extra={
                    <Flex gap={8} align="center">
                        <Tooltip title={t('refreshProjects')}>
                            <Button
                                shape="circle"
                                icon={<SyncOutlined spin={isLoading} />}
                                onClick={() => handleRefresh()}
                            />
                        </Tooltip>
                        <Segmented<'All' | 'Favourites' | 'Archived'>
                            options={['All', 'Favourites', 'Archived']}
                            defaultValue="All"
                            onChange={(
                                value: 'All' | 'Favourites' | 'Archived'
                            ) => handleSegmentChange(value)}
                        />
                        <Input
                            placeholder={t('placeholder')}
                            suffix={<SearchOutlined />}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <CreateProjectButton />
                        <CreateProjectDrawer />
                    </Flex>
                }
            />
            <Card>
                {projectSegment === 'All' ? <AllProjectList /> : projectSegment === 'Favourites' ? <FavouriteProjectList /> : <ArchiveProjectList />}
            </Card>
        </div>
    )
}

export default ProjectList
