import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addWeeks, differenceInDays } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ currentWeek, setCurrentWeek }) => {
  const [activeTab, setActiveTab] = useState('progress')
  const [symptoms, setSymptoms] = useState([])
  const [mood, setMood] = useState(5)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      type: 'Regular Checkup',
      date: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      location: 'Women\'s Health Clinic',
      notes: 'Routine prenatal checkup'
    },
    {
      id: 2,
      type: 'Ultrasound',
      date: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)),
      time: '2:30 PM',
      doctor: 'Dr. Michael Chen',
      location: 'Imaging Center',
      notes: 'Anatomy scan'
    }
  ])
  const [newAppointment, setNewAppointment] = useState({
    type: '',
    date: '',
    time: '',
    doctor: '',
    location: '',
    notes: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      birthDate: '1990-05-15',
      emergencyContact: {
        name: 'Mike Johnson',
        relationship: 'Husband',
        phone: '+1 (555) 123-4568'
      }
    },
    pregnancyInfo: {
      dueDate: '2024-08-15',
      lastPeriod: '2023-11-08',
      pregnancyType: 'singleton',
      complications: 'None',
      previousPregnancies: 0
    },
    medicalInfo: {
      primaryDoctor: 'Dr. Sarah Wilson',
      hospital: 'City Medical Center',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      medications: ['Prenatal Vitamins'],
      conditions: []
    },
    preferences: {
      notifications: {
        appointments: true,
        symptoms: true,
        milestones: true,
        articles: false
      },
      privacy: {
        shareProgress: false,
        anonymousData: true
      },
      units: {
        weight: 'lbs',
        height: 'ft/in',
        temperature: 'F'
      }
    }
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  
  // Common symptoms
  const commonSymptoms = [
    'Nausea', 'Fatigue', 'Breast Tenderness', 'Food Cravings', 
    'Heartburn', 'Back Pain', 'Swelling', 'Frequent Urination',
    'Mood Swings', 'Constipation', 'Headaches', 'Dizziness'
  ]
// Mood scale labels
  const moodLabels = ['Very Poor', 'Poor', 'Fair', 'Good', 'Great']

  // Missing state variables for symptoms tracking
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [severity, setSeverity] = useState(3)
  const [notes, setNotes] = useState('')

  // Symptom options
  const symptomOptions = [
    'Nausea', 'Fatigue', 'Breast Tenderness', 'Food Cravings', 
    'Heartburn', 'Back Pain', 'Swelling', 'Frequent Urination',
    'Mood Swings', 'Constipation', 'Headaches', 'Dizziness'
  ]

  // Appointment types
  const appointmentTypes = [
    'Regular Checkup',
    'Ultrasound',
    'Blood Work',
    'Glucose Test',
    'Specialist Consultation',
    'Emergency Visit'
  ]

  // Baby development data
  const babyDevelopment = {
    1: { size: 'Poppy Seed', length: '0.1"', weight: '< 0.1 oz', milestones: ['Fertilization occurs', 'Cell division begins'] },
    2: { size: 'Apple Seed', length: '0.1"', weight: '< 0.1 oz', milestones: ['Implantation begins', 'Hormone production starts'] },
    3: { size: 'Sesame Seed', length: '0.1"', weight: '< 0.1 oz', milestones: ['Neural tube forms', 'Heart begins to develop'] },
    4: { size: 'Peppercorn', length: '0.2"', weight: '< 0.1 oz', milestones: ['Heart starts beating', 'Limb buds appear'] },
    5: { size: 'Orange Seed', length: '0.3"', weight: '< 0.1 oz', milestones: ['Brain development', 'Facial features forming'] },
    6: { size: 'Lentil', length: '0.4"', weight: '< 0.1 oz', milestones: ['Organ development', 'Movement begins'] },
    7: { size: 'Blueberry', length: '0.5"', weight: '< 0.1 oz', milestones: ['Brain growth', 'Eyelids form'] },
    8: { size: 'Kidney Bean', length: '0.6"', weight: '0.04 oz', milestones: ['Fingers and toes', 'Taste buds develop'] },
    9: { size: 'Grape', length: '0.9"', weight: '0.07 oz', milestones: ['Essential organs', 'Movement increases'] },
    10: { size: 'Kumquat', length: '1.2"', weight: '0.14 oz', milestones: ['Joints working', 'Tooth buds form'] },
    11: { size: 'Fig', length: '1.6"', weight: '0.25 oz', milestones: ['Bone hardening', 'Hair follicles'] },
    12: { size: 'Lime', length: '2.1"', weight: '0.49 oz', milestones: ['Reflexes develop', 'Vocal cords form'] },
    13: { size: 'Pea Pod', length: '2.9"', weight: '0.81 oz', milestones: ['Sex organs develop', 'Fingerprints form'] },
    14: { size: 'Lemon', length: '3.4"', weight: '1.52 oz', milestones: ['Facial expressions', 'Body hair grows'] },
    15: { size: 'Apple', length: '4.0"', weight: '2.47 oz', milestones: ['Hearing develops', 'Legs grow longer'] },
    16: { size: 'Avocado', length: '4.6"', weight: '3.53 oz', milestones: ['Heart pumps blood', 'Nervous system functions'] },
    17: { size: 'Turnip', length: '5.1"', weight: '4.94 oz', milestones: ['Fat begins forming', 'Sweat glands develop'] },
    18: { size: 'Bell Pepper', length: '5.6"', weight: '6.70 oz', milestones: ['Yawning and hiccupping', 'Ears in position'] },
    19: { size: 'Tomato', length: '6.0"', weight: '8.47 oz', milestones: ['Brain development', 'Kidneys produce urine'] },
    20: { size: 'Banana', length: '6.5"', weight: '10.2 oz', milestones: ['Growing rapidly', 'Hair and nails grow'] },
    25: { size: 'Cauliflower', length: '13.6"', weight: '1.46 lb', milestones: ['Responding to sounds', 'Regular sleep patterns'] },
    30: { size: 'Cabbage', length: '15.7"', weight: '2.91 lb', milestones: ['Eyes open and close', 'Strong kicks'] },
    35: { size: 'Honeydew Melon', length: '18.2"', weight: '5.25 lb', milestones: ['Immune system developing', 'Rapid weight gain'] },
    40: { size: 'Watermelon', length: '20.2"', weight: '7.5 lb', milestones: ['Fully developed', 'Ready for birth'] }
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
    setMood(5)
    toast.success('Symptom entry logged successfully!')
  }

const handleAppointmentAdd = () => {
    if (!newAppointment.date || !newAppointment.type || !newAppointment.doctor) {
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
    setNewAppointment({ 
      type: '',
      date: '',
      time: '',
      doctor: '',
      location: '',
      notes: ''
    })
    setShowAddForm(false)
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
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' },
    { id: 'symptoms', label: 'Symptoms', icon: 'Heart' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'education', label: 'Education', icon: 'BookOpen' },
    { id: 'profile', label: 'Profile', icon: 'User' }
  ]

  // Educational content organized by trimester and week
  const educationalContent = {
    1: { // First Trimester (weeks 1-12)
      title: "First Trimester",
      subtitle: "Foundations & Early Development",
      articles: [
        {
          id: 'early-signs',
          title: 'Early Pregnancy Signs & Symptoms',
          category: 'Medical',
          readTime: '5 min',
          weeks: [1, 2, 3, 4, 5, 6],
          preview: 'Understanding the first signs of pregnancy and what to expect in your body.',
          content: 'Learn about missed periods, implantation bleeding, breast tenderness, fatigue, and nausea. Discover when to take a pregnancy test and what early symptoms are normal versus concerning.',
          tips: [
            'Take a pregnancy test after a missed period',
            'Start prenatal vitamins with folic acid',
            'Avoid alcohol, smoking, and certain medications',
            'Schedule your first prenatal appointment'
          ]
        },
        {
          id: 'prenatal-vitamins',
          title: 'Essential Prenatal Vitamins & Nutrition',
          category: 'Nutrition',
          readTime: '7 min',
          weeks: [4, 5, 6, 7, 8, 9, 10, 11, 12],
          preview: 'Complete guide to prenatal nutrition and supplementation for optimal baby development.',
          content: 'Detailed breakdown of essential nutrients including folic acid, iron, calcium, DHA, and vitamin D. Learn about food sources and supplement recommendations.',
          tips: [
            'Take 400-800 mcg of folic acid daily',
            'Include iron-rich foods in your diet',
            'Eat folate-rich foods like leafy greens',
            'Stay hydrated with 8-10 glasses of water daily'
          ]
        },
        {
          id: 'morning-sickness',
          title: 'Managing Morning Sickness & Nausea',
          category: 'Lifestyle',
          readTime: '6 min',
          weeks: [6, 7, 8, 9, 10, 11, 12],
          preview: 'Effective strategies to cope with morning sickness and maintain nutrition.',
          content: 'Natural remedies, dietary changes, and medical options for managing nausea and vomiting. When to contact your healthcare provider.',
          tips: [
            'Eat small, frequent meals throughout the day',
            'Try ginger tea or ginger supplements',
            'Keep crackers by your bedside',
            'Avoid strong smells and trigger foods'
          ]
        },
        {
          id: 'first-appointment',
          title: 'Your First Prenatal Appointment',
          category: 'Medical',
          readTime: '8 min',
          weeks: [8, 9, 10, 11, 12],
          preview: 'What to expect during your first prenatal visit and how to prepare.',
          content: 'Complete overview of first appointment procedures including medical history, physical exam, blood tests, and establishing due date.',
          tips: [
            'Bring a list of current medications',
            'Prepare family medical history',
            'Write down questions in advance',
            'Bring your partner or support person'
          ]
        }
      ]
    },
    2: { // Second Trimester (weeks 13-26)
      title: "Second Trimester",
      subtitle: "Growth & Development",
      articles: [
        {
          id: 'anatomy-scan',
          title: 'Anatomy Scan & Genetic Testing',
          category: 'Medical',
          readTime: '10 min',
          weeks: [18, 19, 20, 21, 22],
          preview: 'Understanding the detailed ultrasound and optional genetic screening tests.',
          content: 'Comprehensive guide to the 20-week anatomy scan, what it checks for, and various genetic testing options available during pregnancy.',
          tips: [
            'Schedule scan between 18-22 weeks',
            'Drink water before the appointment',
            'Bring your partner to share the experience',
            'Ask about getting ultrasound photos'
          ]
        },
        {
          id: 'weight-gain',
          title: 'Healthy Weight Gain During Pregnancy',
          category: 'Nutrition',
          readTime: '6 min',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
          preview: 'Guidelines for appropriate weight gain and maintaining a healthy pregnancy weight.',
          content: 'Evidence-based recommendations for weight gain based on pre-pregnancy BMI, tracking methods, and nutrition strategies.',
          tips: [
            'Aim for 1-2 pounds per week in 2nd trimester',
            'Focus on nutrient-dense foods',
            'Track weight gain at prenatal visits',
            'Stay active with approved exercises'
          ]
        },
        {
          id: 'baby-movements',
          title: 'Feeling Baby\'s First Movements',
          category: 'Medical',
          readTime: '5 min',
          weeks: [16, 17, 18, 19, 20, 21, 22, 23, 24],
          preview: 'When to expect quickening and how to monitor baby\'s movements.',
          content: 'Understanding fetal movement patterns, when first-time vs. experienced mothers feel movement, and movement tracking.',
          tips: [
            'First movements feel like flutter or bubbles',
            'Movements become stronger over time',
            'Track patterns once movements are regular',
            'Contact doctor if movements decrease'
          ]
        },
        {
          id: 'exercise-second',
          title: 'Safe Exercise in Second Trimester',
          category: 'Lifestyle',
          readTime: '8 min',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
          preview: 'Exercise guidelines and safe workout routines for the second trimester.',
          content: 'Recommended exercises, modifications for pregnancy, warning signs to stop exercising, and benefits of staying active.',
          tips: [
            'Aim for 30 minutes of moderate exercise daily',
            'Avoid contact sports and lying flat on back',
            'Stay hydrated and avoid overheating',
            'Listen to your body and rest when needed'
          ]
        }
      ]
    },
    3: { // Third Trimester (weeks 27-40)
      title: "Third Trimester",
      subtitle: "Preparation & Final Stretch",
      articles: [
        {
          id: 'birth-plan',
          title: 'Creating Your Birth Plan',
          category: 'Preparation',
          readTime: '12 min',
          weeks: [28, 29, 30, 31, 32, 33, 34, 35, 36],
          preview: 'How to create a flexible birth plan that reflects your preferences and values.',
          content: 'Step-by-step guide to creating a birth plan including pain management options, delivery preferences, and contingency planning.',
          tips: [
            'Discuss options with your healthcare provider',
            'Research pain management choices',
            'Consider who you want present during birth',
            'Keep plans flexible for unexpected changes'
          ]
        },
        {
          id: 'hospital-bag',
          title: 'Hospital Bag Packing Checklist',
          category: 'Preparation',
          readTime: '7 min',
          weeks: [32, 33, 34, 35, 36, 37, 38, 39, 40],
          preview: 'Complete packing checklist for you, your partner, and baby.',
          content: 'Detailed lists of essentials for labor, delivery, and postpartum stay including comfort items and practical necessities.',
          tips: [
            'Pack bag by 36 weeks',
            'Include comfortable going-home outfits',
            'Bring phone chargers and camera',
            'Pack newborn and 0-3 month baby clothes'
          ]
        },
        {
          id: 'labor-signs',
          title: 'Recognizing Signs of Labor',
          category: 'Medical',
          readTime: '9 min',
          weeks: [34, 35, 36, 37, 38, 39, 40],
          preview: 'How to identify true labor vs. false labor and when to head to the hospital.',
          content: 'Comprehensive guide to labor signs including contractions, water breaking, bloody show, and other indicators.',
          tips: [
            'Time contractions for frequency and duration',
            'Call doctor when contractions are regular',
            'Know the difference between Braxton Hicks and real labor',
            'Have transportation plan ready'
          ]
        },
        {
          id: 'postpartum-prep',
          title: 'Preparing for Postpartum Recovery',
          category: 'Preparation',
          readTime: '11 min',
          weeks: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
          preview: 'What to expect after delivery and how to prepare for the fourth trimester.',
          content: 'Physical and emotional recovery after birth, newborn care basics, breastfeeding preparation, and building support systems.',
          tips: [
            'Stock up on postpartum supplies',
            'Prepare freezer meals in advance',
            'Arrange help for the first few weeks',
            'Learn about baby feeding and sleeping patterns'
          ]
        }
      ]
    }
  }

  // State for education section
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedArticle, setExpandedArticle] = useState(null)

  // Get current trimester based on week
  const getCurrentTrimester = (week) => {
    if (week <= 12) return 1
    if (week <= 26) return 2
    return 3
  }

  // Filter articles based on current week, search term, and category
  const getRelevantArticles = () => {
    const currentTrimester = getCurrentTrimester(currentWeek)
    const trimesterContent = educationalContent[currentTrimester]
    
    if (!trimesterContent) return []

    return trimesterContent.articles.filter(article => {
      const matchesWeek = article.weeks.includes(currentWeek) || 
                         article.weeks.some(week => Math.abs(week - currentWeek) <= 2)
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      
      return matchesWeek && matchesSearch && matchesCategory
    })
  }

  // Get all available categories
  const getCategories = () => {
    const allCategories = new Set()
    Object.values(educationalContent).forEach(trimester => {
      trimester.articles.forEach(article => {
        allCategories.add(article.category)
      })
    })
    return ['All', ...Array.from(allCategories)]
  }

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
                  {commonSymptoms.map((symptom) => (
                    <motion.button
                      key={symptom}
                      className={`px-3 py-2 border border-surface-200 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        selectedSymptoms.includes(symptom) 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-surface-700 hover:border-primary hover:text-primary'
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

                {/* Mood Scale */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-surface-700 mb-3">
                    Overall Mood: {moodLabels[mood - 1]}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-surface-500">😔</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={mood}
                        onChange={(e) => setMood(parseInt(e.target.value))}
                        className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span className="text-sm text-surface-500">😊</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div
                        key={num}
                        className={`w-2 h-2 rounded-full ${
                          num <= mood ? 'bg-primary' : 'bg-pink-200'
                        }`}
                      />
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
                  className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors duration-200 text-base sm:text-lg"
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
                  <label htmlFor="doctor" className="block text-sm font-medium text-surface-700 mb-2">
                    Healthcare Provider
                  </label>
                  <input
                    id="doctor"
                    type="text"
                    value={newAppointment.doctor}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, doctor: e.target.value }))}
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
                  className="w-full bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-colors duration-200 text-base sm:text-lg"
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
                            with {appointment.doctor}
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
                  <div className="w-full bg-surface-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentWeek / 40) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Baby Development */}
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ApperIcon name="Heart" className="text-white" size={20} />
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
                          className={`w-8 h-8 rounded text-xs font-medium transition-all duration-200 ${
                            week === currentWeek
                              ? 'bg-primary text-white shadow-md'
                              : week < currentWeek
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <motion.div
            key="education"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <ApperIcon name="BookOpen" className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Educational Articles & Tips</h3>
                <p className="text-sm text-surface-600">
                  {educationalContent[getCurrentTrimester(currentWeek)]?.title} - Week {currentWeek}
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <ApperIcon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              >
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Trimester Overview */}
            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 mb-6 border border-purple-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="Star" className="text-white" size={12} />
                </div>
                <h4 className="text-lg font-semibold text-surface-800">
                  {educationalContent[getCurrentTrimester(currentWeek)]?.title}
                </h4>
              </div>
              <p className="text-surface-600 text-sm">
                {educationalContent[getCurrentTrimester(currentWeek)]?.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                  Week {currentWeek}
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-indigo-600 border border-indigo-200">
                  {getRelevantArticles().length} relevant articles
                </span>
              </div>
            </motion.div>

            {/* Articles Grid */}
            <div className="space-y-4">
              {getRelevantArticles().length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="BookOpen" size={48} className="mx-auto mb-4 text-surface-300" />
                  <h4 className="text-lg font-medium text-surface-600 mb-2">No articles found</h4>
                  <p className="text-surface-500 text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                getRelevantArticles().map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              article.category === 'Medical' ? 'bg-red-100 text-red-600' :
                              article.category === 'Nutrition' ? 'bg-green-100 text-green-600' :
                              article.category === 'Lifestyle' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {article.category}
                            </span>
                            <span className="text-xs text-surface-500 flex items-center space-x-1">
                              <ApperIcon name="Clock" size={12} />
                              <span>{article.readTime}</span>
                            </span>
                          </div>
                          <h5 className="text-lg font-semibold text-surface-800 mb-2">
                            {article.title}
                          </h5>
                          <p className="text-surface-600 text-sm mb-3">
                            {article.preview}
                          </p>
                        </div>
                        
                        <motion.button
                          onClick={() => setExpandedArticle(
                            expandedArticle === article.id ? null : article.id
                          )}
                          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-200 self-start"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span>{expandedArticle === article.id ? 'Collapse' : 'Read More'}</span>
                          <ApperIcon 
                            name={expandedArticle === article.id ? "ChevronUp" : "ChevronDown"} 
                            size={16} 
                          />
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {expandedArticle === article.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-surface-200 pt-4 mt-4"
                          >
                            <div className="prose prose-sm max-w-none">
                              <p className="text-surface-700 mb-4">{article.content}</p>
                              
                              <h6 className="text-sm font-semibold text-surface-800 mb-3 flex items-center space-x-2">
                                <ApperIcon name="Lightbulb" size={16} className="text-yellow-500" />
                                <span>Key Tips</span>
                              </h6>
                              <ul className="space-y-2">
                                {article.tips.map((tip, tipIndex) => (
                                  <motion.li
                                    key={tipIndex}
                                    className="flex items-start space-x-3 text-sm text-surface-600"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: tipIndex * 0.1 }}
                                  >
                                    <ApperIcon 
                                      name="Check" 
                                      size={14} 
                                      className="text-green-500 mt-0.5 flex-shrink-0" 
                                    />
                                    <span>{tip}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Additional Resources */}
            <motion.div 
              className="mt-8 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 border border-orange-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="Heart" className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-surface-800">Remember</h4>
              </div>
              <p className="text-surface-600 text-sm leading-relaxed">
                This information is for educational purposes only and should not replace professional medical advice. 
                Always consult with your healthcare provider about any concerns or questions regarding your pregnancy. 
                Every pregnancy is unique, and your doctor can provide personalized guidance based on your specific situation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-orange-600 border border-orange-200">
                  Evidence-based content
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-pink-600 border border-pink-200">
                  Regularly updated
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                  Expert reviewed
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}

  // Profile handlers
  const handleProfileSave = (section, data) => {
    setProfileData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
    setEditingSection(null)
    toast.success('Profile updated successfully!')
  }

  const handleNotificationToggle = (type) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [type]: !prev.preferences.notifications[type]
        }
      }
    }))
    toast.success('Notification preferences updated!')
  }

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
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-lg p-6 sm:p-8"
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
                  {commonSymptoms.map((symptom) => (
                    <motion.button
                      key={symptom}
                      className={`px-3 py-2 border border-surface-200 rounded-lg text-xs sm:text-sm transition-colors duration-200 ${
                        selectedSymptoms.includes(symptom) 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-white text-surface-700 hover:border-primary hover:text-primary'
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
                          className={`w-8 h-8 rounded text-xs font-medium transition-all duration-200 ${
                            week === currentWeek
                              ? 'bg-primary text-white shadow-md'
                              : week < currentWeek
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 shadow-lg p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <motion.div 
                  className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <ApperIcon name="User" className="text-white" size={40} />
                </motion.div>
                <h2 className="text-2xl font-bold text-surface-800 mb-2">
                  {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                </h2>
                <p className="text-surface-600">Week {currentWeek} • Due {format(new Date(profileData.pregnancyInfo.dueDate), 'MMM dd, yyyy')}</p>
              </div>
              {/* Profile Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <motion.div 
                  className="pregnancy-card"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-surface-800 flex items-center">
                      <ApperIcon name="User" className="text-primary mr-2" size={20} />
                      Personal Information
                    </h3>
                    <motion.button
                      onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                      className="text-primary hover:text-primary-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={editingSection === 'personal' ? 'X' : 'Edit'} size={16} />
                    </motion.button>
                  </div>

                  {editingSection === 'personal' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">First Name</label>
                          <input
                            type="text"
                            defaultValue={profileData.personalInfo.firstName}
                            className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            defaultValue={profileData.personalInfo.lastName}
                            className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                        <input
                          type="email"
                          defaultValue={profileData.personalInfo.email}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          defaultValue={profileData.personalInfo.phone}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleProfileSave('personalInfo', {})}
                          className="btn-primary text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Email:</span>
                        <span className="font-medium">{profileData.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Phone:</span>
                        <span className="font-medium">{profileData.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Birth Date:</span>
                        <span className="font-medium">{format(new Date(profileData.personalInfo.birthDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="pt-2 border-t border-pink-100">
                        <p className="text-sm font-medium text-surface-700 mb-1">Emergency Contact</p>
                        <p className="text-sm text-surface-600">{profileData.personalInfo.emergencyContact.name} ({profileData.personalInfo.emergencyContact.relationship})</p>
                        <p className="text-sm text-surface-600">{profileData.personalInfo.emergencyContact.phone}</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Pregnancy Information */}
                <motion.div 
                  className="pregnancy-card"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-surface-800 flex items-center">
                      <ApperIcon name="Baby" className="text-primary mr-2" size={20} />
                      Pregnancy Details
                    </h3>
                    <motion.button
                      onClick={() => setEditingSection(editingSection === 'pregnancy' ? null : 'pregnancy')}
                      className="text-primary hover:text-primary-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={editingSection === 'pregnancy' ? 'X' : 'Edit'} size={16} />
                    </motion.button>
                  </div>

                  {editingSection === 'pregnancy' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          defaultValue={profileData.pregnancyInfo.dueDate}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Last Menstrual Period</label>
                        <input
                          type="date"
                          defaultValue={profileData.pregnancyInfo.lastPeriod}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Pregnancy Type</label>
                        <select
                          defaultValue={profileData.pregnancyInfo.pregnancyType}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="singleton">Single Baby</option>
                          <option value="twins">Twins</option>
                          <option value="triplets">Triplets</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleProfileSave('pregnancyInfo', {})}
                          className="btn-primary text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Due Date:</span>
                        <span className="font-medium">{format(new Date(profileData.pregnancyInfo.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Last Period:</span>
                        <span className="font-medium">{format(new Date(profileData.pregnancyInfo.lastPeriod), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Type:</span>
                        <span className="font-medium capitalize">{profileData.pregnancyInfo.pregnancyType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Previous Pregnancies:</span>
                        <span className="font-medium">{profileData.pregnancyInfo.previousPregnancies}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Complications:</span>
                        <span className="font-medium">{profileData.pregnancyInfo.complications}</span>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Medical Information */}
                <motion.div 
                  className="pregnancy-card"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-surface-800 flex items-center">
                      <ApperIcon name="Heart" className="text-primary mr-2" size={20} />
                      Medical Information
                    </h3>
                    <motion.button
                      onClick={() => setEditingSection(editingSection === 'medical' ? null : 'medical')}
                      className="text-primary hover:text-primary-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={editingSection === 'medical' ? 'X' : 'Edit'} size={16} />
                    </motion.button>
                  </div>

                  {editingSection === 'medical' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Primary Doctor</label>
                        <input
                          type="text"
                          defaultValue={profileData.medicalInfo.primaryDoctor}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Hospital/Clinic</label>
                        <input
                          type="text"
                          defaultValue={profileData.medicalInfo.hospital}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Blood Type</label>
                        <select
                          defaultValue={profileData.medicalInfo.bloodType}
                          className="w-full px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleProfileSave('medicalInfo', {})}
                          className="btn-primary text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Save Changes
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingSection(null)}
                          className="px-4 py-2 text-surface-600 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Primary Doctor:</span>
                        <span className="font-medium">{profileData.medicalInfo.primaryDoctor}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Hospital:</span>
                        <span className="font-medium">{profileData.medicalInfo.hospital}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-surface-600">Blood Type:</span>
                        <span className="font-medium">{profileData.medicalInfo.bloodType}</span>
                      </div>
                      <div className="pt-2 border-t border-pink-100">
                        <p className="text-sm font-medium text-surface-700 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {profileData.medicalInfo.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-pink-100">
                        <p className="text-sm font-medium text-surface-700 mb-2">Current Medications</p>
                        <div className="flex flex-wrap gap-1">
                          {profileData.medicalInfo.medications.map((med, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Preferences & Settings */}
                <motion.div 
                  className="pregnancy-card"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-semibold text-surface-800 flex items-center">
                      <ApperIcon name="Settings" className="text-primary mr-2" size={20} />
                      Preferences & Settings
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Notifications */}
                    <div>
                      <h4 className="text-sm font-medium text-surface-700 mb-3">Notifications</h4>
                      <div className="space-y-2">
                        {Object.entries(profileData.preferences.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-surface-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <motion.button
                              onClick={() => handleNotificationToggle(key)}
                              className={`w-12 h-6 rounded-full transition-colors ${
                                value ? 'bg-primary' : 'bg-surface-300'
                              }`}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow-md"
                                animate={{ x: value ? 26 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Units */}
                    <div className="pt-4 border-t border-pink-100">
                      <h4 className="text-sm font-medium text-surface-700 mb-3">Unit Preferences</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Weight:</span>
                          <span className="font-medium text-sm">{profileData.preferences.units.weight}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Height:</span>
                          <span className="font-medium text-sm">{profileData.preferences.units.height}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Temperature:</span>
                          <span className="font-medium text-sm">°{profileData.preferences.units.temperature}</span>
                        </div>
                      </div>
                    </div>

                    {/* Privacy */}
                    <div className="pt-4 border-t border-pink-100">
                      <h4 className="text-sm font-medium text-surface-700 mb-3">Privacy</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Share Progress</span>
                          <motion.button
                            className={`w-12 h-6 rounded-full transition-colors ${
                              profileData.preferences.privacy.shareProgress ? 'bg-primary' : 'bg-surface-300'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{ x: profileData.preferences.privacy.shareProgress ? 26 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-surface-600">Anonymous Data</span>
                          <motion.button
                            className={`w-12 h-6 rounded-full transition-colors ${
                              profileData.preferences.privacy.anonymousData ? 'bg-primary' : 'bg-surface-300'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{ x: profileData.preferences.privacy.anonymousData ? 26 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Progress Overview */}
              <motion.div 
                className="pregnancy-card"
                whileHover={{ y: -2 }}
              >
                <h3 className="text-lg font-semibold text-surface-800 mb-4 flex items-center">
                  <ApperIcon name="TrendingUp" className="text-primary mr-2" size={20} />
                  Journey Overview
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{currentWeek}</span>
                    </div>
                    <p className="text-sm text-surface-600">Weeks Completed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{Math.max(0, differenceInDays(new Date(profileData.pregnancyInfo.dueDate), new Date()))}</span>
                    </div>
                    <p className="text-sm text-surface-600">Days Remaining</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent to-teal-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{currentWeek <= 12 ? '1' : currentWeek <= 26 ? '2' : '3'}</span>
                    </div>
                    <p className="text-sm text-surface-600">Current Trimester</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-pink-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">Pregnancy Progress</span>
                    <span className="text-sm text-surface-600">{Math.round((currentWeek / 40) * 100)}%</span>
                  </div>
                  <div className="week-progress-bar">
                    <motion.div 
                      className="week-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentWeek / 40) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success('Profile data exported successfully!')}
                >
                  <ApperIcon name="Download" className="mr-2" size={16} />
                  Export Data
                </motion.button>
                <motion.button
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.info('Backup created successfully!')}
                >
                  <ApperIcon name="Save" className="mr-2" size={16} />
                  Backup Profile
                </motion.button>
                <motion.button
                  className="px-6 py-3 text-surface-600 border border-surface-300 rounded-xl hover:bg-surface-50 transition-colors font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirm('Are you sure you want to sign out?')) {
                      toast.success('Signed out successfully!')
                    }
                  }}
                >
                  <ApperIcon name="LogOut" className="mr-2" size={16} />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature