import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tool } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

interface ToolCardProps {
  tool: Tool
  onEdit: (tool: Tool) => void
  onDelete: (tool: Tool) => Promise<void>
}

export function ToolCard({ tool, onEdit, onDelete }: ToolCardProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(tool)
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className={getThemeClass('components.card.base')}>
      <CardHeader>
        <CardTitle className={getThemeClass('components.text.heading')}>{tool.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${getThemeClass('components.text.body')}`}>{tool.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          onClick={() => onEdit(tool)}
          variant="ghost"
          className={getThemeClass('components.button.link')}
        >
          {t('common.edit')}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className={getThemeClass('components.button.primary')}
              variant="destructive"
              disabled={isDeleting}
            >
              {isDeleting ? t('common.loading') : t('common.delete')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className={getThemeClass('components.card.base')}>
            <AlertDialogHeader>
              <AlertDialogTitle className={getThemeClass('components.text.heading')}>
                {t('tools.delete.title')}
              </AlertDialogTitle>
              <AlertDialogDescription className={getThemeClass('components.text.body')}>
                {t('tools.delete.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={getThemeClass('components.button.link')}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className={getThemeClass('components.button.primary')}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}