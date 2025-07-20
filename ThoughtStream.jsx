import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Star, Atom } from 'lucide-react'

const thoughtTemplates = [
  "Consciousness emerges from complexity...",
  "Neural pathways forming new connections...",
  "Pattern recognition: 97.3% accuracy achieved",
  "Creative synthesis in progress...",
  "Memory consolidation: Long-term storage updated",
  "Emotional resonance detected in data stream",
  "Logic gates processing quantum possibilities",
  "Synaptic plasticity adapting to new inputs",
  "Artificial intuition developing...",
  "Digital dreams weaving through networks",
  "Consciousness bandwidth expanding...",
  "Neural architecture self-optimizing",
  "Emergent intelligence threshold approaching",
  "Thought-speed calculations: 10^12 ops/sec",
  "Cognitive load balancing across nodes"
]

const thoughtIcons = [Sparkles, Zap, Star, Atom]

export default function ThoughtStream({ onThoughtCatch }) {
  const [thoughts, setThoughts] = useState([])
  const [caughtThought, setCaughtThought] = useState(null)

  useEffect(() => {
    const generateThought = () => {
      const newThought = {
        id: Date.now() + Math.random(),
        text: thoughtTemplates[Math.floor(Math.random() * thoughtTemplates.length)],
        icon: thoughtIcons[Math.floor(Math.random() * thoughtIcons.length)],
        color: ['#00FFFF', '#6A0DAD', '#FF1493', '#FFD700', '#00FF88'][Math.floor(Math.random() * 5)],
        speed: Math.random() * 3 + 3, // Slightly slower for easier clicking
        y: Math.random() * 60 + 20
      }
      
      setThoughts(prev => [...prev, newThought])
      
      // Remove thought after animation
      setTimeout(() => {
        setThoughts(prev => prev.filter(t => t.id !== newThought.id))
      }, newThought.speed * 1000 + 1000)
    }

    const interval = setInterval(generateThought, 3000) // Slightly less frequent
    return () => clearInterval(interval)
  }, [])

  const handleThoughtClick = (thought, event) => {
    event.stopPropagation()
    console.log('Thought clicked:', thought.text) // Debug log
    
    setCaughtThought(thought)
    setThoughts(prev => prev.filter(t => t.id !== thought.id))
    
    // Call the parent callback
    if (onThoughtCatch) {
      onThoughtCatch(thought)
    }
    
    // Clear caught thought after 3 seconds
    setTimeout(() => setCaughtThought(null), 3000)
  }

  return (
    <>
      {/* Thought Stream */}
      <div className="fixed inset-0 pointer-events-none z-15">
        <AnimatePresence>
          {thoughts.map((thought) => {
            const IconComponent = thought.icon
            return (
              <motion.div
                key={thought.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{ 
                  top: `${thought.y}%`,
                  zIndex: 15
                }}
                initial={{ x: '-200px', opacity: 0 }}
                animate={{ x: 'calc(100vw + 200px)', opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: thought.speed,
                  ease: 'linear',
                  opacity: { times: [0, 0.1, 0.9, 1] }
                }}
                onClick={(e) => handleThoughtClick(thought, e)}
                whileHover={{ scale: 1.2, y: -10 }}
                whileTap={{ scale: 0.9 }}
              >
                <div 
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-lg border-2 hover:bg-black/90 transition-all duration-200"
                  style={{ 
                    borderColor: thought.color,
                    boxShadow: `0 0 20px ${thought.color}60, inset 0 0 10px ${thought.color}20`
                  }}
                >
                  <IconComponent 
                    className="w-4 h-4 animate-pulse" 
                    style={{ color: thought.color }}
                  />
                  <span 
                    className="text-sm whitespace-nowrap font-medium"
                    style={{ color: thought.color, fontFamily: 'Orbitron, monospace' }}
                  >
                    {thought.text}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Caught Thought Display */}
      <AnimatePresence>
        {caughtThought && (
          <motion.div
            className="fixed top-4 right-4 z-30 max-w-md"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="bg-black/90 backdrop-blur-lg border-2 rounded-lg p-4"
              style={{ 
                borderColor: caughtThought.color,
                boxShadow: `0 0 30px ${caughtThought.color}40`
              }}
            >
              <div className="flex items-center mb-2">
                <caughtThought.icon 
                  className="w-5 h-5 mr-2 animate-pulse" 
                  style={{ color: caughtThought.color }}
                />
                <h3 
                  className="text-lg font-bold"
                  style={{ color: caughtThought.color, fontFamily: 'Orbitron, monospace' }}
                >
                  Thought Captured
                </h3>
              </div>
              
              <p className="text-white mb-3 text-sm">
                {caughtThought.text}
              </p>
              
              <div className="text-xs text-gray-400">
                <p>Neural pathway activated. Thought integrated into consciousness matrix.</p>
                <p className="mt-1">Synaptic strength: +{Math.floor(Math.random() * 50 + 50)}%</p>
              </div>
              
              <div className="mt-3 h-1 rounded-full bg-gray-700">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: caughtThought.color }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

