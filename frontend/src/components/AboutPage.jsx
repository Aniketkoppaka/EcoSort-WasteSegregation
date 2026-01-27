import { motion } from 'framer-motion'
import { 
  Cpu, 
  Target, 
  Shield, 
  Zap,
  Github,
  ExternalLink,
  Code2,
  Database,
  Layers,
  Recycle,
  Leaf,
  Trash2,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  const models = [
    {
      name: 'YOLOv8 Nano',
      purpose: 'Object Detection',
      accuracy: 'mAP50: 99.5%',
      description: 'Detects and localizes waste items in images with bounding boxes',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'MobileNetV2',
      purpose: 'Classification',
      accuracy: 'Accuracy: 92.8%',
      description: 'Classifies detected waste into 4 categories using transfer learning',
      icon: Layers,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Autoencoder',
      purpose: 'Anomaly Detection',
      accuracy: 'Threshold-based',
      description: 'Identifies unusual items that may require special handling',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
    },
  ]

  const categories = [
    { name: 'Recyclable', icon: Recycle, color: 'text-blue-400', bg: 'bg-blue-500/20', items: ['Plastic bottles', 'Glass', 'Metal cans', 'Paper', 'Cardboard'] },
    { name: 'Organic', icon: Leaf, color: 'text-green-400', bg: 'bg-green-500/20', items: ['Food scraps', 'Yard waste', 'Coffee grounds', 'Eggshells'] },
    { name: 'E-Waste', icon: Cpu, color: 'text-red-400', bg: 'bg-red-500/20', items: ['Batteries', 'Electronics', 'Cables', 'Phones', 'Computers'] },
    { name: 'General', icon: Trash2, color: 'text-gray-400', bg: 'bg-gray-500/20', items: ['Styrofoam', 'Mixed materials', 'Contaminated items'] },
  ]

  const techStack = [
    { name: 'Python', category: 'Backend' },
    { name: 'TensorFlow', category: 'ML' },
    { name: 'Keras', category: 'ML' },
    { name: 'YOLOv8', category: 'ML' },
    { name: 'Flask', category: 'Backend' },
    { name: 'OpenCV', category: 'Vision' },
    { name: 'React', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Framer Motion', category: 'Frontend' },
    { name: 'NumPy', category: 'Data' },
    { name: 'Pandas', category: 'Data' },
    { name: 'Scikit-learn', category: 'ML' },
  ]

  const stats = [
    { value: '99.5%', label: 'Detection mAP50' },
    { value: '92.8%', label: 'Classification Accuracy' },
    { value: '4', label: 'Waste Categories' },
    { value: '3', label: 'AI Models' },
  ]

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24"
    >
      {/* Hero */}
      <section className="container-custom section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <Code2 className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">
              Deep Learning Project
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="heading-1 text-white mb-6"
          >
            About{' '}
            <span className="text-gradient">WasteAI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="body-large max-w-2xl mx-auto mb-12"
          >
            An AI-powered waste segregation system that combines computer vision and deep learning
            to automate waste classification for a cleaner, more sustainable future.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card-glass p-6 text-center"
              >
                <div className="text-3xl font-display font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Models Section */}
      <section className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-white mb-4">AI Models</h2>
          <p className="body-large max-w-2xl mx-auto">
            Our system uses three state-of-the-art deep learning models
            working together for accurate waste classification.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-glass p-8 card-hover group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${model.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <model.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">
                {model.name}
              </h3>
              <p className="text-primary-400 font-medium mb-3">{model.purpose}</p>
              <div className="inline-flex px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <span className="text-green-400 text-sm font-medium">{model.accuracy}</span>
              </div>
              <p className="text-gray-400 leading-relaxed">{model.description}</p>
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
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-white mb-4">Waste Categories</h2>
          <p className="body-large max-w-2xl mx-auto">
            Our system classifies waste into four main categories,
            each with specific disposal guidelines.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-glass p-6"
            >
              <div className={`inline-flex p-3 rounded-xl ${category.bg} mb-4`}>
                <category.icon className={`w-6 h-6 ${category.color}`} />
              </div>
              <h3 className={`text-xl font-semibold ${category.color} mb-4`}>
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${category.bg}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 text-white mb-4">Tech Stack</h2>
          <p className="body-large max-w-2xl mx-auto">
            Built with modern technologies and best practices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-white/10 hover:border-primary-500/30 transition-all"
            >
              <span className="text-white font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Datasets Section */}
      <section className="container-custom section-padding">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-glass p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary-500/20">
              <Database className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="heading-3 text-white">Training Data</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">TrashNet Dataset</h3>
              <p className="text-gray-400 mb-2">2,527 images across 6 categories</p>
              <p className="text-gray-500 text-sm">
                Contains images of cardboard, glass, metal, paper, plastic, and trash
                for waste classification training.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">TACO Dataset</h3>
              <p className="text-gray-400 mb-2">1,500+ real-world waste images</p>
              <p className="text-gray-500 text-sm">
                Trash Annotations in Context - real-world images with bounding box
                annotations for object detection training.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Author Section */}
      <section className="container-custom pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600/20 to-purple-600/20 p-12 md:p-16 text-center"
        >
          <div className="relative z-10">
            <h2 className="heading-2 text-white mb-4">
              Created by Aniket Koppaka
            </h2>
            <p className="body-large max-w-xl mx-auto mb-8">
              A deep learning project exploring computer vision and AI
              for environmental sustainability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="https://github.com/Aniketkoppaka/WasteSegregation"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </motion.a>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary"
                >
                  <span>Try the Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.main>
  )
}
