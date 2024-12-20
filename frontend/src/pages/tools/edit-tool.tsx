import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { ToolForm } from '../../components/tools/ToolForm'
import { ToolService, Tool, UpdateToolDto } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'

export function EditToolPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [tool, setTool] = React.useState<Tool | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    const fetchTool = async () => {
      try {
        if (!id) return
        const data = await ToolService.getTool(id)
        setTool(data)
      } catch (error) {
        console.error('Fetch tool error:', error)
        toast({
          title: t('tools.edit.error'),
          description: t('tools.edit.errorDescription'),
          variant: 'destructive',
        })
        navigate('/tools/my-tools')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTool()
  }, [id, navigate, toast, t])

  const handleSubmit = async (data: UpdateToolDto) => {
    if (!id || !data.title || !data.description) {
      toast({
        title: t('tools.edit.error'),
        description: t('tools.edit.errorDescription'),
        variant: 'destructive',
      })
      return
    }
    try {
      setIsSubmitting(true)
      await ToolService.updateTool(id, data)
      toast({
        title: t('tools.edit.success'),
        description: t('tools.edit.successDescription'),
      })
      navigate('/tools/my-tools')
    } catch (error) {
      console.error('Update tool error:', error)
      toast({
        title: t('tools.edit.error'),
        description: t('tools.edit.errorDescription'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="container mx-auto py-8">
        <p>{t('tools.edit.notFound')}</p>
      </div>
    )
  }

  return (
    <div className={`container mx-auto py-8 ${getThemeClass('components.tools.container')}`}>
      <h1 className={getThemeClass('components.tools.header')}>{t('tools.edit.title')}</h1>
      <div className="max-w-2xl">
        <ToolForm onSubmit={handleSubmit} isLoading={isSubmitting} tool={tool} />
      </div>
    </div>
  )
}