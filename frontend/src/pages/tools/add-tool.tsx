import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useToast } from '../../hooks/use-toast'
import { ToolForm } from '../../components/tools/ToolForm'
import { ToolService, CreateToolDto, UpdateToolDto } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'

export function AddToolPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (data: CreateToolDto | UpdateToolDto) => {
    if (!data.title || !data.description) {
      toast({
        title: t('tools.add.error'),
        description: t('tools.add.errorDescription'),
        variant: 'destructive',
      })
      return
    }
    try {
      setIsSubmitting(true)
      await ToolService.createTool(data as CreateToolDto)
      toast({
        title: t('tools.add.success'),
        description: t('tools.add.successDescription'),
      })
      navigate('/tools/my-tools')
    } catch (error) {
      console.error('Create tool error:', error)
      toast({
        title: t('tools.add.error'),
        description: t('tools.add.errorDescription'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`container mx-auto py-8 ${getThemeClass('components.tools.container')}`}>
      <h1 className={getThemeClass('components.tools.header')}>{t('tools.add.title')}</h1>
      <div className="max-w-2xl">
        <ToolForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  )
}