import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Tool, CreateToolDto, UpdateToolDto } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'

interface ToolFormProps {
  tool?: Tool
  onSubmit: (data: CreateToolDto | UpdateToolDto) => Promise<void>
  isLoading?: boolean
}

export function ToolForm({ tool, onSubmit, isLoading }: ToolFormProps) {
  const { t } = useTranslation()
  const form = useForm<CreateToolDto>({
    defaultValues: {
      title: tool?.title || '',
      description: tool?.description || '',
    },
  })

  const handleSubmit = async (data: CreateToolDto | UpdateToolDto) => {
    try {
      await onSubmit(data)
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Card className={getThemeClass('components.card.base')}>
      <CardHeader>
        <CardTitle className={getThemeClass('components.text.heading')}>
          {tool ? t('tools.edit.title') : t('tools.add.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={getThemeClass('components.text.body')}>{t('tools.form.title')}</FormLabel>
                  <FormControl>
                    <Input className={getThemeClass('components.input.base')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={getThemeClass('components.text.body')}>{t('tools.form.description')}</FormLabel>
                  <FormControl>
                    <Textarea className={getThemeClass('components.input.base')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button 
              type="submit" 
              disabled={isLoading}
              className={getThemeClass('components.button.primary')}
            >
              {isLoading ? t('common.loading') : tool ? t('common.update') : t('common.create')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}