import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export default function NeuralScene({ activeLayer, selectedBand, isPlaying }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const animationIdRef = useRef(null)
  const neuronsRef = useRef([])
  const connectionsRef = useRef([])
  const bandLabelsRef = useRef([])
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const audioRef = useRef(null)

  // Band data with 30-second loops
  const bands = [
    { 
      name: 'Penumbra', 
      color: 0x00FFFF, 
      position: { x: -4, y: 2, z: 0 },
      audioUrl: '/audio/penumbra-loop.mp3' // You'll need to add these audio files
    },
    { 
      name: 'Veridian', 
      color: 0x6A0DAD, 
      position: { x: 4, y: 2, z: 0 },
      audioUrl: '/audio/veridian-loop.mp3'
    },
    { 
      name: 'Mild Fever', 
      color: 0xFF1493, 
      position: { x: 0, y: -3, z: 2 },
      audioUrl: '/audio/mild-fever-loop.mp3'
    }
  ]

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true
    })

    // Store references
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Configure renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    
    // Mount renderer
    if (mountRef.current) {
      const canvas = renderer.domElement
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = '1'
      canvas.style.pointerEvents = 'none'
      mountRef.current.appendChild(canvas)
    }

    // Position camera
    camera.position.set(0, 0, 15)
    camera.lookAt(0, 0, 0)

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Create neural network structure
    const neurons = []
    const connections = []
    let pulses = []
    const bandLabels = []

    // Define neuron layers (representing sensory processing + music generation)
    const layers = [
      { name: 'Input', count: 8, z: -6, color: 0x00FFFF }, // Eyes/Ears input
      { name: 'Processing1', count: 12, z: -3, color: 0x6A0DAD }, // Primary processing
      { name: 'Processing2', count: 10, z: 0, color: 0xFF1493 }, // Secondary processing
      { name: 'MusicGeneration', count: 15, z: 3, color: 0xFFD700 }, // Music Generation Layer
      { name: 'Output', count: 6, z: 6, color: 0x00FF88 } // Output/Response
    ]

    // Create neurons for each layer
    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2
        let radius = 3 + Math.random() * 2
        
        // Special positioning for music generation layer
        if (layer.name === 'MusicGeneration') {
          radius = 4 + Math.random() * 3 // Larger radius for music layer
        }
        
        const neuron = {
          position: new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            layer.z
          ),
          layer: layerIndex,
          color: layer.color,
          mesh: null,
          originalColor: layer.color,
          pulseIntensity: 0,
          isMusicNeuron: layer.name === 'MusicGeneration'
        }

        // Create neuron mesh (sphere)
        const geometry = new THREE.SphereGeometry(
          layer.name === 'MusicGeneration' ? 0.3 : 0.2, // Larger spheres for music neurons
          16, 16
        )
        const material = new THREE.MeshPhongMaterial({ 
          color: layer.color,
          emissive: layer.color,
          emissiveIntensity: 0.1
        })
        
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(neuron.position)
        scene.add(mesh)
        
        neuron.mesh = mesh
        neurons.push(neuron)
      }
    })

    // Create band name labels in the music generation area
    const fontLoader = new FontLoader()
    
    // For now, create simple text sprites for band names
    bands.forEach((band, index) => {
      // Create a canvas for text rendering
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 256
      canvas.height = 64
      
      context.fillStyle = `#${band.color.toString(16).padStart(6, '0')}`
      context.font = 'Bold 24px Orbitron'
      context.textAlign = 'center'
      context.fillText(band.name, 128, 40)
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
      const sprite = new THREE.Sprite(material)
      
      sprite.position.set(band.position.x, band.position.y, band.position.z)
      sprite.scale.set(2, 0.5, 1)
      scene.add(sprite)
      
      bandLabels.push({
        sprite: sprite,
        band: band,
        originalScale: { x: 2, y: 0.5, z: 1 }
      })
    })

    // Create connections between layers
    layers.forEach((layer, layerIndex) => {
      if (layerIndex < layers.length - 1) {
        const currentLayerNeurons = neurons.filter(n => n.layer === layerIndex)
        const nextLayerNeurons = neurons.filter(n => n.layer === layerIndex + 1)
        
        currentLayerNeurons.forEach(neuron1 => {
          nextLayerNeurons.forEach(neuron2 => {
            if (Math.random() > 0.3) { // 70% connection probability
              const points = [neuron1.position, neuron2.position]
              const geometry = new THREE.BufferGeometry().setFromPoints(points)
              const material = new THREE.LineBasicMaterial({ 
                color: 0x444444, 
                transparent: true, 
                opacity: 0.3 
              })
              
              const line = new THREE.Line(geometry, material)
              scene.add(line)
              
              connections.push({
                from: neuron1,
                to: neuron2,
                line: line,
                material: material
              })
            }
          })
        })
      }
    })

    // Store references
    neuronsRef.current = neurons
    connectionsRef.current = connections
    bandLabelsRef.current = bandLabels

    // Audio setup
    const setupAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256
      }
    }

    // Function to create a pulse
    const createPulse = (connection) => {
      const pulse = {
        connection: connection,
        progress: 0,
        speed: 0.02 + Math.random() * 0.03,
        intensity: 0.8 + Math.random() * 0.4,
        active: true
      }
      pulses.push(pulse)
    }

    // Start random pulses
    const startPulses = () => {
      // Create pulses from input layer (simulating sensory input)
      const inputNeurons = neurons.filter(n => n.layer === 0)
      inputNeurons.forEach(neuron => {
        if (Math.random() > 0.7) {
          const neuronConnections = connections.filter(c => c.from === neuron)
          if (neuronConnections.length > 0) {
            const randomConnection = neuronConnections[Math.floor(Math.random() * neuronConnections.length)]
            createPulse(randomConnection)
          }
        }
      })
    }

    // Start pulse generation
    const pulseInterval = setInterval(startPulses, 500)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001

      // Get audio data if playing
      let audioData = null
      let averageFrequency = 0
      if (isPlaying && analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)
        audioData = dataArray
        averageFrequency = dataArray.reduce((a, b) => a + b) / bufferLength / 255
      }

      // Update pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i]
        
        // Modify pulse speed based on audio if playing
        let pulseSpeed = pulse.speed
        if (isPlaying && audioData) {
          pulseSpeed *= (1 + averageFrequency * 2) // Speed up with music intensity
        }
        
        pulse.progress += pulseSpeed

        if (pulse.progress >= 1) {
          // Deliver pulse
          pulse.connection.to.pulseIntensity = pulse.intensity
          
          // Spawn follow-on pulses
          connections
            .filter(c => c.from === pulse.connection.to)
            .forEach(nextConnection => {
              if (Math.random() > 0.6) createPulse(nextConnection)
            })
          // Remove from array
          pulses.splice(i, 1)
        } else {
          const intensity = Math.sin(pulse.progress * Math.PI) * pulse.intensity
          const mat = pulse.connection.material
          mat.color.setHex(0x00FFFF)
          mat.opacity = 0.3 + intensity * 0.7
        }
      }

      // Update neuron colors and intensities
      neurons.forEach(neuron => {
        let baseIntensity = 0.1
        
        // Enhanced pulsing for music neurons when playing
        if (neuron.isMusicNeuron && isPlaying && audioData) {
          baseIntensity += averageFrequency * 0.5
          
          // Add rhythmic pulsing based on selected band
          if (selectedBand) {
            const band = bands.find(b => b.name === selectedBand)
            if (band) {
              const rhythmicPulse = Math.sin(time * 4) * 0.3 // 4 beats per second
              baseIntensity += Math.abs(rhythmicPulse)
              neuron.mesh.material.color.setHex(band.color)
            }
          }
        }
        
        if (neuron.pulseIntensity > 0) {
          neuron.mesh.material.emissiveIntensity = baseIntensity + neuron.pulseIntensity * 0.5
          neuron.pulseIntensity *= 0.95 // Fade out
        } else {
          neuron.mesh.material.emissiveIntensity = baseIntensity
        }

        // Layer-based highlighting
        if (activeLayer !== null && neuron.layer === activeLayer) {
          neuron.mesh.material.emissiveIntensity += 0.3
        }
      })

      // Update band labels
      bandLabels.forEach(labelObj => {
        const { sprite, band } = labelObj
        
        // Highlight selected band
        if (selectedBand === band.name) {
          const pulse = Math.sin(time * 6) * 0.3 + 1 // Pulsing scale
          sprite.scale.set(
            labelObj.originalScale.x * pulse,
            labelObj.originalScale.y * pulse,
            labelObj.originalScale.z
          )
          sprite.material.opacity = 0.8 + Math.sin(time * 4) * 0.2
        } else {
          sprite.scale.set(
            labelObj.originalScale.x,
            labelObj.originalScale.y,
            labelObj.originalScale.z
          )
          sprite.material.opacity = 0.7
        }
      })

      // Rotate the entire network slowly
      scene.rotation.y = time * 0.1
      scene.rotation.x = Math.sin(time * 0.05) * 0.1

      renderer.render(scene, camera)
    }

    animate()
    setupAudio()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      clearInterval(pulseInterval)
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      
      renderer.dispose()
      
      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [activeLayer, selectedBand, isPlaying])

  return (
    <div className="fixed inset-0" style={{ zIndex: 1 }}>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}

