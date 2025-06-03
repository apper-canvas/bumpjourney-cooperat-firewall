import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme } = useTheme()
  const { t } = useTranslation()

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey)
    toast.success(t('themeChanged', { themeName: themes[themeKey].name }), {
      position: "top-center",
      autoClose: 2000,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <ApperIcon name="Palette" className="text-primary" size={20} />
        <h3 className="text-lg font-semibold text-surface-800">
          {t('colorTheme')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(themes).map(([key, theme]) => (
          <motion.div
            key={key}
            onClick={() => handleThemeChange(key)}
            className={`theme-card ${
              currentTheme === key ? 'theme-card-selected' : 'theme-card-default'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-surface-800">{theme.name}</span>
              {currentTheme === key && (
                <ApperIcon name="Check" className="text-primary" size={16} />
              )}
            </div>
            
            <div className="flex space-x-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            
            <p className="text-xs text-surface-600">
              {theme.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector