import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tool, ToolService } from '../../lib/tool.service'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { getThemeClass } from '../../lib/theme'

export function ToolDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [tool, setTool] = React.useState<Tool | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchTool = async () => {
      try {
        if (!id) throw new Error('No tool ID provided')
        const data = await ToolService.getTool(id)
        setTool(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tool details')
      } finally {
        setLoading(false)
      }
    }

    fetchTool()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p className={getThemeClass('components.text.body')}>{t('common.loading')}</p>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="container mx-auto p-4">
        <p className={`text-red-500 ${getThemeClass('components.text.body')}`}>
          {error || t('tools.details.notFound')}
        </p>
        <Button
          onClick={() => navigate(-1)}
          className={`mt-4 ${getThemeClass('components.button.secondary')}`}
        >
          {t('common.back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        onClick={() => navigate(-1)}
        className={`mb-4 ${getThemeClass('components.button.secondary')}`}
      >
        {t('common.back')}
      </Button>

      <Card className={getThemeClass('components.card.base')}>
        <CardHeader>
          <CardTitle className={getThemeClass('components.text.heading')}>{tool.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tool.imageUrl && (
              <img
                src={tool.imageUrl}
                alt={tool.title}
                className="w-full max-w-2xl rounded-lg object-cover"
              />
            )}
            <p className={getThemeClass('components.text.body')}>{tool.description}</p>
            <div className={`text-sm ${getThemeClass('components.text.muted')}`}>
              <p>{t('tools.details.createdAt', { date: new Date(tool.createdAt).toLocaleDateString() })}</p>
              <p>{t('tools.details.updatedAt', { date: new Date(tool.updatedAt).toLocaleDateString() })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}