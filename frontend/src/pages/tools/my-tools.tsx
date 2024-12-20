import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { Button } from '../../components/ui/button'
import { ToolCard } from '../../components/tools/ToolCard'
import { ToolService, Tool } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'

export function MyToolsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [tools, setTools] = React.useState<Tool[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchTools = async () => {
    try {
      setIsLoading(true)
      const data = await ToolService.getMyTools()
      setTools(data)
    } catch (error) {
      console.error('Fetch tools error:', error)
      toast({
        title: t('tools.list.error'),
        description: t('tools.list.errorDescription'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchTools()
  }, [])

  const handleEdit = (tool: Tool) => {
    navigate(`/tools/edit/${tool.id}`)
  }

  const handleDelete = async (tool: Tool) => {
    try {
      await ToolService.deleteTool(tool.id)
      toast({
        title: t('tools.delete.success'),
        description: t('tools.delete.successDescription'),
      })
      await fetchTools()
    } catch (error) {
      console.error('Delete tool error:', error)
      toast({
        title: t('tools.delete.error'),
        description: t('tools.delete.errorDescription'),
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('tools.list.title')}</h1>
        </div>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className={getThemeClass('components.tools.container')}>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={getThemeClass('components.tools.header')}>{t('tools.list.title')}</h1>
          <Button 
            onClick={() => navigate('/tools/add')}
            className={getThemeClass('components.button.primary')}
          >
            {t('tools.add.button')}
          </Button>
        </div>

        {tools.length === 0 ? (
          <p className={getThemeClass('components.tools.empty')}>{t('tools.list.empty')}</p>
        ) : (
          <div className={getThemeClass('components.tools.grid')}>
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}