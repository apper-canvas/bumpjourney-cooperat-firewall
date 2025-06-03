import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, differenceInWeeks, addWeeks } from 'date-fns'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [currentWeek, setCurrentWeek] = useState(20)
  const [dueDate, setDueDate] = useState(new Date(Date.now() + (20 * 7 * 24 * 60 * 60 * 1000)))
  const [userName, setUserName] = useState('Sarah')

  const floatingElements = [
    { icon: 'Heart', delay: 0, position: 'top-20 left-10' },
    { icon: 'Star', delay: 1, position: 'top-32 right-20' },
    { icon: 'Sparkles', delay: 2, position: 'top-40 left-1/4' },
    { icon: 'Heart', delay: 3, position: 'top-52 right-1/3' }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`floating-heart ${element.position}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3], 
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ApperIcon name={element.icon} size={24} />
          </motion.div>
        ))}
      </div>

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
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Baby" className="text-white" size={20} />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">BumpJourney</h1>
                <p className="text-sm text-surface-600 hidden sm:block">Your pregnancy companion</p>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="hidden sm:flex items-center space-x-2 bg-pink-50 px-3 py-2 rounded-xl">
                <ApperIcon name="Calendar" className="text-primary" size={16} />
                <span className="text-sm font-medium text-surface-700">
                  Week {currentWeek}
                </span>
              </div>
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.section 
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-800 mb-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Hello, {userName}! 👋
            </motion.h2>
            <motion.p 
              className="text-surface-600 text-base sm:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              You're <span className="font-semibold text-primary">{currentWeek} weeks</span> into your beautiful journey. 
              Your due date is <span className="font-semibold text-secondary">{format(dueDate, 'MMMM do, yyyy')}</span>
            </motion.p>
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, staggerChildren: 0.1 }}
          >
            {[
              { icon: 'Calendar', label: 'Weeks', value: currentWeek, color: 'primary' },
              { icon: 'Clock', label: 'Days Left', value: Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24)), color: 'secondary' },
              { icon: 'Heart', label: 'Trimester', value: currentWeek <= 12 ? '1st' : currentWeek <= 26 ? '2nd' : '3rd', color: 'accent' },
              { icon: 'Baby', label: 'Size', value: 'Banana', color: 'primary' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="pregnancy-card text-center group hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-${stat.color} to-${stat.color}-dark flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200`}>
                  <ApperIcon name={stat.icon} className="text-white" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-surface-800 mb-1">{stat.value}</h3>
                <p className="text-surface-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Main Feature */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <MainFeature currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
        </motion.section>

        {/* Navigation Footer */}
        <motion.nav 
          className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-pink-100 px-4 py-3 shadow-lg z-20"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-around items-center">
              {[
                { icon: 'Home', label: 'Home', active: true },
                { icon: 'TrendingUp', label: 'Progress' },
                { icon: 'Calendar', label: 'Calendar' },
                { icon: 'Heart', label: 'Health' },
                { icon: 'User', label: 'Profile' }
              ].map((item, index) => (
                <motion.button
                  key={index}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                    item.active 
                      ? 'text-primary bg-pink-50' 
                      : 'text-surface-500 hover:text-primary hover:bg-pink-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="text-xs font-medium hidden sm:block">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>
      </main>
    </div>
  )
}

export default Home