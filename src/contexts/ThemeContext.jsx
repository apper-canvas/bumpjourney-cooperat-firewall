import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const themes = {
  default: {
    name: 'Default Pink',
    description: 'Classic pregnancy app theme with warm pinks',
    className: '',
    colors: {
      primary: '#FF1493',
      secondary: '#FF6B35',
      accent: '#00E5FF'
    }
  },
  ocean: {
    name: 'Ocean Blue',
    description: 'Calming ocean blues and teals',
    className: 'theme-ocean',
    colors: {
      primary: '#006064',
      secondary: '#0097A7',
      accent: '#00BCD4'
    }
  },
  forest: {
    name: 'Forest Green',
    description: 'Natural greens and earth tones',
    className: 'theme-forest',
    colors: {
      primary: '#2E7D32',
      secondary: '#689F38',
      accent: '#4CAF50'
    }
  },
  sunset: {
    name: 'Sunset Orange',
    description: 'Warm oranges and golden yellows',
    className: 'theme-sunset',
    colors: {
      primary: '#FF5722',
      secondary: '#FF9800',
      accent: '#FFC107'
    }
  },
  purple: {
    name: 'Purple Dream',
    description: 'Royal purples and magentas',
    className: 'theme-purple',
    colors: {
      primary: '#673AB7',
      secondary: '#9C27B0',
      accent: '#E91E63'
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default')

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('bumpjourney-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme class to document body
    const body = document.body
    
    // Remove all theme classes
    Object.values(themes).forEach(theme => {
      if (theme.className) {
        body.classList.remove(theme.className)
      }
    })
    
    // Add current theme class
    const theme = themes[currentTheme]
    if (theme.className) {
      body.classList.add(theme.className)
    }
  }, [currentTheme])

  const changeTheme = (themeKey) => {
    if (themes[themeKey]) {
      setCurrentTheme(themeKey)
      localStorage.setItem('bumpjourney-theme', themeKey)
    }
  }

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    changeTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}