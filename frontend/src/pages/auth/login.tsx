import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { getThemeClass } from '../../lib/theme'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className={`flex min-h-screen items-center justify-center ${getThemeClass('gradients.primary')}`}>
      <Card className={`w-full max-w-md p-6 ${getThemeClass('components.card.base')}`}>
        <div className="text-center space-y-2">
          <h1 className={`text-2xl font-bold ${getThemeClass('components.text.heading')}`}>
            {t('auth.login')}
          </h1>
          <p className={`text-muted-foreground ${getThemeClass('components.text.body')}`}>
            {t('auth.loginDescription')}
          </p>
        </div>
        
        <div className="mt-6">
          <LoginForm />
        </div>
        
        <div className={`mt-4 text-center ${getThemeClass('components.text.body')}`}>
          <p className="text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/auth/signup">
              <Button variant="link" className={`p-0 ${getThemeClass('components.button.link')}`}>
                {t('auth.register')}
              </Button>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}