import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { Upload, ImagePlus, FileImage } from 'lucide-react'

export default function UploadZone({ onFileSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 16 * 1024 * 1024, // 16MB
    multiple: false
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed 
        transition-all duration-300 overflow-hidden
        ${isDragActive 
          ? 'border-primary-500 bg-primary-500/10' 
          : 'border-white/20 hover:border-primary-500/50 hover:bg-white/5'
        }
        ${isDragAccept ? 'border-green-500 bg-green-500/10' : ''}
        ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20"
        animate={{
          opacity: isDragActive ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative py-16 px-8 md:py-24 md:px-12 text-center">
        {/* Icon */}
        <motion.div
          animate={{
            y: isDragActive ? -10 : 0,
            scale: isDragActive ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-flex mb-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/30 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-primary-500 to-purple-600 p-5 rounded-2xl">
              {isDragActive ? (
                <FileImage className="w-10 h-10 text-white" />
              ) : (
                <Upload className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          animate={{ scale: isDragActive ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
          </h3>
          <p className="text-gray-400 mb-6">
            {isDragActive 
              ? 'Release to upload' 
              : 'or click to browse from your device'
            }
          </p>
        </motion.div>

        {/* Browse button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary"
        >
          <ImagePlus className="w-5 h-5" />
          <span>Browse Files</span>
        </motion.button>

        {/* Supported formats */}
        <p className="mt-6 text-sm text-gray-500">
          Supports: JPEG, PNG, GIF, WebP • Max 16MB
        </p>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/10 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/10 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/10 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/10 rounded-br-lg" />
      </div>
    </motion.div>
  )
}
