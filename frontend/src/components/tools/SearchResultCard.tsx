import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tool } from '../../lib/tool.service'
import { getThemeClass } from '../../lib/theme'

interface SearchResultCardProps {
  tool: Tool
}

export function SearchResultCard({ tool }: SearchResultCardProps) {
  return (
    <Card className={getThemeClass('components.card.base')}>
      <CardHeader>
        <CardTitle className={getThemeClass('components.text.heading')}>{tool.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-sm ${getThemeClass('components.text.body')}`}>{tool.description}</p>
      </CardContent>
    </Card>
  )
}