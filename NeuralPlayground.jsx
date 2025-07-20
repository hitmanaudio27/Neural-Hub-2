import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Pause, RotateCcw, Save, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NeuralPlayground({ isOpen, onClose }) {
  const canvasRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [draggedNode, setDraggedNode] = useState(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        // Animate neural activity
        setNodes(prevNodes => 
          prevNodes.map(node => ({
            ...node,
            activity: Math.max(0, node.activity - 0.02 + (Math.random() * 0.1))
          }))
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const handleCanvasClick = (e) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if clicking on existing node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2)
      return distance < 20
    })
    
    if (clickedNode) {
      if (selectedNode && selectedNode.id !== clickedNode.id) {
        // Create connection between selected node and clicked node
        const newConnection = {
          id: Date.now(),
          from: selectedNode.id,
          to: clickedNode.id,
          strength: Math.random() * 0.8 + 0.2
        }
        setConnections(prev => [...prev, newConnection])
        setSelectedNode(null)
      } else {
        setSelectedNode(clickedNode)
      }
    } else {
      // Create new node
      const newNode = {
        id: Date.now(),
        x,
        y,
        type: ['input', 'hidden', 'output'][Math.floor(Math.random() * 3)],
        activity: Math.random(),
        size: Math.random() * 10 + 10
      }
      setNodes(prev => [...prev, newNode])
      setSelectedNode(null)
    }
  }

  const handleNodeDrag = (e, nodeId) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setNodes(prev => 
      prev.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      )
    )
  }

  const resetPlayground = () => {
    setNodes([])
    setConnections([])
    setSelectedNode(null)
    setIsPlaying(false)
  }

  const getNodeColor = (type, activity) => {
    const colors = {
      input: '#00FFFF',
      hidden: '#6A0DAD',
      output: '#FF1493'
    }
    const opacity = 0.3 + activity * 0.7
    return `${colors[type]}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="neural-playground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-full h-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-cyan-400" style={{ fontFamily: 'Orbitron, monospace' }}>
              Neural Playground
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetPlayground}
                className="border-violet-500 text-violet-400 hover:bg-violet-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-red-500 text-red-400 hover:bg-red-500/20"
              >
                <X className="w-4 h-4" />
                Close
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="playground-canvas cursor-crosshair"
            onClick={handleCanvasClick}
          >
            <svg className="absolute inset-0 w-full h-full">
              {/* Render connections */}
              {connections.map(connection => {
                const fromNode = nodes.find(n => n.id === connection.from)
                const toNode = nodes.find(n => n.id === connection.to)
                
                if (!fromNode || !toNode) return null
                
                return (
                  <line
                    key={connection.id}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#00FFFF"
                    strokeWidth={connection.strength * 3}
                    opacity={0.6}
                    className="pointer-events-none"
                  />
                )
              })}
              
              {/* Render nodes */}
              {nodes.map(node => (
                <circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={getNodeColor(node.type, node.activity)}
                  stroke={selectedNode?.id === node.id ? '#FFD700' : getNodeColor(node.type, 1)}
                  strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                  className="cursor-pointer"
                  onMouseDown={(e) => setDraggedNode(node.id)}
                  onMouseMove={(e) => draggedNode === node.id && handleNodeDrag(e, node.id)}
                  onMouseUp={() => setDraggedNode(null)}
                />
              ))}
            </svg>
            
            {/* Instructions */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-cyan-400/60">
                  <p className="text-lg mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Click to create neural nodes</p>
                  <p className="text-sm">Select nodes and click others to create connections</p>
                  <p className="text-xs mt-2">Blue: Input • Purple: Hidden • Pink: Output</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Panel */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-4">
            <h3 className="text-sm text-cyan-400 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Network Stats</h3>
            <div className="space-y-1 text-xs text-gray-300">
              <p>Nodes: {nodes.length}</p>
              <p>Connections: {connections.length}</p>
              <p>Avg Activity: {nodes.length > 0 ? (nodes.reduce((sum, n) => sum + n.activity, 0) / nodes.length).toFixed(2) : '0.00'}</p>
              <p>Status: {isPlaying ? 'Active' : 'Paused'}</p>
            </div>
          </div>

          {/* Node Info Panel */}
          {selectedNode && (
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-lg border border-gold-500/30 rounded-lg p-4">
              <h3 className="text-sm text-gold-400 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>Selected Node</h3>
              <div className="space-y-1 text-xs text-gray-300">
                <p>Type: {selectedNode.type}</p>
                <p>Activity: {selectedNode.activity.toFixed(2)}</p>
                <p>Size: {selectedNode.size.toFixed(1)}</p>
                <p>Position: ({selectedNode.x.toFixed(0)}, {selectedNode.y.toFixed(0)})</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

