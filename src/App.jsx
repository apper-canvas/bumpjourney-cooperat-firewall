import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './i18n'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import Health from './pages/Health'
import NotFound from './pages/NotFound'
import AIChatSupport from './components/AIChatSupport'
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/health" element={<Health />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
toastClassName="bg-white shadow-lg border border-pink-100"
      />
      
      <AIChatSupport />
    </div>
  )
}

export default App