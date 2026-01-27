import { motion } from 'framer-motion'
import { 
  Check, 
  AlertTriangle, 
  Recycle, 
  Leaf, 
  Cpu, 
  Trash2,
  Target,
  Shield,
  Info,
  ArrowRight
} from 'lucide-react'

const categoryConfig = {
  recyclable: {
    icon: Recycle,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bin: 'Blue Bin',
    binIcon: '♻️',
  },
  organic: {
    icon: Leaf,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    bin: 'Green Bin',
    binIcon: '🟢',
  },
  'e-waste': {
    icon: Cpu,
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    bin: 'E-Waste Collection',
    binIcon: '🔴',
  },
  general: {
    icon: Trash2,
    color: 'from-gray-500 to-slate-500',
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/30',
    bin: 'Black Bin',
    binIcon: '⚫',
  },
}

export default function ResultsDisplay({ results }) {
  if (!results || !results.classification) return null

  const { classification, disposal, detection, anomaly } = results
  const wasteType = classification.waste_type
  const config = categoryConfig[wasteType] || categoryConfig.general
  const CategoryIcon = config.icon
  const confidence = (classification.confidence * 100).toFixed(1)

  const probabilities = Object.entries(classification.all_probabilities || {})
    .sort((a, b) => b[1] - a[1])

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="container-custom pb-24"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-300">Analysis Complete</span>
          </div>
          <h2 className="heading-2 text-white">Classification Results</h2>
        </motion.div>

        {/* Main result card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`card-glass p-8 md:p-10 mb-8 border ${config.borderColor}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Category icon */}
            <div className="flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-3xl blur-2xl opacity-50`} />
                <div className={`relative bg-gradient-to-br ${config.color} p-8 rounded-3xl`}>
                  <CategoryIcon className="w-16 h-16 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Classification info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                Classified as
              </p>
              <h3 className={`text-4xl md:text-5xl font-display font-bold ${config.textColor} mb-4`}>
                {wasteType.charAt(0).toUpperCase() + wasteType.slice(1)}
              </h3>
              
              {/* Confidence bar */}
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Confidence</span>
                  <span className={`font-semibold ${config.textColor}`}>{confidence}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                  />
                </div>
              </div>
            </div>

            {/* Disposal info */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className={`p-6 rounded-2xl ${config.bgColor} border ${config.borderColor}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{config.binIcon}</span>
                  <div>
                    <p className="text-white font-semibold">{config.bin}</p>
                    <p className="text-gray-400 text-sm">Recommended disposal</p>
                  </div>
                </div>
                {disposal && (
                  <div className="space-y-2">
                    <p className="text-gray-300 text-sm">{disposal.instructions}</p>
                    <div className="flex items-start gap-2 pt-2">
                      <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-400 text-xs">{disposal.examples}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Detection card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold">Object Detection</h4>
            </div>
            {detection ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {detection.detected ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  )}
                  <span className={detection.detected ? 'text-green-400' : 'text-yellow-400'}>
                    {detection.detected ? 'Waste Detected' : 'No Waste Detected'}
                  </span>
                </div>
                {detection.detected && (
                  <p className="text-gray-400 text-sm">
                    Confidence: {(detection.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Detection not available</p>
            )}
          </motion.div>

          {/* Anomaly card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-glass p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-white font-semibold">Anomaly Check</h4>
            </div>
            {anomaly ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {anomaly.is_anomaly ? (
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                  <span className={anomaly.is_anomaly ? 'text-orange-400' : 'text-green-400'}>
                    {anomaly.is_anomaly ? 'Unusual Item Detected' : 'Normal Item'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Score: {anomaly.score.toFixed(2)} / 1.0
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Anomaly detection not available</p>
            )}
          </motion.div>

          {/* Quick action card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-glass p-6 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-500/20">
                <Recycle className="w-5 h-5 text-primary-400" />
              </div>
              <h4 className="text-white font-semibold">Take Action</h4>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-secondary w-full"
            >
              <span>Analyze Another</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Probability distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-glass p-8"
        >
          <h4 className="text-xl font-semibold text-white mb-6">Probability Distribution</h4>
          <div className="space-y-4">
            {probabilities.map(([category, probability], index) => {
              const catConfig = categoryConfig[category] || categoryConfig.general
              const percent = (probability * 100).toFixed(1)
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <catConfig.icon className={`w-5 h-5 ${catConfig.textColor}`} />
                      <span className="text-white font-medium capitalize">{category}</span>
                    </div>
                    <span className={`font-semibold ${catConfig.textColor}`}>{percent}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${catConfig.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
