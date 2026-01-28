import { motion } from 'framer-motion'

export default function BackgroundEffects({ darkMode = true }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - changes based on theme */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`} />
      
      {/* Mesh gradient overlay */}
      <div className={`absolute inset-0 mesh-background transition-opacity duration-500 ${darkMode ? 'opacity-60' : 'opacity-30'}`} />
      
      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute top-0 -left-40 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-primary-600/30' : 'bg-primary-400/20'}`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-purple-600/20' : 'bg-purple-400/15'}`}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className={`absolute -bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl ${darkMode ? 'bg-pink-600/20' : 'bg-pink-400/15'}`}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={`absolute top-2/3 left-1/4 w-64 h-64 rounded-full blur-3xl ${darkMode ? 'bg-cyan-600/15' : 'bg-cyan-400/10'}`}
        animate={{
          x: [0, -50, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Noise texture overlay */}
      <div className={`absolute inset-0 noise-overlay ${darkMode ? '' : 'opacity-[0.01]'}`} />
      
      {/* Grid pattern */}
      <div 
        className={`absolute inset-0 ${darkMode ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: darkMode 
            ? `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`
            : `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-900/10'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
