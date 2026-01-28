import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Github, Trash2 } from 'lucide-react'

export default function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <div className={`rounded-2xl max-w-7xl mx-auto transition-colors duration-300 ${darkMode ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg'}`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-primary-500/50 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-2.5 rounded-xl">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                <div className="flex flex-col">
                  <span className={`text-xl font-display font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Eco<span className="text-primary-500">Sort</span>
                  </span>
                  <span className={`text-[10px] -mt-1 tracking-wider uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Intelligent Segregation
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-4 py-2 group"
                  >
                    <span className={`relative z-10 text-sm font-medium transition-colors duration-200 ${
                      isActive(link.path) 
                        ? (darkMode ? 'text-white' : 'text-gray-900') 
                        : (darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900')
                    }`}>
                      {link.name}
                    </span>
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="navbar-active"
                        className={`absolute inset-0 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-primary-100'}`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              {/* Right side actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Theme toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>

                {/* GitHub link */}
                <motion.a
                  href="https://github.com/Aniketkoppaka/WasteSegregation"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-xl transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Github className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </motion.a>

                {/* CTA Button */}
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary text-sm"
                  >
                    Try Now
                  </motion.button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                {isOpen ? (
                  <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                ) : (
                  <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`md:hidden border-t overflow-hidden ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
              >
                <div className="px-6 py-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? (darkMode ? 'bg-white/10 text-white' : 'bg-primary-100 text-primary-700')
                          : (darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className={`flex items-center gap-3 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      <span>{darkMode ? 'Light' : 'Dark'}</span>
                    </button>
                    <a
                      href="https://github.com/Aniketkoppaka/WasteSegregation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}
