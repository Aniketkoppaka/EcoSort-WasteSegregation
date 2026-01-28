import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Recycle, 
  Leaf, 
  Cpu, 
  Trash2,
  Zap,
  Shield,
  BarChart3,
  ImagePlus,
  X,
  Loader2,
  Check,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react'
import UploadZone from './UploadZone'
import ResultsDisplay from './ResultsDisplay'

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResults(null)
    setError(null)
  }, [])

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResults(data)
      }
    } catch (err) {
      setError('Failed to connect to the server. Make sure the Flask backend is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const categories = [
    { 
      name: 'Recyclable', 
      icon: Recycle, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      description: 'Plastic, glass, metal, paper'
    },
    { 
      name: 'Organic', 
      icon: Leaf, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      description: 'Food waste, yard waste'
    },
    { 
      name: 'E-Waste', 
      icon: Cpu, 
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      description: 'Electronics, batteries'
    },
    { 
      name: 'General', 
      icon: Trash2, 
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-500/10',
      textColor: 'text-gray-400',
      description: 'Non-recyclable items'
    },
  ]

  const features = [
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Get instant classification results powered by deep learning models'
    },
    {
      icon: Shield,
      title: 'Anomaly Detection',
      description: 'Flags unusual items that may require special handling'
    },
    {
      icon: BarChart3,
      title: 'Confidence Scores',
      description: 'See probability distributions across all waste categories'
    },
  ]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24"
    >
      {/* Hero Section */}
      <section className="container-custom section-padding relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">
              Powered by YOLOv8 & EfficientNetB0
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="heading-1 text-gray-900 dark:text-white mb-6"
          >
            Intelligent{' '}
            <span className="text-gradient">Waste Segregation</span>
            <br />with AI
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="body-large max-w-2xl mx-auto mb-12"
          >
            Upload an image of waste and let our AI classify it into the correct category
            for proper disposal. Making recycling smarter, one image at a time.
          </motion.p>

          {/* Category badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`category-badge ${cat.bgColor} border border-gray-200 dark:border-white/10`}
              >
                <cat.icon className={`w-4 h-4 ${cat.textColor}`} />
                <span className={cat.textColor}>{cat.name}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-500"
            >
              <span className="text-xs uppercase tracking-wider">Try it out</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="container-custom pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card-glass p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <UploadZone onFileSelect={handleFileSelect} />
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Preview image */}
                  <div className="relative group">
                    <div className="aspect-video rounded-xl overflow-hidden bg-black/20">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClear}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* File info */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-100 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary-500/20">
                        <ImagePlus className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] md:max-w-md">
                          {selectedFile.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="btn-primary"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Analyze</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <ResultsDisplay results={results} />
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Our AI-powered system uses state-of-the-art deep learning models
            to accurately classify waste in real-time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="card-glass p-8 card-hover"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 mb-6">
                <feature.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
            Waste Categories
          </h2>
          <p className="body-large max-w-2xl mx-auto">
            Our system classifies waste into four main categories for proper disposal.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="card-glass p-6 text-center card-hover"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-4`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${category.textColor} mb-2`}>
                {category.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600/20 to-purple-600/20 p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10" />
          <div className="relative z-10">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">
              Ready to Start?
            </h2>
            <p className="body-large max-w-xl mx-auto mb-8">
              Upload an image and let our AI help you dispose of waste correctly.
            </p>
            <motion.a
              href="#upload"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Image</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </section>
    </motion.main>
  )
}
