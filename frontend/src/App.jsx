import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import Footer from './components/Footer'
import BackgroundEffects from './components/BackgroundEffects'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <Router>
      <div className={`min-h-screen relative ${darkMode ? 'dark' : ''}`}>
        {/* Background Effects */}
        <BackgroundEffects />
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </AnimatePresence>
          
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
