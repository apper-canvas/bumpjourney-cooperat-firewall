import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import LanguageSwitcher from '../components/LanguageSwitcher'

const Calendar = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [currentDate] = useState(new Date())
  
  const appointments = [
    { id: 1, date: '2024-01-15', time: '10:00 AM', type: 'Checkup', doctor: 'Dr. Smith' },
    { id: 2, date: '2024-01-22', time: '2:00 PM', type: 'Ultrasound', doctor: 'Dr. Johnson' },
    { id: 3, date: '2024-01-28', time: '11:30 AM', type: 'Blood Test', doctor: 'Nurse Wilson' }
  ]

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAppointmentForDate = (date) => {
    return appointments.find(apt => 
      format(new Date(apt.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-800">{t('navigation.calendar')}</h2>
            <motion.button
              className="flex items-center space-x-2 btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="Plus" size={16} />
              <span>{t('calendar.add_appointment')}</span>
            </motion.button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar View */}
            <motion.div
              className="lg:col-span-2 pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-800">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="flex space-x-2">
                  <motion.button
                    className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ApperIcon name="ChevronLeft" size={16} className="text-primary" />
                  </motion.button>
                  <motion.button
                    className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ApperIcon name="ChevronRight" size={16} className="text-primary" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-surface-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const appointment = getAppointmentForDate(day)
                  return (
                    <motion.div
                      key={index}
                      className={`p-2 text-center text-sm rounded-lg hover:bg-pink-50 transition-colors relative ${
                        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                          ? 'bg-primary text-white'
                          : 'text-surface-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {format(day, 'd')}
                      {appointment && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-secondary rounded-full"></div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              className="pregnancy-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-surface-800 mb-6 flex items-center">
                <ApperIcon name="Clock" className="mr-2 text-primary" size={20} />
                {t('calendar.upcoming')}
              </h3>
              
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 bg-pink-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-surface-800">{appointment.type}</h4>
                      <span className="text-sm text-primary font-medium">{appointment.time}</span>
                    </div>
                    <p className="text-surface-600 text-sm">{appointment.doctor}</p>
                    <p className="text-surface-500 text-xs">{format(new Date(appointment.date), 'MMMM do, yyyy')}</p>
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

export default Calendar