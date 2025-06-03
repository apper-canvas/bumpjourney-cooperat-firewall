import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import ApperIcon from './ApperIcon'

const AIChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize conversation
  useEffect(() => {
    if (isOpen && !conversationId) {
      const newConversationId = uuidv4()
      setConversationId(newConversationId)
      
      // Load conversation history from localStorage
      const savedConversation = localStorage.getItem(`chat_${newConversationId}`)
      if (savedConversation) {
        setMessages(JSON.parse(savedConversation))
      } else {
        // Welcome message
        const welcomeMessage = {
          id: uuidv4(),
          type: 'ai',
          content: "Hi there! 👋 I'm your AI pregnancy assistant. I'm here to help you with questions about your pregnancy journey, symptoms, nutrition, and more. How can I support you today?",
          timestamp: new Date(),
          context: 'welcome'
        }
        setMessages([welcomeMessage])
      }
    }
  }, [isOpen, conversationId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save conversation to localStorage
  useEffect(() => {
    if (conversationId && messages.length > 0) {
      localStorage.setItem(`chat_${conversationId}`, JSON.stringify(messages))
    }
  }, [messages, conversationId])

  // AI Knowledge Base
  const pregnancyKnowledge = {
    // Symptoms and conditions
    symptoms: {
      nausea: {
        content: "Morning sickness is very common, especially in the first trimester. Try eating small, frequent meals, keeping crackers by your bedside, and staying hydrated. Ginger tea or ginger supplements can also help. If you're experiencing severe nausea that prevents you from keeping food down, contact your healthcare provider.",
        tips: ["Eat small, frequent meals", "Try ginger tea", "Keep crackers nearby", "Stay hydrated", "Avoid strong smells"]
      },
      fatigue: {
        content: "Fatigue is completely normal during pregnancy, especially in the first and third trimesters. Your body is working hard to support your growing baby. Make sure you're getting enough rest, eating well, and staying hydrated. Light exercise can also help boost energy levels.",
        tips: ["Get 7-9 hours of sleep", "Take short naps if needed", "Eat iron-rich foods", "Stay active with light exercise", "Ask for help when needed"]
      },
      heartburn: {
        content: "Heartburn is common during pregnancy due to hormonal changes and your growing baby pressing on your stomach. Try eating smaller meals, avoiding spicy or acidic foods, and staying upright after eating. Sleeping with your head elevated can also help.",
        tips: ["Eat smaller, frequent meals", "Avoid spicy/acidic foods", "Stay upright after eating", "Sleep with head elevated", "Try antacids (with doctor approval)"]
      }
    },
    
    // Nutrition guidance
    nutrition: {
      general: {
        content: "A balanced diet is crucial during pregnancy. Focus on getting enough protein, folic acid, iron, calcium, and DHA. Eat a variety of fruits, vegetables, whole grains, lean proteins, and dairy products. Stay hydrated and take your prenatal vitamins as recommended.",
        tips: ["Take prenatal vitamins", "Eat folate-rich foods", "Include lean proteins", "Get enough calcium", "Stay hydrated with 8-10 glasses of water daily"]
      },
      foods_to_avoid: {
        content: "Avoid raw or undercooked meats, fish high in mercury (shark, swordfish), unpasteurized dairy products, raw eggs, and excessive caffeine. Limit caffeine to less than 200mg per day and completely avoid alcohol and smoking.",
        tips: ["No raw/undercooked meats", "Avoid high-mercury fish", "No unpasteurized products", "Limit caffeine", "Absolutely no alcohol or smoking"]
      },
      weight_gain: {
        content: "Healthy weight gain varies based on your pre-pregnancy BMI. Generally, aim for 25-35 lbs for normal weight, 28-40 lbs for underweight, 15-25 lbs for overweight, and 11-20 lbs for obese. Focus on nutrient-dense foods rather than 'eating for two'.",
        tips: ["Follow your doctor's recommendations", "Focus on quality, not quantity", "Track weight at prenatal visits", "Eat nutrient-dense foods", "Stay active with approved exercises"]
      }
    },
    
    // Trimester-specific information
    trimesters: {
      first: {
        content: "The first trimester (weeks 1-12) is crucial for your baby's organ development. You might experience nausea, fatigue, and breast tenderness. Start taking prenatal vitamins, avoid harmful substances, and schedule your first prenatal appointment.",
        tips: ["Take prenatal vitamins", "Schedule first prenatal visit", "Get adequate rest", "Avoid alcohol and smoking", "Eat small, frequent meals"]
      },
      second: {
        content: "The second trimester (weeks 13-26) is often called the 'golden period' as many symptoms improve. You'll likely have more energy and start feeling baby movements. Continue healthy habits and schedule your anatomy scan.",
        tips: ["Schedule anatomy scan (18-22 weeks)", "Start feeling for baby movements", "Continue prenatal vitamins", "Practice good posture", "Consider prenatal yoga"]
      },
      third: {
        content: "The third trimester (weeks 27-40) brings rapid baby growth and preparation for birth. You might experience increased discomfort, Braxton Hicks contractions, and nesting instincts. Prepare your birth plan and hospital bag.",
        tips: ["Create birth plan", "Pack hospital bag by 36 weeks", "Practice breathing exercises", "Monitor baby movements", "Prepare for breastfeeding"]
      }
    },
    
    // Exercise and wellness
    exercise: {
      content: "Regular exercise during pregnancy is beneficial for both you and your baby. Safe activities include walking, swimming, prenatal yoga, and stationary cycling. Avoid contact sports, activities with fall risk, and exercises lying flat on your back after 20 weeks.",
      tips: ["Aim for 30 minutes daily", "Choose low-impact activities", "Stay hydrated", "Avoid overheating", "Listen to your body and rest when needed"]
    },
    
    // Warning signs
    warning_signs: {
      content: "Contact your healthcare provider immediately if you experience severe headaches, vision changes, severe abdominal pain, heavy bleeding, decreased fetal movement, persistent vomiting, or signs of preterm labor like regular contractions before 37 weeks.",
      tips: ["Severe headaches or vision changes", "Heavy bleeding", "Severe abdominal pain", "Decreased fetal movement", "Signs of preterm labor"]
    }
  }

  // Get current pregnancy week from user data (simplified)
  const getCurrentWeek = () => {
    // In a real app, this would come from user profile data
    return 20 // Example current week
  }

  // AI Response Generator
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    const currentWeek = getCurrentWeek()
    
    // Symptom-related responses
    if (message.includes('nausea') || message.includes('morning sickness') || message.includes('sick')) {
      return {
        content: pregnancyKnowledge.symptoms.nausea.content,
        tips: pregnancyKnowledge.symptoms.nausea.tips,
        context: 'symptom_nausea'
      }
    }
    
    if (message.includes('tired') || message.includes('fatigue') || message.includes('exhausted')) {
      return {
        content: pregnancyKnowledge.symptoms.fatigue.content,
        tips: pregnancyKnowledge.symptoms.fatigue.tips,
        context: 'symptom_fatigue'
      }
    }
    
    if (message.includes('heartburn') || message.includes('acid reflux')) {
      return {
        content: pregnancyKnowledge.symptoms.heartburn.content,
        tips: pregnancyKnowledge.symptoms.heartburn.tips,
        context: 'symptom_heartburn'
      }
    }
    
    // Nutrition-related responses
    if (message.includes('eat') || message.includes('food') || message.includes('nutrition') || message.includes('diet')) {
      if (message.includes('avoid') || message.includes('not eat')) {
        return {
          content: pregnancyKnowledge.nutrition.foods_to_avoid.content,
          tips: pregnancyKnowledge.nutrition.foods_to_avoid.tips,
          context: 'nutrition_avoid'
        }
      }
      if (message.includes('weight') || message.includes('gain')) {
        return {
          content: pregnancyKnowledge.nutrition.weight_gain.content,
          tips: pregnancyKnowledge.nutrition.weight_gain.tips,
          context: 'nutrition_weight'
        }
      }
      return {
        content: pregnancyKnowledge.nutrition.general.content,
        tips: pregnancyKnowledge.nutrition.general.tips,
        context: 'nutrition_general'
      }
    }
    
    // Exercise-related responses
    if (message.includes('exercise') || message.includes('workout') || message.includes('active') || message.includes('yoga')) {
      return {
        content: pregnancyKnowledge.exercise.content,
        tips: pregnancyKnowledge.exercise.tips,
        context: 'exercise'
      }
    }
    
    // Trimester-specific responses
    if (message.includes('trimester') || message.includes('week')) {
      if (currentWeek <= 12) {
        return {
          content: pregnancyKnowledge.trimesters.first.content,
          tips: pregnancyKnowledge.trimesters.first.tips,
          context: 'trimester_first'
        }
      } else if (currentWeek <= 26) {
        return {
          content: pregnancyKnowledge.trimesters.second.content,
          tips: pregnancyKnowledge.trimesters.second.tips,
          context: 'trimester_second'
        }
      } else {
        return {
          content: pregnancyKnowledge.trimesters.third.content,
          tips: pregnancyKnowledge.trimesters.third.tips,
          context: 'trimester_third'
        }
      }
    }
    
    // Warning signs
    if (message.includes('pain') || message.includes('bleeding') || message.includes('headache') || message.includes('emergency')) {
      return {
        content: pregnancyKnowledge.warning_signs.content,
        tips: pregnancyKnowledge.warning_signs.tips,
        context: 'warning_signs',
        urgent: true
      }
    }
    
    // Default helpful response
    return {
      content: `I understand you're asking about "${userMessage}". While I have information about many pregnancy topics, I'd recommend discussing this specific concern with your healthcare provider for personalized advice. They know your medical history and can provide the most appropriate guidance for your situation.`,
      tips: [
        "Schedule a prenatal appointment to discuss your concerns",
        "Keep a journal of symptoms to share with your doctor",
        "Don't hesitate to call your healthcare provider with questions",
        "Trust your instincts - you know your body best"
      ],
      context: 'general_advice'
    }
  }

  // Quick action buttons
  const quickActions = [
    {
      id: 'symptoms',
      label: '😷 Common Symptoms',
      message: 'What are common pregnancy symptoms and how can I manage them?'
    },
    {
      id: 'nutrition',
      label: '🥗 Nutrition Guide',
      message: 'What should I eat during pregnancy and what foods should I avoid?'
    },
    {
      id: 'exercise',
      label: '🏃‍♀️ Safe Exercise',
      message: 'What exercises are safe during pregnancy?'
    },
    {
      id: 'development',
      label: '👶 Baby Development',
      message: 'How is my baby developing this week?'
    }
  ]

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return

    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText)
      
      const aiMessage = {
        id: uuidv4(),
        type: 'ai',
        content: aiResponse.content,
        tips: aiResponse.tips,
        context: aiResponse.context,
        urgent: aiResponse.urgent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)

      // Show urgent notice if needed
      if (aiResponse.urgent) {
        toast.warn('This may require immediate medical attention. Please contact your healthcare provider.', {
          autoClose: 5000
        })
      }
    }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
  }

  const handleQuickAction = (action) => {
    handleSendMessage(action.message)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const exportConversation = () => {
    const conversationText = messages.map(msg => 
      `[${format(msg.timestamp, 'yyyy-MM-dd HH:mm')}] ${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
    ).join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pregnancy-chat-${format(new Date(), 'yyyy-MM-dd')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Conversation exported successfully!')
  }

  const clearConversation = () => {
    if (window.confirm('Are you sure you want to clear this conversation? This action cannot be undone.')) {
      setMessages([])
      setConversationId(null)
      if (conversationId) {
        localStorage.removeItem(`chat_${conversationId}`)
      }
      toast.success('Conversation cleared!')
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat-float-button animate-chat-float"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="MessageCircle" size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-container animate-chat-slide-up"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Bot" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Pregnancy Assistant</h3>
                  <p className="text-xs opacity-90">Here to help with your journey</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={exportConversation}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Export conversation"
                >
                  <ApperIcon name="Download" size={16} />
                </motion.button>
                <motion.button
                  onClick={clearConversation}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear conversation"
                >
                  <ApperIcon name="Trash2" size={16} />
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ApperIcon name="X" size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <ApperIcon name="Heart" className="text-white" size={24} />
                  </div>
                  <h4 className="font-semibold text-surface-800 mb-2">Welcome to AI Pregnancy Support!</h4>
                  <p className="text-sm text-surface-600 mb-4">
                    I'm here to help answer your pregnancy questions and provide guidance throughout your journey.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.id}
                        onClick={() => handleQuickAction(action)}
                        className="p-3 bg-surface-50 rounded-xl border border-surface-200 hover:bg-surface-100 transition-colors text-xs"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`chat-bubble ${
                    message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="Bot" size={12} className="text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary">AI Assistant</span>
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.tips && (
                      <div className="mt-3 pt-3 border-t border-surface-100">
                        <p className="text-xs font-medium text-surface-700 mb-2 flex items-center">
                          <ApperIcon name="Lightbulb" size={12} className="mr-1 text-yellow-500" />
                          Quick Tips:
                        </p>
                        <ul className="space-y-1">
                          {message.tips.map((tip, index) => (
                            <li key={index} className="text-xs text-surface-600 flex items-start">
                              <ApperIcon name="Check" size={10} className="mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.urgent && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-700 flex items-center">
                          <ApperIcon name="AlertTriangle" size={12} className="mr-1 text-red-500" />
                          This may require immediate medical attention
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs opacity-70">
                      {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="chat-bubble chat-bubble-ai">
                    <div className="typing-indicator">
                      <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '160ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '320ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-container">
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {quickActions.slice(0, 2).map((action) => (
                    <motion.button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about symptoms, nutrition, exercises..."
                    className="w-full px-3 py-2 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                    rows={1}
                    disabled={isTyping}
                  />
                </div>
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: inputMessage.trim() && !isTyping ? 1.05 : 1 }}
                  whileTap={{ scale: inputMessage.trim() && !isTyping ? 0.95 : 1 }}
                >
                  <ApperIcon name="Send" size={16} />
                </motion.button>
              </div>
              
              <p className="text-xs text-surface-500 mt-2 text-center">
                This AI assistant provides general information. Always consult your healthcare provider for medical advice.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIChatSupport