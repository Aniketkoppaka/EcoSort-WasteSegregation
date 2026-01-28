import { motion } from 'framer-motion'
import { Github, Linkedin, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// Custom X (Twitter) icon component
const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'How it Works', href: '/#how-it-works' },
    ],
    Resources: [
      { name: 'GitHub', href: 'https://github.com/Aniketkoppaka/WasteSegregation', external: true },
      { name: 'Documentation', href: 'https://github.com/Aniketkoppaka/WasteSegregation', external: true },
      { name: 'API Reference', href: 'https://github.com/Aniketkoppaka/WasteSegregation', external: true },
    ],
    Categories: [
      { name: 'Recyclable', href: '#', color: 'text-recyclable' },
      { name: 'Organic', href: '#', color: 'text-organic' },
      { name: 'E-Waste', href: '#', color: 'text-ewaste' },
      { name: 'General', href: '#', color: 'text-general' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Aniketkoppaka', label: 'GitHub' },
    { icon: XIcon, href: 'https://x.com/aniketkoppaka', label: 'X' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/aniketveerkoppaka/', label: 'LinkedIn' },
  ]

  return (
    <footer className="relative mt-auto">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-purple-600 p-2.5 rounded-xl">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                  Eco<span className="text-primary-500">Sort</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-md">
              An AI-powered waste segregation system using YOLOv8, EfficientNetB0, and deep learning
              to automate waste classification for a cleaner, sustainable future.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${link.color || ''}`}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${link.color || ''}`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              © {currentYear} EcoSort. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{' '}
              <a
                href="https://github.com/Aniketkoppaka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Aniket Koppaka
              </a>
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm">
                Powered by TensorFlow & YOLOv8
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
