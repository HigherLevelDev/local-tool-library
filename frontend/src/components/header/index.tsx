import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LanguageSelector } from '../language-selector'
import { UserMenu } from '../user-menu'
import { useTranslation } from 'react-i18next'
import { getThemeClass } from '../../lib/theme'

interface IProps {
  leftNode?: ReactNode
}

export function Header(props: IProps) {
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? getThemeClass('components.nav.active') : ''
  }

  return (
    <div className="fixed left-0 top-0 flex w-full items-center justify-between border bg-slate-50 bg-opacity-70 px-4 py-4 md:px-12">
      <div className="flex items-center gap-6">
        <Link to="/" className={getThemeClass('components.nav.link')}>
          {t('title')}
        </Link>
        <Link 
          to="/tools/my-tools" 
          className={`${getThemeClass('components.nav.link')} ${isActive('/tools')}`}
        >
          {t('tools.nav.myTools')}
        </Link>
        <Link 
          to="/tools/add" 
          className={`${getThemeClass('components.nav.link')} ${isActive('/tools/add')}`}
        >
          {t('tools.nav.addTool')}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <UserMenu />
      </div>
    </div>
  )
}
