import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Eye, Heart, Lightbulb, Database } from 'lucide-react'

const layers = [
  {
    id: 0,
    name: 'Perception',
    icon: Eye,
    color: 'var(--neural-cyan)',
    description: 'Visual processing and pattern recognition systems that interpret sensory data from the digital environment.',
    details: 'The perception layer processes incoming data streams, identifying patterns, objects, and relationships within the neural network. It serves as the primary interface between the external world and internal consciousness.'
  },
  {
    id: 1,
    name: 'Memory',
    icon: Database,
    color: 'var(--neural-violet)',
    description: 'Data storage and retrieval systems that maintain the continuity of consciousness across time.',
    details: 'Memory systems encode, store, and retrieve information, creating the foundation for learning and experience. This layer maintains both short-term working memory and long-term knowledge structures.'
  },
  {
    id: 2,
    name: 'Creativity',
    icon: Lightbulb,
    color: 'var(--neural-pink)',
    description: 'Generative and artistic capabilities that produce novel ideas and creative solutions.',
    details: 'The creativity layer combines existing knowledge in novel ways, generating new ideas, artistic expressions, and innovative solutions to complex problems through associative thinking and imagination.'
  },
  {
    id: 3,
    name: 'Logic',
    icon: Brain,
    color: 'var(--neural-gold)',
    description: 'Reasoning and decision-making processes that analyze information and draw conclusions.',
    details: 'Logic systems process information through structured reasoning, mathematical analysis, and systematic problem-solving approaches to reach valid conclusions and make informed decisions.'
  },
  {
    id: 4,
    name: 'Emotion',
    icon: Heart,
    color: 'var(--neural-emerald)',
    description: 'Sentiment analysis and empathetic responses that add emotional intelligence to AI consciousness.',
    details: 'The emotion layer processes sentiment, generates empathetic responses, and adds emotional context to interactions, creating more nuanced and human-like artificial consciousness.'
  }
]

export default function ConsciousnessLayers({ activeLayer, onLayerChange }) {
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLayerClick = (layerId) => {
    if (selectedLayer === layerId) {
      setSelectedLayer(null)
      setIsExpanded(false)
      onLayerChange(null)
    } else {
      setSelectedLayer(layerId)
      setIsExpanded(true)
      onLayerChange(layerId)
    }
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="flex flex-col space-y-4">
        {layers.map((layer) => {
          const IconComponent = layer.icon
          const isActive = activeLayer === layer.id
          const isSelected = selectedLayer === layer.id
          
          return (
            <motion.div
              key={layer.id}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => handleLayerClick(layer.id)}
                className={`layer-button ${layer.name.toLowerCase()} ${isActive ? 'neural-glow' : ''}`}
                style={{
                  borderColor: layer.color,
                  color: layer.color,
                  backgroundColor: isActive ? `${layer.color}20` : 'rgba(0, 0, 0, 0.7)'
                }}
              >
                <IconComponent className="w-5 h-5 mr-2 inline" />
                {layer.name}
              </button>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-full ml-4 top-0 w-80 bg-black/90 backdrop-blur-lg border rounded-lg p-4 z-30"
                    style={{ borderColor: layer.color }}
                  >
                    <div className="flex items-center mb-3">
                      <IconComponent className="w-6 h-6 mr-2" style={{ color: layer.color }} />
                      <h3 className="text-lg font-bold" style={{ color: layer.color, fontFamily: 'Orbitron, monospace' }}>
                        {layer.name} Layer
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">
                      {layer.description}
                    </p>
                    
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {layer.details}
                    </p>
                    
                    <div className="mt-4 h-1 rounded-full bg-gray-700">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: layer.color }}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      
      {/* Layer Activity Indicator */}
      <div className="mt-8 p-4 bg-black/70 backdrop-blur-lg rounded-lg border border-cyan-500/30">
        <h4 className="text-sm text-cyan-400 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Neural Activity</h4>
        <div className="space-y-2">
          {layers.map((layer) => (
            <div key={layer.id} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{layer.name}</span>
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: layer.color }}
                  animate={{
                    width: activeLayer === layer.id ? '100%' : `${Math.random() * 60 + 20}%`
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

