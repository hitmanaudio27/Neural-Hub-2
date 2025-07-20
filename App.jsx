import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, Layers } from 'lucide-react'
import NeuralScene from './components/NeuralScene'
import ConsciousnessLayers from './components/ConsciousnessLayers'
import ThoughtStream from './components/ThoughtStream'
import NeuralPlayground from './components/NeuralPlayground'
import BandSelector from './components/BandSelector'
import { Button } from './components/ui/button'
import './App.css'

function AwakeningSequence({ onComplete }) {
  const [stage, setStage] = useState(0)
  
  useEffect(() => {
    const stages = [
      { delay: 1000, text: "Initializing neural pathways..." },
      { delay: 2000, text: "Consciousness emerging..." },
      { delay: 3000, text: "Synaptic connections forming..." },
      { delay: 4000, text: "Neural Nexus online." }
    ]
    
    const timer = setTimeout(() => {
      if (stage < stages.length - 1) {
        setStage(stage + 1)
      } else {
        setTimeout(onComplete, 1000)
      }
    }, stages[stage]?.delay || 1000)
    
    return () => clearTimeout(timer)
  }, [stage, onComplete])
  
  const stages = [
    "Initializing neural pathways...",
    "Consciousness emerging...",
    "Synaptic connections forming...",
    "Neural Nexus online."
  ]
  
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <motion.div
          className="awakening-text mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Neural Nexus
        </motion.div>
        
        <motion.p
          key={stage}
          className="text-cyan-400 text-lg"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {stages[stage]}
        </motion.p>
        
        <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((stage + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function MainInterface() {
  const [activeLayer, setActiveLayer] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showPlayground, setShowPlayground] = useState(false)
  const [caughtThoughts, setCaughtThoughts] = useState([])
  const [selectedBand, setSelectedBand] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleThoughtCatch = (thought) => {
    setCaughtThoughts(prev => [...prev, thought].slice(-5)) // Keep last 5 thoughts
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Neural Scene Background */}
      <NeuralScene 
        activeLayer={activeLayer} 
        mousePosition={mousePosition}
        selectedBand={selectedBand}
        isPlaying={isPlaying}
      />
      
      {/* Main Title */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="awakening-text text-5xl">Neural Nexus</h1>
        <p className="text-center text-cyan-400/80 text-sm mt-2" style={{ fontFamily: 'Orbitron, monospace' }}>
          Interactive Consciousness Experience
        </p>
      </motion.div>

      {/* Consciousness Layers */}
      <ConsciousnessLayers 
        activeLayer={activeLayer} 
        onLayerChange={setActiveLayer} 
      />

      {/* Thought Stream */}
      <ThoughtStream onThoughtCatch={handleThoughtCatch} />

      {/* Control Panel */}
      <motion.div
        className="absolute top-8 right-8 z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
      >
        <div className="flex flex-col space-y-3">
          <Button
            onClick={() => setShowPlayground(true)}
            className="bg-black/70 backdrop-blur-lg border border-pink-500/50 text-pink-400 hover:bg-pink-500/20"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Neural Playground
          </Button>
          
          <Button
            onClick={() => setActiveLayer(activeLayer === null ? 0 : null)}
            className="bg-black/70 backdrop-blur-lg border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
          >
            <Layers className="w-4 h-4 mr-2" />
            Toggle Layers
          </Button>
        </div>
      </motion.div>

      {/* Caught Thoughts Panel */}
      {caughtThoughts.length > 0 && (
        <motion.div
          className="absolute bottom-8 right-8 z-20 max-w-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/80 backdrop-blur-lg border border-gold-500/30 rounded-lg p-4">
            <h3 className="text-sm neural-font text-gold-400 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Captured Thoughts
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {caughtThoughts.slice(-3).map((thought, index) => (
                <div key={thought.id} className="text-xs text-gray-300 p-2 bg-gray-800/50 rounded">
                  {thought.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Neural Playground */}
      <NeuralPlayground 
        isOpen={showPlayground} 
        onClose={() => setShowPlayground(false)} 
      />

      {/* Band Selector */}
      <BandSelector
        selectedBand={selectedBand}
        onBandSelect={setSelectedBand}
        isPlaying={isPlaying}
        onPlayToggle={setIsPlaying}
      />

      {/* Status Bar */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="bg-black/70 backdrop-blur-lg border border-cyan-500/30 rounded-lg px-6 py-2">
          <div className="flex items-center space-x-6 text-xs" style={{ fontFamily: 'Orbitron, monospace' }}>
            <div className="flex items-center space-x-2">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">Neural Activity: Active</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-violet-400">
              Layer: {activeLayer !== null ? ['Perception', 'Memory', 'Creativity', 'Logic', 'Emotion'][activeLayer] : 'All'}
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-pink-400">
              Thoughts: {caughtThoughts.length}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function App() {
  const [isAwakening, setIsAwakening] = useState(true)

  return (
    <div className="w-full h-screen bg-black">
      <AnimatePresence mode="wait">
        {isAwakening ? (
          <AwakeningSequence onComplete={() => setIsAwakening(false)} />
        ) : (
          <MainInterface />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

