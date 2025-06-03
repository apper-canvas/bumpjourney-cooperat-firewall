import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import ApperIcon from '../components/ApperIcon'
import LanguageSwitcher from '../components/LanguageSwitcher'

const Health = () => {
  const { t } = useTranslation()
  const location = useLocation()
  
  const [vitals] = useState({
    bloodPressure: '120/80',
    weight: '123 lbs',
    heartRate: '72 bpm',
    temperature: '98.6°F'
  })

  const [symptoms] = useState([
    { name: 'Morning Sickness', severity: 'mild', date: '2024-01-10' },
    { name: 'Back Pain', severity: 'moderate', date: '2024-01-12' },
    { name: 'Fatigue', severity: 'mild', date: '2024-01-14' }
  ])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-surface-600 bg-surface-100'
    }
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100">
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-800">{t('navigation.health')}</h2>
            <motion.button
              className="flex items-center space-x-2 btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="Plus" size={16} />
              <span>{t('health.log_symptom')}</span>
            </motion.button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vital Signs */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="Activity" className="mr-2 text-primary" size={20} />
                {t('health.vital_signs')}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: t('health.blood_pressure'), value: vitals.bloodPressure, icon: 'Heart' },
                  { label: t('health.weight'), value: vitals.weight, icon: 'Scale' },
                  { label: t('health.heart_rate'), value: vitals.heartRate, icon: 'Activity' },
                  { label: t('health.temperature'), value: vitals.temperature, icon: 'Thermometer' }
                ].map((vital, index) => (
                  <div key={index} className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name={vital.icon} className="text-white" size={16} />
                      </div>
                      <span className="text-surface-700 text-sm">{vital.label}</span>
                    </div>
                    <p className="text-surface-800 font-semibold text-lg">{vital.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Symptoms */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="AlertCircle" className="mr-2 text-secondary" size={20} />
                {t('health.recent_symptoms')}
              </h3>
              
              <div className="space-y-4">
                {symptoms.map((symptom, index) => (
                  <div key={index} className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-surface-800">{symptom.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                    </div>
                    <p className="text-surface-500 text-sm">{symptom.date}</p>
                  </div>
                ))}
              </div>
              
              <motion.button
                className="w-full mt-4 flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-pink-300 rounded-xl text-surface-600 hover:text-primary hover:border-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name="Plus" size={16} />
                <span>{t('health.add_symptom')}</span>
              </motion.button>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              className="lg:col-span-2 pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="Lightbulb" className="mr-2 text-accent" size={20} />
                {t('health.tips_for_week')} 20
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: 'Droplets', title: t('health.stay_hydrated'), desc: t('health.drink_water') },
                  { icon: 'Moon', title: t('health.get_rest'), desc: t('health.sleep_hours') },
                  { icon: 'Dumbbell', title: t('health.gentle_exercise'), desc: t('health.prenatal_yoga') }
                ].map((tip, index) => (
                  <div key={index} className="p-4 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-3">
                      <ApperIcon name={tip.icon} className="text-white" size={20} />
                    </div>
                    <h4 className="font-medium text-surface-800 mb-2">{tip.title}</h4>
                    <p className="text-surface-600 text-sm">{tip.desc}</p>
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

export default Health