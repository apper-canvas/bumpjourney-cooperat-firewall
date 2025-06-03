import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = ({ currentWeek, setCurrentWeek }) => {
  const [activeTab, setActiveTab] = useState('symptoms')
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [severity, setSeverity] = useState(3)
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState('neutral')
  const [appointments, setAppointments] = useState([])
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    type: '',
    provider: '',
    notes: ''
  })

  const symptomOptions = [
    'Nausea', 'Fatigue', 'Back Pain', 'Heartburn', 'Swelling', 
    'Shortness of Breath', 'Headaches', 'Mood Swings', 'Food Cravings',
    'Braxton Hicks', 'Insomnia', 'Dizziness'
  ]

  const moodOptions = [
    { value: 'excellent', label: 'Excellent', icon: 'Smile', color: 'text-green-500' },
    { value: 'good', label: 'Good', icon: 'SmilePlus', color: 'text-blue-500' },
    { value: 'neutral', label: 'Neutral', icon: 'Meh', color: 'text-yellow-500' },
    { value: 'low', label: 'Low', icon: 'Frown', color: 'text-orange-500' },
    { value: 'difficult', label: 'Difficult', icon: 'X', color: 'text-red-500' }
  ]

  const appointmentTypes = [
    'Regular Checkup', 'Ultrasound', 'Blood Test', 'Specialist Consultation',
    'Glucose Test', 'Genetic Screening', 'Growth Scan'
  ]

  const babyDevelopment = {
    20: {
      size: 'Banana',
      length: '6.5 inches',
      weight: '10.2 oz',
      milestones: [
        'Baby can hear sounds from outside the womb',
        'Fingerprints are forming',
        'Baby is swallowing amniotic fluid',
        'Hair and nails are growing'
      ]
    }
  }

  const handleSymptomLog = () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    const newEntry = {
      id: Date.now(),
      date: new Date(),
      symptoms: selectedSymptoms,
      severity,
      notes,
      mood
    }

    setSymptoms([newEntry, ...symptoms])
    setSelectedSymptoms([])
    setSeverity(3)
    setNotes('')
    setMood('neutral')
    toast.success('Symptom entry logged successfully!')
  }

  const handleAppointmentAdd = () => {
    if (!newAppointment.date || !newAppointment.type || !newAppointment.provider) {
      toast.error('Please fill in all required fields')
      return
    }

    const appointment = {
      id: Date.now(),
      ...newAppointment,
      date: new Date(newAppointment.date),
      completed: false
    }

    setAppointments([...appointments, appointment])
    setNewAppointment({ date: '', type: '', provider: '', notes: '' })
    toast.success('Appointment scheduled successfully!')
  }

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const tabs = [
    { id: 'symptoms', label: 'Symptoms', icon: 'Heart' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <motion.div 
        className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center sm:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white/80 text-surface-700 hover:bg-white hover:shadow-md'
            }`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span className="text-sm sm:text-base">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Symptoms Tab */}
        {activeTab === 'symptoms' && (
          <motion.div
            key="symptoms"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Heart" className="text-white" size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Log Your Symptoms</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Symptom Selection */}
              <div>
                <h4 className="text-lg font-semibold text-surface-700 mb-4">How are you feeling today?</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
                  {symptomOptions.map((symptom) => (
                    <motion.button
                      key={symptom}
                      className={`symptom-button text-xs sm:text-sm ${
                        selectedSymptoms.includes(symptom) ? 'symptom-button-active' : ''
                      }`}
                      onClick={() => toggleSymptom(symptom)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {symptom}
                    </motion.button>
                  ))}
                </div>

                {/* Severity Scale */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Severity Level: {severity}/5
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-surface-500">Mild</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={severity}
                        onChange={(e) => setSeverity(parseInt(e.target.value))}
                        className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span className="text-sm text-surface-500">Severe</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div
                        key={num}
                        className={`w-2 h-2 rounded-full ${
                          num <= severity ? 'bg-primary' : 'bg-pink-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Mood Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Overall Mood
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((moodOption) => (
                      <motion.button
                        key={moodOption.value}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                          mood === moodOption.value
                            ? 'border-primary bg-pink-50 text-primary'
                            : 'border-surface-200 bg-white hover:border-primary hover:bg-pink-50'
                        }`}
                        onClick={() => setMood(moodOption.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ApperIcon name={moodOption.icon} size={16} className={moodOption.color} />
                        <span className="text-sm">{moodOption.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes and Submit */}
              <div>
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-surface-700 mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional details about how you're feeling..."
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                <motion.button
                  onClick={handleSymptomLog}
                  className="w-full btn-primary text-base sm:text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={selectedSymptoms.length === 0}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Plus" size={20} />
                    <span>Log Symptoms</span>
                  </div>
                </motion.button>

                {/* Recent Entries */}
                {symptoms.length > 0 && (
                  <div className="mt-6">
                    <h5 className="text-sm font-medium text-surface-700 mb-3">Recent Entries</h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {symptoms.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="bg-surface-50 rounded-lg p-3 text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{format(entry.date, 'MMM dd')}</span>
                            <span className="text-xs text-surface-500">Severity: {entry.severity}/5</span>
                          </div>
                          <div className="text-surface-600">
                            {entry.symptoms.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            key="appointments"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" className="text-white" size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Schedule Appointment</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Appointment Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="appointment-date" className="block text-sm font-medium text-surface-700 mb-2">
                    Date & Time
                  </label>
                  <input
                    id="appointment-date"
                    type="datetime-local"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="appointment-type" className="block text-sm font-medium text-surface-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    id="appointment-type"
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select type...</option>
                    {appointmentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="provider" className="block text-sm font-medium text-surface-700 mb-2">
                    Healthcare Provider
                  </label>
                  <input
                    id="provider"
                    type="text"
                    value={newAppointment.provider}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="Dr. Smith, Midwife Jane..."
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="appointment-notes" className="block text-sm font-medium text-surface-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="appointment-notes"
                    rows={3}
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Questions to ask, concerns to discuss..."
                    className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                <motion.button
                  onClick={handleAppointmentAdd}
                  className="w-full btn-secondary text-base sm:text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Plus" size={20} />
                    <span>Schedule Appointment</span>
                  </div>
                </motion.button>
              </div>

              {/* Upcoming Appointments */}
              <div>
                <h4 className="text-lg font-semibold text-surface-700 mb-4">Upcoming Appointments</h4>
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-surface-500">
                    <ApperIcon name="Calendar" size={48} className="mx-auto mb-3 text-surface-300" />
                    <p>No appointments scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {appointments
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((appointment) => (
                        <motion.div
                          key={appointment.id}
                          className="bg-surface-50 rounded-xl p-4 border border-surface-200 hover:shadow-md transition-all duration-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-surface-800">{appointment.type}</h5>
                            <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full">
                              {format(appointment.date, 'MMM dd')}
                            </span>
                          </div>
                          <p className="text-sm text-surface-600 mb-1">
                            with {appointment.provider}
                          </p>
                          <p className="text-xs text-surface-500">
                            {format(appointment.date, 'EEEE, MMMM dd, yyyy \'at\' h:mm a')}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-surface-600 mt-2 italic">
                              "{appointment.notes}"
                            </p>
                          )}
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="text-white" size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Your Pregnancy Progress</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Progress Overview */}
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-surface-700">Week {currentWeek} of 40</span>
                    <span className="text-sm text-surface-500">{Math.round((currentWeek / 40) * 100)}% Complete</span>
                  </div>
                  <div className="week-progress-bar">
                    <motion.div 
                      className="week-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentWeek / 40) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Baby Development */}
                <div className="baby-milestone">
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ApperIcon name="Baby" className="text-white" size={20} />
                    </motion.div>
                    <div>
                      <h4 className="text-lg font-semibold text-surface-800">Your Baby This Week</h4>
                      <p className="text-sm text-surface-600">
                        Size of a {babyDevelopment[currentWeek]?.size || 'Sweet Pea'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {babyDevelopment[currentWeek]?.length || '6.5"'}
                      </div>
                      <div className="text-xs text-surface-600">Length</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-secondary">
                        {babyDevelopment[currentWeek]?.weight || '10.2 oz'}
                      </div>
                      <div className="text-xs text-surface-600">Weight</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-surface-700 mb-2">Development Milestones</h5>
                    <ul className="space-y-1">
                      {(babyDevelopment[currentWeek]?.milestones || [
                        'Growing rapidly',
                        'Developing organs',
                        'Moving frequently',
                        'Building strength'
                      ]).map((milestone, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start space-x-2 text-xs text-surface-600"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ApperIcon name="Check" size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{milestone}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Week Navigation */}
              <div>
                <h4 className="text-lg font-semibold text-surface-700 mb-4">Navigate Weeks</h4>
                <div className="bg-surface-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.button
                      onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                      disabled={currentWeek <= 1}
                      className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      whileHover={{ scale: currentWeek > 1 ? 1.05 : 1 }}
                      whileTap={{ scale: currentWeek > 1 ? 0.95 : 1 }}
                    >
                      <ApperIcon name="ChevronLeft" size={20} className="text-surface-600" />
                    </motion.button>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">Week {currentWeek}</div>
                      <div className="text-sm text-surface-600">
                        {currentWeek <= 12 ? '1st Trimester' : currentWeek <= 26 ? '2nd Trimester' : '3rd Trimester'}
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => setCurrentWeek(Math.min(40, currentWeek + 1))}
                      disabled={currentWeek >= 40}
                      className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      whileHover={{ scale: currentWeek < 40 ? 1.05 : 1 }}
                      whileTap={{ scale: currentWeek < 40 ? 0.95 : 1 }}
                    >
                      <ApperIcon name="ChevronRight" size={20} className="text-surface-600" />
                    </motion.button>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1">
                    {[...Array(40)].map((_, index) => {
                      const week = index + 1
                      return (
                        <motion.button
                          key={week}
                          onClick={() => setCurrentWeek(week)}
                          className={`w-8 h-8 text-xs rounded-lg transition-all duration-200 ${
                            week === currentWeek
                              ? 'bg-primary text-white shadow-md'
                              : week < currentWeek
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-white text-surface-400 hover:bg-surface-100'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {week}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {40 - currentWeek}
                    </div>
                    <div className="text-sm text-surface-600">Weeks to go</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.ceil((40 - currentWeek) * 7)}
                    </div>
                    <div className="text-sm text-surface-600">Days remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature