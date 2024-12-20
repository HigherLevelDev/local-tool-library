import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SignupForm } from '../../components/auth/SignupForm'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { getThemeClass } from '../../lib/theme'

export function SignupPage() {
  const { t } = useTranslation()

  return (
    <div className={`flex min-h-screen items-center justify-center ${getThemeClass('gradients.primary')}`}>
      <Card className={`w-full max-w-md p-6 ${getThemeClass('components.card.base')}`}>
        <div className="text-center space-y-2">
          <h1 className={`text-2xl font-bold ${getThemeClass('components.text.heading')}`}>
            {t('auth.register')}
          </h1>
          <p className={`text-muted-foreground ${getThemeClass('components.text.body')}`}>
            {t('auth.registerDescription')}
          </p>
        </div>
        
        <div className="mt-6">
          <SignupForm />
        </div>
        
        <div className={`mt-4 text-center ${getThemeClass('components.text.body')}`}>
          <p className="text-sm text-muted-foreground">
            {t('auth.haveAccount')}{' '}
            <Link to="/auth/login">
              <Button variant="link" className={`p-0 ${getThemeClass('components.button.link')}`}>
                {t('auth.login')}
              </Button>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}