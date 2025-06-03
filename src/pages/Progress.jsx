import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ApperIcon from '../components/ApperIcon'
import LanguageSwitcher from '../components/LanguageSwitcher'

const Progress = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [currentWeek] = useState(20)

  const progressData = [
    { week: 16, weight: 115, measurement: 32 },
    { week: 17, weight: 117, measurement: 33 },
    { week: 18, weight: 119, measurement: 34 },
    { week: 19, weight: 121, measurement: 35 },
    { week: 20, weight: 123, measurement: 36 }
  ]

  const milestones = [
    { week: 12, title: t('progress.first_trimester_complete'), completed: true },
    { week: 16, title: t('progress.anatomy_scan'), completed: true },
    { week: 20, title: t('progress.halfway_point'), completed: true },
    { week: 24, title: t('progress.viability_milestone'), completed: false },
    { week: 28, title: t('progress.third_trimester'), completed: false }
  ]

return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100">
      {/* Header */}
      <motion.header 
        className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-soft"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="Baby" className="text-white" size={20} />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">BumpJourney</h1>
                  <p className="text-sm text-surface-600 hidden sm:block">{t('app.tagline')}</p>
                </div>
              </Link>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <LanguageSwitcher />
              
              <motion.button
                className="p-2 rounded-xl bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Bell" className="text-surface-600" size={20} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-800 mb-8">{t('navigation.progress')}</h2>

<div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Weight & Measurements Chart */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="TrendingUp" className="mr-2 text-primary" size={20} />
                {t('progress.weight_tracking')}
              </h3>
              
              <div className="space-y-4">
                {progressData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{data.week}</span>
                      </div>
                      <span className="text-surface-700">{t('common.week')} {data.week}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-surface-800 font-medium">{data.weight} lbs</p>
                      <p className="text-surface-600 text-sm">{data.measurement}" belly</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="Star" className="mr-2 text-secondary" size={20} />
                {t('progress.milestones')}
              </h3>
              
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      milestone.completed ? 'bg-green-500' : 'bg-surface-300'
                    }`}>
                      {milestone.completed ? (
                        <ApperIcon name="Check" className="text-white" size={16} />
                      ) : (
                        <span className="text-white text-sm font-bold">{milestone.week}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        milestone.completed ? 'text-surface-800' : 'text-surface-600'
                      }`}>
                        {milestone.title}
                      </p>
                      <p className="text-surface-500 text-sm">{t('common.week')} {milestone.week}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Navigation Footer */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-pink-100 px-4 py-3 shadow-lg z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-around items-center">
            {[
              { icon: 'Home', label: t('navigation.home'), path: '/', active: location.pathname === '/' },
              { icon: 'TrendingUp', label: t('navigation.progress'), path: '/progress', active: location.pathname === '/progress' },
              { icon: 'Calendar', label: t('navigation.calendar'), path: '/calendar', active: location.pathname === '/calendar' },
              { icon: 'Heart', label: t('navigation.health'), path: '/health', active: location.pathname === '/health' },
              { icon: 'User', label: t('navigation.profile'), path: '/profile', active: location.pathname === '/profile' }
            ].map((item, index) => (
              <motion.div key={index}>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'text-primary bg-pink-50' 
                      : 'text-surface-500 hover:text-primary hover:bg-pink-50'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="text-xs font-medium hidden sm:block">{item.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </div>
  )
}

export default Progress