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
  
  // Reminder system state
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Take Prenatal Vitamins',
      description: 'Daily prenatal vitamin with folic acid',
      type: 'medication',
      date: new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)),
      time: '08:00',
      completed: false,
      recurring: 'daily',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Glucose Test Appointment',
      description: 'Routine glucose screening test',
      type: 'appointment',
      date: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      time: '10:30',
      completed: false,
      recurring: 'none',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Prenatal Yoga Class',
      description: 'Weekly prenatal yoga session',
      type: 'activity',
      date: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
      time: '18:00',
      completed: false,
      recurring: 'weekly',
      priority: 'medium'
    }
  ])
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'appointment',
    date: '',
    time: '',
    recurring: 'none',
    priority: 'medium'
  })
const [showReminderForm, setShowReminderForm] = useState(false)
  const [editingReminder, setEditingReminder] = useState(null)
  const [reminderFilter, setReminderFilter] = useState('all')
  
  // Task Manager state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Schedule First Prenatal Appointment',
      description: 'Book appointment with OB/GYN between 8-10 weeks',
      category: 'medical',
      priority: 'high',
      dueDate: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)),
      status: 'pending',
      completed: false,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Start Taking Prenatal Vitamins',
      description: 'Begin daily prenatal vitamins with folic acid',
      category: 'health',
      priority: 'high',
      dueDate: new Date(),
      status: 'completed',
      completed: true,
      createdAt: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000))
    },
    {
      id: 3,
      title: 'Research Pediatricians',
      description: 'Find and interview potential pediatricians',
      category: 'preparation',
      priority: 'medium',
      dueDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
      status: 'pending',
      completed: false,
      createdAt: new Date()
    }
  ])
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  })
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskFilter, setTaskFilter] = useState('all')
  const [taskSort, setTaskSort] = useState('dueDate')
  const [taskSearch, setTaskSearch] = useState('')
  
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
// Appointment types
  const appointmentTypes = [
    'Regular Checkup',
    'Ultrasound',
    'Blood Work',
    'Glucose Test',
    'Specialist Consultation',
    'Emergency Visit'
  ]

  // Reminder types and options
// Reminder types and options
  const reminderTypes = [
    { value: 'appointment', label: 'Doctor Appointment', icon: 'Calendar' },
    { value: 'scan', label: 'Ultrasound/Scan', icon: 'Monitor' },
    { value: 'medication', label: 'Medication', icon: 'Pill' },
    { value: 'activity', label: 'Exercise/Activity', icon: 'Activity' },
    { value: 'checkup', label: 'Health Checkup', icon: 'Heart' },
    { value: 'test', label: 'Medical Test', icon: 'FileText' },
    { value: 'preparation', label: 'Birth Preparation', icon: 'Package' },
    { value: 'other', label: 'Other', icon: 'Clock' }
  ]

  const recurringOptions = [
    { value: 'none', label: 'One-time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
{ value: 'high', label: 'High', color: 'red' }
  ]

  // Task categories and options
  const taskCategories = [
    { value: 'general', label: 'General', icon: 'List' },
    { value: 'medical', label: 'Medical', icon: 'Heart' },
    { value: 'health', label: 'Health & Wellness', icon: 'Activity' },
    { value: 'preparation', label: 'Baby Preparation', icon: 'Package' },
    { value: 'nutrition', label: 'Nutrition', icon: 'Apple' },
    { value: 'exercise', label: 'Exercise', icon: 'Zap' },
    { value: 'education', label: 'Education', icon: 'BookOpen' },
    { value: 'shopping', label: 'Shopping', icon: 'ShoppingCart' },
    { value: 'legal', label: 'Legal/Admin', icon: 'FileText' }
  ]

  const taskPriorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const taskStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
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

  // Task helper functions
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = tasks.filter(task => !task.completed).length
    const overdue = tasks.filter(task => !task.completed && new Date(task.dueDate) < new Date()).length
    const today = tasks.filter(task => !task.completed && format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length
    
    return { total, completed, pending, overdue, today }
  }

  const isTaskOverdue = (task) => {
    return !task.completed && new Date(task.dueDate) < new Date()
  }

  const getTaskPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green'
      case 'in-progress': return 'blue'
      case 'pending': return 'yellow'
      case 'cancelled': return 'gray'
      default: return 'gray'
    }
  }

  const getTaskCategoryColor = (category) => {
    switch (category) {
      case 'medical': return 'red'
      case 'health': return 'blue'
      case 'preparation': return 'green'
      case 'nutrition': return 'purple'
      case 'exercise': return 'indigo'
      case 'education': return 'orange'
      case 'shopping': return 'teal'
      case 'legal': return 'gray'
      default: return 'gray'
    }
  }

  const getTaskCategoryIcon = (category) => {
    const cat = taskCategories.find(c => c.value === category)
    return cat ? cat.icon : 'List'
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    // Apply search filter
    if (taskSearch) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        task.description.toLowerCase().includes(taskSearch.toLowerCase())
      )
    }

    // Apply category/status filter
    if (taskFilter !== 'all') {
      if (taskFilter === 'completed') {
        filtered = filtered.filter(task => task.completed)
      } else if (taskFilter === 'pending') {
        filtered = filtered.filter(task => !task.completed)
      } else if (taskFilter === 'overdue') {
        filtered = filtered.filter(task => isTaskOverdue(task))
      } else if (taskFilter === 'today') {
        filtered = filtered.filter(task => 
          !task.completed && format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        )
      } else if (taskFilter === 'upcoming') {
        filtered = filtered.filter(task => 
          !task.completed && new Date(task.dueDate) > new Date()
        )
      } else {
        // Filter by category
        filtered = filtered.filter(task => task.category === taskFilter)
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (taskSort) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'title':
          return a.title.localeCompare(b.title)
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })

    return filtered
  }

  // Task handlers
  const handleTaskAdd = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const task = {
      id: Date.now(),
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      completed: newTask.status === 'completed',
      createdAt: new Date()
    }

    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    })
    setShowTaskForm(false)
    toast.success('Task added successfully!')
  }

  const handleTaskUpdate = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === editingTask
          ? {
              ...task,
              ...newTask,
              dueDate: new Date(newTask.dueDate),
              completed: newTask.status === 'completed'
            }
          : task
      )
    )

    setNewTask({
      title: '',
      description: '',
      category: 'general',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    })
    setShowTaskForm(false)
    setEditingTask(null)
    toast.success('Task updated successfully!')
  }

  const handleTaskEdit = (task) => {
    setEditingTask(task.id)
    setNewTask({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: format(task.dueDate, 'yyyy-MM-dd'),
      status: task.status
    })
    setShowTaskForm(true)
  }

  const handleTaskDelete = (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id))
      toast.success('Task deleted successfully!')
    }
  }

  const handleTaskToggle = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { 
              ...task, 
              completed: !task.completed,
              status: !task.completed ? 'completed' : 'pending'
            }
          : task
      )
    )
    const task = tasks.find(t => t.id === id)
    toast.success(`Task "${task.title}" marked as ${task.completed ? 'incomplete' : 'complete'}!`)
  }

  const handleTaskStatusChange = (id, newStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { 
              ...task, 
              status: newStatus,
              completed: newStatus === 'completed'
            }
          : task
      )
    )
    toast.success('Task status updated!')
  }

const tabs = [
    { id: 'progress', label: 'Progress', icon: 'TrendingUp' },
    { id: 'symptoms', label: 'Symptoms', icon: 'Heart' },
    { id: 'appointments', label: 'Appointments', icon: 'Calendar' },
    { id: 'reminders', label: 'Reminders', icon: 'Bell' },
    { id: 'tips', label: 'Daily Tips', icon: 'Lightbulb' },
    { id: 'dos-donts', label: 'DOs & DON\'Ts', icon: 'Shield' },
    { id: 'education', label: 'Education', icon: 'BookOpen' },
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' }
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

  // Daily Tips state and data
  const [favoriteTips, setFavoriteTips] = useState([])
  const [readTips, setReadTips] = useState([])
  const [selectedTipCategory, setSelectedTipCategory] = useState('all')

  // Daily Tips data organized by week ranges
  const dailyTipsData = {
    weeks1to12: [
      {
        id: 'tip-1-1',
        title: 'Start Taking Prenatal Vitamins',
        category: 'nutrition',
        content: 'Begin taking prenatal vitamins with folic acid to support your baby\'s neural tube development. Look for vitamins containing at least 400-800 mcg of folic acid.',
        importance: 'high',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: 'tip-1-2',
        title: 'Stay Hydrated',
        category: 'wellness',
        content: 'Drink 8-10 glasses of water daily to support increased blood volume and help prevent common pregnancy symptoms like constipation and fatigue.',
        importance: 'high',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: 'tip-1-3',
        title: 'Get Plenty of Rest',
        category: 'wellness',
        content: 'Aim for 7-9 hours of sleep per night. Your body is working hard to create new life, and adequate rest is crucial for both you and your baby.',
        importance: 'medium',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: 'tip-1-4',
        title: 'Avoid Alcohol and Smoking',
        category: 'wellness',
        content: 'Completely avoid alcohol, smoking, and recreational drugs. These substances can cause serious harm to your developing baby.',
        importance: 'high',
        weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: 'tip-1-5',
        title: 'Eat Small, Frequent Meals',
        category: 'nutrition',
        content: 'Combat morning sickness by eating smaller meals throughout the day. Keep crackers or dry toast nearby for nausea relief.',
        importance: 'medium',
        weeks: [6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: 'tip-1-6',
        title: 'Schedule Your First Prenatal Appointment',
        category: 'preparation',
        content: 'Book your first prenatal visit between 8-10 weeks. Prepare a list of questions and bring your medical history.',
        importance: 'high',
        weeks: [6, 7, 8, 9, 10]
      }
    ],
    weeks13to26: [
      {
        id: 'tip-2-1',
        title: 'Start Gentle Exercise',
        category: 'exercise',
        content: 'Begin or continue a safe exercise routine. Walking, swimming, and prenatal yoga are excellent choices for the second trimester.',
        importance: 'medium',
        weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
      },
      {
        id: 'tip-2-2',
        title: 'Focus on Protein and Iron',
        category: 'nutrition',
        content: 'Increase protein intake and include iron-rich foods like lean meats, beans, and leafy greens to support your baby\'s rapid growth.',
        importance: 'high',
        weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
      },
      {
        id: 'tip-2-3',
        title: 'Practice Good Posture',
        category: 'wellness',
        content: 'As your belly grows, maintain good posture to prevent back pain. Consider using a pregnancy support belt if needed.',
        importance: 'medium',
        weeks: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
      },
      {
        id: 'tip-2-4',
        title: 'Start Planning Your Nursery',
        category: 'preparation',
        content: 'Begin thinking about your baby\'s nursery setup. This is a great time to start shopping for essential items when you have more energy.',
        importance: 'low',
        weeks: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
      },
      {
        id: 'tip-2-5',
        title: 'Schedule Your Anatomy Scan',
        category: 'preparation',
        content: 'Book your detailed ultrasound between 18-22 weeks. This scan checks your baby\'s development and can reveal the gender if you want to know.',
        importance: 'high',
        weeks: [16, 17, 18, 19, 20, 21, 22]
      },
      {
        id: 'tip-2-6',
        title: 'Start Talking to Your Baby',
        category: 'wellness',
        content: 'Your baby can hear sounds from outside the womb. Start talking, singing, or playing music to begin bonding with your little one.',
        importance: 'low',
        weeks: [18, 19, 20, 21, 22, 23, 24, 25, 26]
      }
    ],
    weeks27to40: [
      {
        id: 'tip-3-1',
        title: 'Create Your Birth Plan',
        category: 'preparation',
        content: 'Start thinking about your birth preferences. Discuss pain management options and delivery preferences with your healthcare provider.',
        importance: 'high',
        weeks: [28, 29, 30, 31, 32, 33, 34, 35, 36]
      },
      {
        id: 'tip-3-2',
        title: 'Practice Breathing Exercises',
        category: 'wellness',
        content: 'Learn and practice breathing techniques that will help you during labor. Consider taking a childbirth preparation class.',
        importance: 'medium',
        weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
      },
      {
        id: 'tip-3-3',
        title: 'Pack Your Hospital Bag',
        category: 'preparation',
        content: 'Start packing your hospital bag by 36 weeks. Include comfortable clothes, toiletries, and items for your baby\'s first journey home.',
        importance: 'high',
        weeks: [32, 33, 34, 35, 36, 37, 38, 39, 40]
      },
      {
        id: 'tip-3-4',
        title: 'Monitor Baby\'s Movements',
        category: 'wellness',
        content: 'Pay attention to your baby\'s movement patterns. Contact your healthcare provider if you notice significant changes in activity.',
        importance: 'high',
        weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
      },
      {
        id: 'tip-3-5',
        title: 'Prepare for Breastfeeding',
        category: 'preparation',
        content: 'Learn about breastfeeding basics and consider taking a breastfeeding class. Invest in a good nursing bra and comfortable nursing clothes.',
        importance: 'medium',
        weeks: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
      },
      {
        id: 'tip-3-6',
        title: 'Get Adequate Calcium',
        category: 'nutrition',
        content: 'Ensure you\'re getting enough calcium for your baby\'s bone development. Include dairy products, leafy greens, and fortified foods in your diet.',
        importance: 'medium',
        weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
      },
      {
        id: 'tip-3-7',
        title: 'Learn About Labor Signs',
        category: 'preparation',
        content: 'Familiarize yourself with signs of labor including contractions, water breaking, and bloody show. Know when to contact your healthcare provider.',
        importance: 'high',
        weeks: [34, 35, 36, 37, 38, 39, 40]
      }
    ]
  }

  // Get tips for current week
  const getTipsForWeek = () => {
    let allTips = []
    
    if (currentWeek <= 12) {
      allTips = dailyTipsData.weeks1to12
    } else if (currentWeek <= 26) {
      allTips = dailyTipsData.weeks13to26
    } else {
      allTips = dailyTipsData.weeks27to40
    }
    
    return allTips.filter(tip => tip.weeks.includes(currentWeek))
  }

  // Filter tips by category
  const getFilteredTips = () => {
    const weekTips = getTipsForWeek()
    if (selectedTipCategory === 'all') {
      return weekTips
    }
    return weekTips.filter(tip => tip.category === selectedTipCategory)
  }

  // Handle tip interactions
  const handleTipFavorite = (tipId) => {
    setFavoriteTips(prev => {
      const isFavorite = prev.includes(tipId)
      if (isFavorite) {
        toast.info('Tip removed from favorites')
        return prev.filter(id => id !== tipId)
      } else {
        toast.success('Tip added to favorites!')
        return [...prev, tipId]
      }
    })
  }

  const handleTipRead = (tipId) => {
    setReadTips(prev => {
      if (!prev.includes(tipId)) {
        toast.success('Tip marked as read!')
        return [...prev, tipId]
      }
      return prev
    })
}

  // DOs and DON'Ts state
  const [dosAndDontsFilter, setDosAndDontsFilter] = useState('all')
  const [dosAndDontsSearch, setDosAndDontsSearch] = useState('')
  const [helpfulItems, setHelpfulItems] = useState([])
  const [completedItems, setCompletedItems] = useState([])

  // Handle DOs and DON'Ts interactions
  const handleItemHelpful = (itemId) => {
    setHelpfulItems(prev => {
      const isHelpful = prev.includes(itemId)
      if (isHelpful) {
        toast.info('Item removed from helpful list')
        return prev.filter(id => id !== itemId)
      } else {
        toast.success('Item marked as helpful!')
        return [...prev, itemId]
      }
    })
  }

  const handleItemComplete = (itemId) => {
    setCompletedItems(prev => {
      const isCompleted = prev.includes(itemId)
      if (isCompleted) {
        toast.info('Item marked as incomplete')
        return prev.filter(id => id !== itemId)
      } else {
        toast.success('Item marked as complete!')
        return [...prev, itemId]
      }
    })
  }

  // Get current trimester based on week
  const getCurrentTrimester = (week) => {
    if (week <= 12) return 1
    if (week <= 26) return 2
    return 3
  }

  // DOs and DON'Ts data organized by trimester
  const dosAndDontsData = {
    1: { // First Trimester (weeks 1-12)
      title: "First Trimester DOs and DON'Ts",
      subtitle: "Essential guidelines for early pregnancy",
      dos: [
        {
          id: 'do-1-1',
          category: 'nutrition',
          title: 'Take Prenatal Vitamins',
          description: 'Start taking prenatal vitamins with at least 400-800 mcg of folic acid daily',
          explanation: 'Folic acid helps prevent neural tube defects in your developing baby',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'do-1-2',
          category: 'nutrition',
          title: 'Eat Folate-Rich Foods',
          description: 'Include leafy greens, citrus fruits, beans, and fortified cereals in your diet',
          explanation: 'Natural folate works alongside folic acid supplements for optimal neural development',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'do-1-3',
          category: 'lifestyle',
          title: 'Get Adequate Sleep',
          description: 'Aim for 7-9 hours of quality sleep each night',
          explanation: 'Your body needs extra rest to support the rapid changes occurring during early pregnancy',
          importance: 'medium',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'do-1-4',
          category: 'medical',
          title: 'Schedule Your First Prenatal Visit',
          description: 'Book your first prenatal appointment between 8-10 weeks',
          explanation: 'Early prenatal care helps monitor your health and baby\'s development',
          importance: 'high',
          weeks: [6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'do-1-5',
          category: 'lifestyle',
          title: 'Stay Hydrated',
          description: 'Drink 8-10 glasses of water daily',
          explanation: 'Proper hydration supports increased blood volume and helps prevent constipation',
          importance: 'medium',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'do-1-6',
          category: 'activities',
          title: 'Continue Gentle Exercise',
          description: 'Maintain safe, moderate exercise like walking or swimming',
          explanation: 'Regular exercise helps with energy levels, mood, and prepares your body for pregnancy changes',
          importance: 'medium',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
      ],
      donts: [
        {
          id: 'dont-1-1',
          category: 'nutrition',
          title: 'Avoid Alcohol Completely',
          description: 'No amount of alcohol is safe during pregnancy',
          explanation: 'Alcohol can cause fetal alcohol spectrum disorders and developmental issues',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'dont-1-2',
          category: 'lifestyle',
          title: 'Don\'t Smoke or Use Tobacco',
          description: 'Quit smoking and avoid secondhand smoke',
          explanation: 'Smoking increases risk of miscarriage, premature birth, and low birth weight',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'dont-1-3',
          category: 'nutrition',
          title: 'Avoid Raw or Undercooked Foods',
          description: 'Don\'t eat raw fish, eggs, or undercooked meat',
          explanation: 'These foods may contain harmful bacteria that can cause foodborne illness',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'dont-1-4',
          category: 'nutrition',
          title: 'Limit Caffeine Intake',
          description: 'Keep caffeine under 200mg per day (about 1 cup of coffee)',
          explanation: 'High caffeine intake may increase risk of miscarriage and low birth weight',
          importance: 'medium',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'dont-1-5',
          category: 'activities',
          title: 'Avoid High-Risk Activities',
          description: 'Don\'t participate in contact sports or activities with fall risk',
          explanation: 'These activities increase risk of injury to you and your baby',
          importance: 'medium',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 'dont-1-6',
          category: 'medical',
          title: 'Don\'t Take Unnecessary Medications',
          description: 'Avoid over-the-counter medications without consulting your doctor',
          explanation: 'Some medications can be harmful during pregnancy, especially in the first trimester',
          importance: 'high',
          weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        }
      ]
    },
    2: { // Second Trimester (weeks 13-26)
      title: "Second Trimester DOs and DON'Ts",
      subtitle: "Guidance for the middle months of pregnancy",
      dos: [
        {
          id: 'do-2-1',
          category: 'nutrition',
          title: 'Increase Protein Intake',
          description: 'Aim for 75-100 grams of protein daily from various sources',
          explanation: 'Protein is crucial for your baby\'s rapid growth during this trimester',
          importance: 'high',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'do-2-2',
          category: 'nutrition',
          title: 'Focus on Iron-Rich Foods',
          description: 'Include lean meats, beans, spinach, and fortified cereals',
          explanation: 'Iron prevents anemia and supports increased blood volume',
          importance: 'high',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'do-2-3',
          category: 'activities',
          title: 'Practice Good Posture',
          description: 'Maintain proper posture as your belly grows',
          explanation: 'Good posture helps prevent back pain and supports your changing body',
          importance: 'medium',
          weeks: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'do-2-4',
          category: 'medical',
          title: 'Schedule Anatomy Scan',
          description: 'Book your detailed ultrasound between 18-22 weeks',
          explanation: 'This scan checks your baby\'s development and can detect any abnormalities',
          importance: 'high',
          weeks: [16, 17, 18, 19, 20, 21, 22]
        },
        {
          id: 'do-2-5',
          category: 'preparation',
          title: 'Start Planning Nursery',
          description: 'Begin thinking about your baby\'s room and essential items',
          explanation: 'This is a good time to plan while you have more energy',
          importance: 'low',
          weeks: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'do-2-6',
          category: 'lifestyle',
          title: 'Practice Relaxation Techniques',
          description: 'Learn deep breathing, meditation, or prenatal yoga',
          explanation: 'These techniques help manage stress and prepare for labor',
          importance: 'medium',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        }
      ],
      donts: [
        {
          id: 'dont-2-1',
          category: 'nutrition',
          title: 'Don\'t Eat High-Mercury Fish',
          description: 'Avoid shark, swordfish, king mackerel, and tilefish',
          explanation: 'High mercury levels can harm your baby\'s developing nervous system',
          importance: 'high',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'dont-2-2',
          category: 'activities',
          title: 'Avoid Lying Flat on Your Back',
          description: 'Don\'t lie flat on your back for extended periods after 20 weeks',
          explanation: 'This position can reduce blood flow to you and your baby',
          importance: 'medium',
          weeks: [20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'dont-2-3',
          category: 'activities',
          title: 'Don\'t Overexert Yourself',
          description: 'Avoid activities that leave you breathless or overly tired',
          explanation: 'Your body is working harder, so listen to its signals',
          importance: 'medium',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'dont-2-4',
          category: 'lifestyle',
          title: 'Don\'t Use Hot Tubs or Saunas',
          description: 'Avoid activities that raise your core body temperature',
          explanation: 'Overheating can be harmful to your baby\'s development',
          importance: 'medium',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'dont-2-5',
          category: 'nutrition',
          title: 'Don\'t Skip Meals',
          description: 'Avoid going long periods without eating',
          explanation: 'Regular meals help maintain stable blood sugar and energy levels',
          importance: 'medium',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        },
        {
          id: 'dont-2-6',
          category: 'lifestyle',
          title: 'Don\'t Ignore Warning Signs',
          description: 'Don\'t dismiss severe headaches, vision changes, or persistent pain',
          explanation: 'These could be signs of serious pregnancy complications',
          importance: 'high',
          weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
        }
      ]
    },
    3: { // Third Trimester (weeks 27-40)
      title: "Third Trimester DOs and DON'Ts",
      subtitle: "Final preparations for birth and baby",
      dos: [
        {
          id: 'do-3-1',
          category: 'preparation',
          title: 'Create Your Birth Plan',
          description: 'Discuss birth preferences with your healthcare provider',
          explanation: 'Having a plan helps you feel prepared while staying flexible for changes',
          importance: 'high',
          weeks: [28, 29, 30, 31, 32, 33, 34, 35, 36]
        },
        {
          id: 'do-3-2',
          category: 'preparation',
          title: 'Pack Your Hospital Bag',
          description: 'Have your hospital bag ready by 36 weeks',
          explanation: 'Being prepared reduces stress when labor begins',
          importance: 'high',
          weeks: [32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'do-3-3',
          category: 'nutrition',
          title: 'Increase Calcium Intake',
          description: 'Ensure adequate calcium for your baby\'s bone development',
          explanation: 'Your baby\'s bones are hardening and need lots of calcium',
          importance: 'high',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'do-3-4',
          category: 'medical',
          title: 'Monitor Baby\'s Movements',
          description: 'Pay attention to your baby\'s daily movement patterns',
          explanation: 'Changes in movement patterns can indicate potential problems',
          importance: 'high',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'do-3-5',
          category: 'preparation',
          title: 'Learn About Breastfeeding',
          description: 'Take a breastfeeding class or read about breastfeeding basics',
          explanation: 'Preparation helps with successful breastfeeding initiation',
          importance: 'medium',
          weeks: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'do-3-6',
          category: 'lifestyle',
          title: 'Practice Breathing Exercises',
          description: 'Learn and practice breathing techniques for labor',
          explanation: 'Breathing techniques help manage pain and stress during labor',
          importance: 'medium',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        }
      ],
      donts: [
        {
          id: 'dont-3-1',
          category: 'activities',
          title: 'Don\'t Travel Far from Home',
          description: 'Avoid long-distance travel, especially after 36 weeks',
          explanation: 'You want to be near your healthcare provider when labor begins',
          importance: 'high',
          weeks: [34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'dont-3-2',
          category: 'lifestyle',
          title: 'Don\'t Ignore Signs of Labor',
          description: 'Don\'t dismiss regular contractions, water breaking, or bloody show',
          explanation: 'Recognizing labor signs ensures you get to the hospital in time',
          importance: 'high',
          weeks: [34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'dont-3-3',
          category: 'activities',
          title: 'Don\'t Lift Heavy Objects',
          description: 'Avoid lifting anything over 20-25 pounds',
          explanation: 'Heavy lifting can strain your back and potentially trigger early labor',
          importance: 'medium',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'dont-3-4',
          category: 'lifestyle',
          title: 'Don\'t Sleep on Your Back',
          description: 'Sleep on your side, preferably left side',
          explanation: 'Back sleeping can reduce blood flow to your baby',
          importance: 'medium',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'dont-3-5',
          category: 'preparation',
          title: 'Don\'t Wait to Install Car Seat',
          description: 'Don\'t leave car seat installation until the last minute',
          explanation: 'You\'ll need a properly installed car seat before leaving the hospital',
          importance: 'high',
          weeks: [32, 33, 34, 35, 36, 37, 38, 39, 40]
        },
        {
          id: 'dont-3-6',
          category: 'medical',
          title: 'Don\'t Skip Prenatal Appointments',
          description: 'Don\'t miss your increased frequency of prenatal visits',
          explanation: 'Regular monitoring is crucial as you approach your due date',
          importance: 'high',
          weeks: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
        }
      ]
    }
  }

  // Get DOs and DON'Ts for current week
  const getDosAndDontsForWeek = () => {
    const currentTrimester = getCurrentTrimester(currentWeek)
    const trimesterData = dosAndDontsData[currentTrimester]
    
    if (!trimesterData) return { dos: [], donts: [] }

    const dos = trimesterData.dos.filter(item => item.weeks.includes(currentWeek))
    const donts = trimesterData.donts.filter(item => item.weeks.includes(currentWeek))
    
    return { dos, donts }
  }

  // Filter DOs and DON'Ts by category and search
  const getFilteredDosAndDonts = () => {
    const { dos, donts } = getDosAndDontsForWeek()
    const allItems = [...dos, ...donts]
    
    return allItems.filter(item => {
      const matchesCategory = dosAndDontsFilter === 'all' || item.category === dosAndDontsFilter
      const matchesSearch = dosAndDontsSearch === '' || 
        item.title.toLowerCase().includes(dosAndDontsSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(dosAndDontsSearch.toLowerCase()) ||
        item.explanation.toLowerCase().includes(dosAndDontsSearch.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
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

  // Reminder handlers
  const handleReminderAdd = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) {
return
    }

    const reminder = {
      id: Date.now(),
      ...newReminder,
      ...newReminder,
      date: new Date(newReminder.date),
      completed: false
    }

    setReminders([...reminders, reminder])
    setNewReminder({
      title: '',
      description: '',
      type: 'appointment',
      date: '',
      time: '',
      recurring: 'none',
      priority: 'medium'
    })
    setShowReminderForm(false)
    toast.success('Reminder created successfully!')
  }

  const handleReminderEdit = (reminder) => {
    setEditingReminder(reminder.id)
    setNewReminder({
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      date: format(reminder.date, 'yyyy-MM-dd'),
      time: reminder.time,
      recurring: reminder.recurring,
      priority: reminder.priority
    })
    setShowReminderForm(true)
  }

  const handleReminderUpdate = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) {
      toast.error('Please fill in all required fields')
      return
    }

    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === editingReminder
          ? {
              ...reminder,
              ...newReminder,
              date: new Date(newReminder.date)
            }
          : reminder
      )
    )

    setNewReminder({
      title: '',
      description: '',
      type: 'appointment',
      date: '',
      time: '',
      recurring: 'none',
      priority: 'medium'
    })
    setShowReminderForm(false)
    setEditingReminder(null)
    toast.success('Reminder updated successfully!')
  }

  const handleReminderDelete = (id) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      setReminders(prevReminders => prevReminders.filter(reminder => reminder.id !== id))
      toast.success('Reminder deleted successfully!')
    }
  }

  const handleReminderComplete = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    )
    const reminder = reminders.find(r => r.id === id)
    toast.success(`Reminder "${reminder.title}" marked as ${reminder.completed ? 'incomplete' : 'complete'}!`)
  }

  const getFilteredReminders = () => {
    let filtered = reminders

    if (reminderFilter !== 'all') {
      if (reminderFilter === 'completed') {
        filtered = filtered.filter(reminder => reminder.completed)
      } else if (reminderFilter === 'pending') {
        filtered = filtered.filter(reminder => !reminder.completed)
      } else if (reminderFilter === 'today') {
        const today = new Date()
        filtered = filtered.filter(reminder => 
          format(reminder.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        )
      } else if (reminderFilter === 'upcoming') {
        const today = new Date()
        filtered = filtered.filter(reminder => 
          reminder.date >= today && !reminder.completed
        )
      } else {
        filtered = filtered.filter(reminder => reminder.type === reminderFilter)
      }
    }

    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getReminderTypeIcon = (type) => {
    const reminderType = reminderTypes.find(t => t.value === type)
    return reminderType ? reminderType.icon : 'Clock'
  }

  const getPriorityColor = (priority) => {
    const priorityOption = priorityOptions.find(p => p.value === priority)
    return priorityOption ? priorityOption.color : 'gray'
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            className="pregnancy-card"
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
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            defaultValue={profileData.personalInfo.lastName}
                            className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                        <input
                          type="email"
                          defaultValue={profileData.personalInfo.email}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          defaultValue={profileData.personalInfo.phone}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleProfileSave('personalInfo', {})}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
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
                      <div className="pt-2 border-t border-surface-200">
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
                      <ApperIcon name="Heart" className="text-primary mr-2" size={20} />
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
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Last Menstrual Period</label>
                        <input
                          type="date"
                          defaultValue={profileData.pregnancyInfo.lastPeriod}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Pregnancy Type</label>
                        <select
                          defaultValue={profileData.pregnancyInfo.pregnancyType}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="singleton">Single Baby</option>
                          <option value="twins">Twins</option>
                          <option value="triplets">Triplets</option>
                        </select>
                      </div>
                      <div className="flex space-x-3">
                        <motion.button
                          onClick={() => handleProfileSave('pregnancyInfo', {})}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
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
                      <ApperIcon name="Activity" className="text-primary mr-2" size={20} />
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
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Hospital/Clinic</label>
                        <input
                          type="text"
                          defaultValue={profileData.medicalInfo.hospital}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Blood Type</label>
                        <select
                          defaultValue={profileData.medicalInfo.bloodType}
                          className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
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
                      <div className="pt-2 border-t border-surface-200">
                        <p className="text-sm font-medium text-surface-700 mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {profileData.medicalInfo.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-surface-200">
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
                    <div className="pt-4 border-t border-surface-200">
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
                    <div className="pt-4 border-t border-surface-200">
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
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{currentWeek}</span>
                    </div>
                    <p className="text-sm text-surface-600">Weeks Completed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{Math.max(0, differenceInDays(new Date(profileData.pregnancyInfo.dueDate), new Date()))}</span>
                    </div>
                    <p className="text-sm text-surface-600">Days Remaining</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{currentWeek <= 12 ? '1' : currentWeek <= 26 ? '2' : '3'}</span>
                    </div>
                    <p className="text-sm text-surface-600">Current Trimester</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-surface-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-surface-700">Pregnancy Progress</span>
                    <span className="text-sm text-surface-600">{Math.round((currentWeek / 40) * 100)}%</span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
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
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success('Profile data exported successfully!')}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Download" size={16} />
                    <span>Export Data</span>
                  </div>
                </motion.button>
                <motion.button
                  className="bg-secondary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary-dark transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.info('Backup created successfully!')}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Save" size={16} />
                    <span>Backup Profile</span>
                  </div>
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
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </div>
</motion.button>
              </div>
            </div>
          </motion.div>
        )}

{/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <motion.div
            key="reminders"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Bell" className="text-white" size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Pregnancy Reminders</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Reminder Form */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-surface-700">
                      {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
                    </h4>
                    <motion.button
                      onClick={() => {
                        setShowReminderForm(!showReminderForm)
                        if (showReminderForm) {
                          setEditingReminder(null)
                          setNewReminder({
                            title: '',
                            description: '',
                            type: 'appointment',
                            date: '',
                            time: '',
                            recurring: 'none',
                            priority: 'medium'
                          })
                        }
                      }}
                      className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={showReminderForm ? "X" : "Plus"} size={16} />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showReminderForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={newReminder.title}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Doctor Appointment, Take Vitamins"
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Type
                          </label>
                          <select
                            value={newReminder.type}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          >
                            {reminderTypes.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Date *
                            </label>
                            <input
                              type="date"
                              value={newReminder.date}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
                              min={format(new Date(), "yyyy-MM-dd")}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Time *
                            </label>
                            <input
                              type="time"
                              value={newReminder.time}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Recurring
                            </label>
                            <select
                              value={newReminder.recurring}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, recurring: e.target.value }))}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            >
                              {recurringOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Priority
                            </label>
                            <select
                              value={newReminder.priority}
                              onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            >
                              {priorityOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={newReminder.description}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Additional details about this reminder..."
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            onClick={editingReminder ? handleReminderUpdate : handleReminderAdd}
                            className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors duration-200 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <ApperIcon name={editingReminder ? "Save" : "Plus"} size={16} />
                              <span>{editingReminder ? 'Update' : 'Add'} Reminder</span>
                            </div>
                          </motion.button>

                          {editingReminder && (
                            <motion.button
                              onClick={() => {
                                setEditingReminder(null)
                                setShowReminderForm(false)
                                setNewReminder({
                                  title: '',
                                  description: '',
                                  type: 'appointment',
                                  date: '',
                                  time: '',
                                  recurring: 'none',
                                  priority: 'medium'
                                })
                              }}
                              className="px-4 py-3 text-surface-600 border border-surface-300 rounded-xl hover:bg-surface-50 transition-colors text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Cancel
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reminders List */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'today', label: 'Today' },
                      { value: 'upcoming', label: 'Upcoming' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'appointment', label: 'Appointments' },
                      { value: 'medication', label: 'Medications' },
                      { value: 'activity', label: 'Activities' }
                    ].map((filter) => (
                      <motion.button
                        key={filter.value}
                        onClick={() => setReminderFilter(filter.value)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          reminderFilter === filter.value
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {filter.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Reminders List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredReminders().length === 0 ? (
                      <div className="text-center py-8 text-surface-500">
                        <ApperIcon name="Bell" size={48} className="mx-auto mb-3 text-surface-300" />
                        <p className="font-medium mb-1">No reminders found</p>
                        <p className="text-sm">Try adjusting your filter or add a new reminder</p>
                      </div>
                    ) : (
                      getFilteredReminders().map((reminder) => (
                        <motion.div
                          key={reminder.id}
                          className={`bg-surface-50 rounded-xl p-4 border-l-4 hover:shadow-md transition-all duration-200 ${
                            reminder.completed 
                              ? 'border-green-400 opacity-75' 
                              : getPriorityColor(reminder.priority) === 'red'
                              ? 'border-red-400'
                              : getPriorityColor(reminder.priority) === 'yellow'
                              ? 'border-yellow-400'
                              : 'border-green-400'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  reminder.completed ? 'bg-green-100' : 'bg-primary/10'
                                }`}>
                                  <ApperIcon 
                                    name={getReminderTypeIcon(reminder.type)} 
                                    size={16} 
                                    className={reminder.completed ? 'text-green-600' : 'text-primary'} 
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className={`font-semibold text-surface-800 ${
                                    reminder.completed ? 'line-through opacity-70' : ''
                                  }`}>
                                    {reminder.title}
                                  </h5>
                                  <div className="flex items-center space-x-3 text-xs text-surface-500">
                                    <span className="flex items-center space-x-1">
                                      <ApperIcon name="Calendar" size={12} />
                                      <span>{format(reminder.date, 'MMM dd, yyyy')}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <ApperIcon name="Clock" size={12} />
                                      <span>{reminder.time}</span>
                                    </span>
                                    {reminder.recurring !== 'none' && (
                                      <span className="flex items-center space-x-1">
                                        <ApperIcon name="RotateCcw" size={12} />
                                        <span className="capitalize">{reminder.recurring}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    getPriorityColor(reminder.priority) === 'red' ? 'bg-red-100 text-red-600' :
                                    getPriorityColor(reminder.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {reminder.priority}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                    reminderTypes.find(t => t.value === reminder.type)?.value === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                    reminderTypes.find(t => t.value === reminder.type)?.value === 'medication' ? 'bg-purple-100 text-purple-600' :
                                    reminderTypes.find(t => t.value === reminder.type)?.value === 'scan' ? 'bg-indigo-100 text-indigo-600' :
                                    'bg-orange-100 text-orange-600'
                                  }`}>
                                    {reminderTypes.find(t => t.value === reminder.type)?.label}
                                  </span>
                                </div>
                              </div>
                              {reminder.description && (
                                <p className={`text-sm text-surface-600 mb-3 ${
                                  reminder.completed ? 'opacity-70' : ''
                                }`}>
                                  {reminder.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() => handleReminderComplete(reminder.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  reminder.completed
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name={reminder.completed ? "CheckCircle" : "Circle"} size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleReminderEdit(reminder)}
                                className="p-2 rounded-lg bg-surface-200 text-surface-600 hover:bg-surface-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name="Edit" size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleReminderDelete(reminder.id)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </motion.button>
                            </div>

                            <div className="text-xs text-surface-500">
                              {differenceInDays(reminder.date, new Date()) === 0 
                                ? 'Today'
                                : differenceInDays(reminder.date, new Date()) === 1
                                ? 'Tomorrow'
                                : differenceInDays(reminder.date, new Date()) > 0
                                ? `In ${differenceInDays(reminder.date, new Date())} days`
                                : `${Math.abs(differenceInDays(reminder.date, new Date()))} days ago`
                              }
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Quick Stats */}
                  <motion.div 
                    className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                      <div className="text-lg font-bold text-blue-600">
                        {reminders.filter(r => !r.completed).length}
                      </div>
                      <div className="text-xs text-blue-600">Pending</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-100">
                      <div className="text-lg font-bold text-green-600">
                        {reminders.filter(r => r.completed).length}
                      </div>
                      <div className="text-xs text-green-600">Completed</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center border border-yellow-100">
<div className="text-base sm:text-lg font-bold text-yellow-600">
                        {reminders.filter(r => format(r.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && !r.completed).length}
                      </div>
                      <div className="text-xs text-yellow-600">Today</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center border border-purple-100">
                      <div className="text-base sm:text-lg font-bold text-purple-600">
                        {reminders.filter(r => r.priority === 'high' && !r.completed).length}
                      </div>
                      <div className="text-xs text-purple-600">High Priority</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
</motion.div>
        )}

        {/* Daily Tips Tab */}
        {activeTab === 'tips' && (
          <motion.div
            key="tips"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Lightbulb" className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Daily Tips for Week {currentWeek}</h3>
                <p className="text-sm text-surface-600">
                  Helpful tips to support your pregnancy journey
                </p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { value: 'all', label: 'All Tips', icon: 'Lightbulb' },
                { value: 'wellness', label: 'Wellness', icon: 'Heart' },
                { value: 'nutrition', label: 'Nutrition', icon: 'Apple' },
                { value: 'preparation', label: 'Preparation', icon: 'Package' },
                { value: 'exercise', label: 'Exercise', icon: 'Activity' }
              ].map((category) => (
                <motion.button
                  key={category.value}
                  onClick={() => setSelectedTipCategory(category.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedTipCategory === category.value
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={category.icon} size={16} />
                  <span className="text-sm">{category.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {getFilteredTips().length === 0 ? (
                <div className="lg:col-span-2 text-center py-12">
                  <ApperIcon name="Lightbulb" size={48} className="mx-auto mb-4 text-surface-300" />
                  <h4 className="text-lg font-medium text-surface-600 mb-2">No tips for this week</h4>
                  <p className="text-surface-500 text-sm">
                    Check back next week for new helpful tips!
                  </p>
                </div>
              ) : (
                getFilteredTips().map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    className="bg-white rounded-xl border border-surface-200 overflow-hidden hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tip.category === 'wellness' ? 'bg-pink-100 text-pink-600' :
                              tip.category === 'nutrition' ? 'bg-green-100 text-green-600' :
                              tip.category === 'preparation' ? 'bg-blue-100 text-blue-600' :
                              tip.category === 'exercise' ? 'bg-purple-100 text-purple-600' :
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {tip.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tip.importance === 'high' ? 'bg-red-100 text-red-600' :
                              tip.importance === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {tip.importance} priority
                            </span>
                          </div>
                          <h5 className="text-lg font-semibold text-surface-800 mb-2">
                            {tip.title}
                          </h5>
                          <p className="text-surface-600 text-sm leading-relaxed">
                            {tip.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleTipFavorite(tip.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              favoriteTips.includes(tip.id)
                                ? 'bg-pink-100 text-pink-600'
                                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ApperIcon name={favoriteTips.includes(tip.id) ? "Heart" : "Heart"} size={16} />
                          </motion.button>

                          <motion.button
                            onClick={() => handleTipRead(tip.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              readTips.includes(tip.id)
                                ? 'bg-green-100 text-green-600'
                                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <ApperIcon name={readTips.includes(tip.id) ? "CheckCircle" : "Circle"} size={16} />
                          </motion.button>
                        </div>

                        <div className="text-xs text-surface-500">
                          Week {currentWeek}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Tips Progress Summary */}
            <motion.div 
              className="mt-8 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 border border-orange-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-surface-800">Your Tips Progress</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {getTipsForWeek().length}
                  </div>
                  <div className="text-sm text-surface-600">Tips This Week</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-1">
                    {favoriteTips.length}
                  </div>
                  <div className="text-sm text-surface-600">Favorite Tips</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {readTips.filter(tipId => getTipsForWeek().some(tip => tip.id === tipId)).length}
                  </div>
                  <div className="text-sm text-surface-600">Tips Read</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-700">Weekly Progress</span>
                  <span className="text-sm text-surface-600">
                    {Math.round((readTips.filter(tipId => getTipsForWeek().some(tip => tip.id === tipId)).length / Math.max(getTipsForWeek().length, 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-400 to-pink-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(readTips.filter(tipId => getTipsForWeek().some(tip => tip.id === tipId)).length / Math.max(getTipsForWeek().length, 1)) * 100}%` 
                    }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Helpful Information */}
            <motion.div 
              className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Info" className="text-blue-500" size={16} />
                <h5 className="text-sm font-semibold text-blue-800">Remember</h5>
              </div>
              <p className="text-blue-700 text-xs leading-relaxed">
                These tips are general recommendations and should not replace professional medical advice. 
                Always consult with your healthcare provider about any concerns or questions regarding your pregnancy.
              </p>
            </motion.div>
</motion.div>
        )}

        {/* DOs and DON'Ts Tab */}
        {activeTab === 'dos-donts' && (
          <motion.div
            key="dos-donts"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Shield" className="text-white" size={16} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-surface-800">DOs and DON'Ts for Week {currentWeek}</h3>
                <p className="text-sm text-surface-600">
                  {dosAndDontsData[getCurrentTrimester(currentWeek)]?.title}
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
                  placeholder="Search DOs and DON'Ts..."
                  value={dosAndDontsSearch}
                  onChange={(e) => setDosAndDontsSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <select
                value={dosAndDontsFilter}
                onChange={(e) => setDosAndDontsFilter(e.target.value)}
                className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">All Categories</option>
                <option value="nutrition">Nutrition</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="activities">Activities</option>
                <option value="medical">Medical Care</option>
                <option value="preparation">Preparation</option>
              </select>
            </div>

            {/* Trimester Overview */}
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 mb-6 border border-green-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="Info" className="text-white" size={12} />
                </div>
                <h4 className="text-lg font-semibold text-surface-800">
                  {dosAndDontsData[getCurrentTrimester(currentWeek)]?.title}
                </h4>
              </div>
              <p className="text-surface-600 text-sm">
                {dosAndDontsData[getCurrentTrimester(currentWeek)]?.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-green-600 border border-green-200">
                  Week {currentWeek}
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-blue-600 border border-blue-200">
                  {getFilteredDosAndDonts().length} guidelines
                </span>
              </div>
            </motion.div>

            {/* DOs and DON'Ts Grid */}
            <div className="space-y-6">
              {getFilteredDosAndDonts().length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Shield" size={48} className="mx-auto mb-4 text-surface-300" />
                  <h4 className="text-lg font-medium text-surface-600 mb-2">No guidelines found</h4>
                  <p className="text-surface-500 text-sm">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* DOs Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="Check" className="text-white" size={14} />
                      </div>
                      <h4 className="text-lg font-semibold text-green-700">DOs</h4>
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                        {getFilteredDosAndDonts().filter(item => dosAndDontsData[getCurrentTrimester(currentWeek)]?.dos.includes(item)).length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {getFilteredDosAndDonts()
                        .filter(item => dosAndDontsData[getCurrentTrimester(currentWeek)]?.dos.includes(item))
                        .map((item, index) => (
                          <motion.div
                            key={item.id}
                            className="bg-green-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.category === 'nutrition' ? 'bg-green-100 text-green-600' :
                                    item.category === 'lifestyle' ? 'bg-blue-100 text-blue-600' :
                                    item.category === 'activities' ? 'bg-purple-100 text-purple-600' :
                                    item.category === 'medical' ? 'bg-red-100 text-red-600' :
                                    'bg-orange-100 text-orange-600'
                                  }`}>
                                    {item.category}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.importance === 'high' ? 'bg-red-100 text-red-600' :
                                    item.importance === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {item.importance} priority
                                  </span>
                                </div>
                                <h5 className="font-semibold text-green-800 mb-2">{item.title}</h5>
                                <p className="text-green-700 text-sm mb-2">{item.description}</p>
                                <p className="text-green-600 text-xs italic">{item.explanation}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-green-200">
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => handleItemHelpful(item.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    helpfulItems.includes(item.id)
                                      ? 'bg-green-200 text-green-700'
                                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name="ThumbsUp" size={16} />
                                </motion.button>

                                <motion.button
                                  onClick={() => handleItemComplete(item.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    completedItems.includes(item.id)
                                      ? 'bg-green-200 text-green-700'
                                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name={completedItems.includes(item.id) ? "CheckCircle" : "Circle"} size={16} />
                                </motion.button>
                              </div>

                              <div className="text-xs text-green-600">
                                Week {currentWeek}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* DON'Ts Section */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <ApperIcon name="X" className="text-white" size={14} />
                      </div>
                      <h4 className="text-lg font-semibold text-red-700">DON'Ts</h4>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                        {getFilteredDosAndDonts().filter(item => dosAndDontsData[getCurrentTrimester(currentWeek)]?.donts.includes(item)).length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {getFilteredDosAndDonts()
                        .filter(item => dosAndDontsData[getCurrentTrimester(currentWeek)]?.donts.includes(item))
                        .map((item, index) => (
                          <motion.div
                            key={item.id}
                            className="bg-red-50 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.category === 'nutrition' ? 'bg-red-100 text-red-600' :
                                    item.category === 'lifestyle' ? 'bg-blue-100 text-blue-600' :
                                    item.category === 'activities' ? 'bg-purple-100 text-purple-600' :
                                    item.category === 'medical' ? 'bg-red-100 text-red-600' :
                                    'bg-orange-100 text-orange-600'
                                  }`}>
                                    {item.category}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.importance === 'high' ? 'bg-red-100 text-red-600' :
                                    item.importance === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {item.importance} priority
                                  </span>
                                </div>
                                <h5 className="font-semibold text-red-800 mb-2">{item.title}</h5>
                                <p className="text-red-700 text-sm mb-2">{item.description}</p>
                                <p className="text-red-600 text-xs italic">{item.explanation}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-red-200">
                              <div className="flex items-center space-x-2">
                                <motion.button
                                  onClick={() => handleItemHelpful(item.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    helpfulItems.includes(item.id)
                                      ? 'bg-red-200 text-red-700'
                                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name="ThumbsUp" size={16} />
                                </motion.button>

                                <motion.button
                                  onClick={() => handleItemComplete(item.id)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    completedItems.includes(item.id)
                                      ? 'bg-red-200 text-red-700'
                                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name={completedItems.includes(item.id) ? "CheckCircle" : "Circle"} size={16} />
                                </motion.button>
                              </div>

                              <div className="text-xs text-red-600">
                                Week {currentWeek}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Summary */}
            <motion.div 
              className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-semibold text-surface-800">Your Guidelines Progress</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {getDosAndDontsForWeek().dos.length}
                  </div>
                  <div className="text-sm text-surface-600">DOs This Week</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {getDosAndDontsForWeek().donts.length}
                  </div>
                  <div className="text-sm text-surface-600">DON'Ts This Week</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {helpfulItems.length}
                  </div>
                  <div className="text-sm text-surface-600">Marked Helpful</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {completedItems.filter(itemId => 
                      getFilteredDosAndDonts().some(item => item.id === itemId)
                    ).length}
                  </div>
                  <div className="text-sm text-surface-600">Completed</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-surface-700">Weekly Completion</span>
                  <span className="text-sm text-surface-600">
                    {Math.round((completedItems.filter(itemId => 
                      getFilteredDosAndDonts().some(item => item.id === itemId)
                    ).length / Math.max(getFilteredDosAndDonts().length, 1)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(completedItems.filter(itemId => 
                        getFilteredDosAndDonts().some(item => item.id === itemId)
                      ).length / Math.max(getFilteredDosAndDonts().length, 1)) * 100}%` 
                    }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Important Notice */}
            <motion.div 
              className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="AlertTriangle" className="text-yellow-600" size={16} />
                <h5 className="text-sm font-semibold text-yellow-800">Important Notice</h5>
              </div>
              <p className="text-yellow-700 text-xs leading-relaxed">
                These guidelines are general recommendations and should not replace professional medical advice. 
                Every pregnancy is unique. Always consult with your healthcare provider about any concerns or questions 
                regarding your specific situation. When in doubt, contact your doctor immediately.
              </p>
            </motion.div>
          </motion.div>
)}

        {/* Task Manager Tab */}
        {activeTab === 'tasks' && (
          <motion.div
            key="tasks"
            className="pregnancy-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="text-white" size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-surface-800">Pregnancy Task Manager</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Task Form Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-surface-700">
                      {editingTask ? 'Edit Task' : 'Add New Task'}
                    </h4>
                    <motion.button
                      onClick={() => {
                        setShowTaskForm(!showTaskForm)
                        if (showTaskForm) {
                          setEditingTask(null)
                          setNewTask({
                            title: '',
                            description: '',
                            category: 'general',
                            priority: 'medium',
                            dueDate: '',
                            status: 'pending'
                          })
                        }
                      }}
                      className="p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={showTaskForm ? "X" : "Plus"} size={16} />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {showTaskForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Task Title *
                          </label>
                          <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Schedule doctor appointment"
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={newTask.description}
                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Additional details about this task..."
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Category
                          </label>
                          <select
                            value={newTask.category}
                            onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          >
                            {taskCategories.map((category) => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Priority
                            </label>
                            <select
                              value={newTask.priority}
                              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            >
                              {taskPriorities.map((priority) => (
                                <option key={priority.value} value={priority.value}>{priority.label}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                              Status
                            </label>
                            <select
                              value={newTask.status}
                              onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                              className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            >
                              {taskStatuses.map((status) => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Due Date *
                          </label>
                          <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                            min={format(new Date(), "yyyy-MM-dd")}
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            onClick={editingTask ? handleTaskUpdate : handleTaskAdd}
                            className="flex-1 bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors duration-200 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <ApperIcon name={editingTask ? "Save" : "Plus"} size={16} />
                              <span>{editingTask ? 'Update' : 'Add'} Task</span>
                            </div>
                          </motion.button>

                          {editingTask && (
                            <motion.button
                              onClick={() => {
                                setEditingTask(null)
                                setShowTaskForm(false)
                                setNewTask({
                                  title: '',
                                  description: '',
                                  category: 'general',
                                  priority: 'medium',
                                  dueDate: '',
                                  status: 'pending'
                                })
                              }}
                              className="px-4 py-3 text-surface-600 border border-surface-300 rounded-xl hover:bg-surface-50 transition-colors text-sm"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Cancel
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Task Statistics */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h5 className="text-sm font-semibold text-surface-700 mb-3">Task Overview</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-surface-600">Total Tasks:</span>
                        <span className="font-medium text-indigo-600">{getTaskStats().total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-surface-600">Completed:</span>
                        <span className="font-medium text-green-600">{getTaskStats().completed}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-surface-600">Pending:</span>
                        <span className="font-medium text-yellow-600">{getTaskStats().pending}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-surface-600">Overdue:</span>
                        <span className="font-medium text-red-600">{getTaskStats().overdue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-surface-600">Due Today:</span>
                        <span className="font-medium text-orange-600">{getTaskStats().today}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-indigo-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-surface-700">Completion Rate</span>
                        <span className="text-xs text-surface-600">
                          {getTaskStats().total > 0 ? Math.round((getTaskStats().completed / getTaskStats().total) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-indigo-200 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${getTaskStats().total > 0 ? (getTaskStats().completed / getTaskStats().total) * 100 : 0}%` 
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <ApperIcon 
                        name="Search" 
                        size={18} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                      />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <select
                      value={taskFilter}
                      onChange={(e) => setTaskFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="overdue">Overdue</option>
                      <option value="today">Due Today</option>
                      <option value="upcoming">Upcoming</option>
                      {taskCategories.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                      ))}
                    </select>

                    <select
                      value={taskSort}
                      onChange={(e) => setTaskSort(e.target.value)}
                      className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="dueDate">Sort by Due Date</option>
                      <option value="priority">Sort by Priority</option>
                      <option value="title">Sort by Title</option>
                      <option value="created">Sort by Created</option>
                    </select>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All', count: getTaskStats().total },
                      { value: 'pending', label: 'Pending', count: getTaskStats().pending },
                      { value: 'completed', label: 'Completed', count: getTaskStats().completed },
                      { value: 'overdue', label: 'Overdue', count: getTaskStats().overdue },
                      { value: 'today', label: 'Today', count: getTaskStats().today }
                    ].map((filter) => (
                      <motion.button
                        key={filter.value}
                        onClick={() => setTaskFilter(filter.value)}
                        className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                          taskFilter === filter.value
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{filter.label}</span>
                        {filter.count > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                            taskFilter === filter.value
                              ? 'bg-white/20'
                              : 'bg-surface-200'
                          }`}>
                            {filter.count}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredTasks().length === 0 ? (
                      <div className="text-center py-8 text-surface-500">
                        <ApperIcon name="CheckSquare" size={48} className="mx-auto mb-3 text-surface-300" />
                        <p className="font-medium mb-1">No tasks found</p>
                        <p className="text-sm">Try adjusting your filter or add a new task</p>
                      </div>
                    ) : (
                      getFilteredTasks().map((task) => (
                        <motion.div
                          key={task.id}
                          className={`bg-surface-50 rounded-xl p-4 border-l-4 hover:shadow-md transition-all duration-200 ${
                            task.completed 
                              ? 'border-green-400 opacity-75' 
                              : isTaskOverdue(task)
                              ? 'border-red-400'
                              : getTaskPriorityColor(task.priority) === 'red'
                              ? 'border-red-400'
                              : getTaskPriorityColor(task.priority) === 'yellow'
                              ? 'border-yellow-400'
                              : 'border-green-400'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  task.completed ? 'bg-green-100' : 'bg-indigo-100'
                                }`}>
                                  <ApperIcon 
                                    name={getTaskCategoryIcon(task.category)} 
                                    size={16} 
                                    className={task.completed ? 'text-green-600' : 'text-indigo-600'} 
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className={`font-semibold text-surface-800 ${
                                    task.completed ? 'line-through opacity-70' : ''
                                  }`}>
                                    {task.title}
                                  </h5>
                                  <div className="flex items-center space-x-3 text-xs text-surface-500">
                                    <span className="flex items-center space-x-1">
                                      <ApperIcon name="Calendar" size={12} />
                                      <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                      getTaskCategoryColor(task.category) === 'red' ? 'bg-red-100 text-red-600' :
                                      getTaskCategoryColor(task.category) === 'blue' ? 'bg-blue-100 text-blue-600' :
                                      getTaskCategoryColor(task.category) === 'green' ? 'bg-green-100 text-green-600' :
                                      getTaskCategoryColor(task.category) === 'purple' ? 'bg-purple-100 text-purple-600' :
                                      getTaskCategoryColor(task.category) === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                      getTaskCategoryColor(task.category) === 'orange' ? 'bg-orange-100 text-orange-600' :
                                      getTaskCategoryColor(task.category) === 'teal' ? 'bg-teal-100 text-teal-600' :
                                      'bg-gray-100 text-gray-600'
                                    }`}>
                                      {taskCategories.find(c => c.value === task.category)?.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    getTaskPriorityColor(task.priority) === 'red' ? 'bg-red-100 text-red-600' :
                                    getTaskPriorityColor(task.priority) === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-green-100 text-green-600'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                    getTaskStatusColor(task.status) === 'green' ? 'bg-green-100 text-green-600' :
                                    getTaskStatusColor(task.status) === 'blue' ? 'bg-blue-100 text-blue-600' :
                                    getTaskStatusColor(task.status) === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {taskStatuses.find(s => s.value === task.status)?.label}
                                  </span>
                                  {isTaskOverdue(task) && (
                                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              </div>
                              {task.description && (
                                <p className={`text-sm text-surface-600 mb-3 ${
                                  task.completed ? 'opacity-70' : ''
                                }`}>
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() => handleTaskToggle(task.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  task.completed
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name={task.completed ? "CheckCircle" : "Circle"} size={16} />
                              </motion.button>

                              <select
                                value={task.status}
                                onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                className="text-xs border border-surface-300 rounded px-2 py-1 bg-white"
                              >
                                {taskStatuses.map((status) => (
                                  <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                              </select>

                              <motion.button
                                onClick={() => handleTaskEdit(task)}
                                className="p-2 rounded-lg bg-surface-200 text-surface-600 hover:bg-surface-300 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name="Edit" size={16} />
                              </motion.button>

                              <motion.button
                                onClick={() => handleTaskDelete(task.id)}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </motion.button>
                            </div>

                            <div className="text-xs text-surface-500">
                              {differenceInDays(task.dueDate, new Date()) === 0 
                                ? 'Due Today'
                                : differenceInDays(task.dueDate, new Date()) === 1
                                ? 'Due Tomorrow'
                                : differenceInDays(task.dueDate, new Date()) > 0
                                ? `Due in ${differenceInDays(task.dueDate, new Date())} days`
                                : `${Math.abs(differenceInDays(task.dueDate, new Date()))} days overdue`
                              }
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
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