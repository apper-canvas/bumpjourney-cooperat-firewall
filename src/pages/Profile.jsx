import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import MainFeature from '../components/MainFeature'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeSelector from '../components/ThemeSelector'
import ApperIcon from '../components/ApperIcon'

const Profile = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    dueDate: '2024-09-15',
    currentWeek: 20,
    birthPlan: 'Natural birth',
    emergencyContact: 'John Doe - +1 (555) 987-6543'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(userProfile)

  const handleSave = () => {
    setUserProfile(editForm)
    setIsEditing(false)
    toast.success(t('profile.saved_successfully'))
  }

  const handleCancel = () => {
    setEditForm(userProfile)
    setIsEditing(false)
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-surface-800">{t('profile.title', 'Profile')}</h2>
              <p className="text-surface-600 mt-1">{t('profile.subtitle', 'Manage your account and preferences')}</p>
            </div>
            {!isEditing && (
              <motion.button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('profile.edit', 'Edit Profile')}
              </motion.button>
            )}
            {isEditing && (
              <div className="flex space-x-2">
                <motion.button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('profile.save', 'Save')}
                </motion.button>
                <motion.button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('profile.cancel', 'Cancel')}
                </motion.button>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            {/* Personal Information */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-4 flex items-center">
                <ApperIcon name="User" className="mr-2 text-primary" size={20} />
                {t('profile.personal_info', 'Personal Information')}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('profile.name', 'Name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-surface-800 font-medium">{userProfile.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('profile.email', 'Email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-surface-800 font-medium">{userProfile.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('profile.phone', 'Phone')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-surface-800 font-medium">{userProfile.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    {t('profile.due_date', 'Due Date')}
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-surface-800 font-medium">{userProfile.dueDate}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Preferences Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pregnancy-card"
>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Settings" className="text-primary" size={20} />
                <h3 className="text-lg font-semibold text-surface-800">
                  {t('preferences', 'Preferences')}
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-surface-700">{t('language', 'Language')}</span>
                  <LanguageSwitcher />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-surface-700">{t('notifications', 'Notifications')}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                  >
                    {t('enabled', 'Enabled')}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Theme Selection Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pregnancy-card"
            >
              <ThemeSelector />
            </motion.div>

            {/* Language Settings */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-4 flex items-center">
                <ApperIcon name="Globe" className="mr-2 text-primary" size={20} />
                {t('profile.language_settings', 'Language Settings')}
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-600 mb-1">{t('profile.preferred_language', 'Preferred Language')}</p>
                  <p className="text-surface-800 font-medium">{t('profile.current_language', 'English')}</p>
                </div>
                <LanguageSwitcher />
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
              { icon: 'Home', label: t('navigation.home', 'Home'), path: '/', active: location.pathname === '/' },
              { icon: 'TrendingUp', label: t('navigation.progress', 'Progress'), path: '/progress', active: location.pathname === '/progress' },
              { icon: 'Calendar', label: t('navigation.calendar', 'Calendar'), path: '/calendar', active: location.pathname === '/calendar' },
              { icon: 'Heart', label: t('navigation.health', 'Health'), path: '/health', active: location.pathname === '/health' },
              { icon: 'User', label: t('navigation.profile', 'Profile'), path: '/profile', active: location.pathname === '/profile' }
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

export default Profile