import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { getThemeClass } from '../../lib/theme'
import { useAuth } from '../../lib/auth.context'

export const Hero = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/auth/login')
  }

  return (
    <div className={`flex ${getThemeClass('gradients.primary')}`}>
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6">
            <div className="flex flex-col justify-center space-y-4 text-center">
              <div className="mb-24">
                <h1 className="mb-6 text-3xl font-bold tracking-tighter text-transparent text-white sm:text-5xl xl:text-6xl/none">
                  {t('hero-title')}
                </h1>
                {!isAuthenticated && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleLoginClick}
                      className={getThemeClass('components.button.primary')}
                    >
                      {t('login.signIn')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
