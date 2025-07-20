import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

const bands = [
  { 
    name: 'Penumbra', 
    color: '#00FFFF',
    description: 'Dark atmospheric soundscapes',
    tracks: [
      'Shadow Realm',
      'Void Walker',
      'Eclipse Dreams'
    ]
  },
  { 
    name: 'Veridian', 
    color: '#6A0DAD',
    description: 'Retro-futuristic beats',
    tracks: [
      'Neon Nights',
      'Cyber Flow',
      'Digital Pulse'
    ]
  },
  { 
    name: 'Mild Fever', 
    color: '#FF1493',
    description: 'Experimental electronic',
    tracks: [
      'Fever Dream',
      'Synthetic Love',
      'Electric Thoughts'
    ]
  }
]

export default function BandSelector({ selectedBand, onBandSelect, isPlaying, onPlayToggle }) {
  const [currentTrack, setCurrentTrack] = useState(0)
  const audioRef = useRef(null)

  // Generate 30-second audio loops using Web Audio API
  const generateAudioLoop = async (bandName, trackName) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create different tones and rhythms for each band
      const createTone = (frequency, duration, startTime) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(frequency, startTime)
        gainNode.gain.setValueAtTime(0.1, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + duration)
      }

      // Different patterns for each band
      const now = audioContext.currentTime
      
      if (bandName === 'Penumbra') {
        // Dark, atmospheric tones
        const frequencies = [110, 146.83, 220, 293.66] // A2, D3, A3, D4
        frequencies.forEach((freq, i) => {
          for (let beat = 0; beat < 8; beat++) {
            createTone(freq * (1 + Math.sin(beat * 0.5) * 0.1), 0.5, now + beat * 0.5 + i * 0.1)
          }
        })
      } else if (bandName === 'Veridian') {
        // Retro-futuristic beats
        const frequencies = [261.63, 329.63, 392, 523.25] // C4, E4, G4, C5
        frequencies.forEach((freq, i) => {
          for (let beat = 0; beat < 16; beat++) {
            if (beat % 4 === 0 || beat % 4 === 2) {
              createTone(freq, 0.2, now + beat * 0.25 + i * 0.05)
            }
          }
        })
      } else if (bandName === 'Mild Fever') {
        // Experimental electronic
        const frequencies = [174.61, 207.65, 246.94, 311.13] // F3, G#3, B3, D#4
        frequencies.forEach((freq, i) => {
          for (let beat = 0; beat < 12; beat++) {
            const modFreq = freq * (1 + Math.sin(beat * 0.8) * 0.3)
            createTone(modFreq, 0.3, now + beat * 0.4 + i * 0.08)
          }
        })
      }
      
      return audioContext
    } catch (error) {
      console.error('Audio generation failed:', error)
      return null
    }
  }

  const handlePlay = async () => {
    if (!selectedBand) return
    
    if (isPlaying) {
      onPlayToggle(false)
    } else {
      const audioContext = await generateAudioLoop(selectedBand, bands.find(b => b.name === selectedBand)?.tracks[currentTrack])
      if (audioContext) {
        onPlayToggle(true)
        
        // Stop after 30 seconds
        setTimeout(() => {
          onPlayToggle(false)
          audioContext.close()
        }, 30000)
      }
    }
  }

  const nextTrack = () => {
    if (selectedBand) {
      const band = bands.find(b => b.name === selectedBand)
      if (band) {
        setCurrentTrack((prev) => (prev + 1) % band.tracks.length)
      }
    }
  }

  return (
    <div className="fixed bottom-8 left-8 right-8 z-20">
      <div className="bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-cyan-400 text-lg font-bold mb-4" style={{ fontFamily: 'Orbitron, monospace' }}>
          Neural Music Generation
        </h3>
        
        {/* Band Selection */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {bands.map((band) => (
            <button
              key={band.name}
              onClick={() => onBandSelect(band.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                selectedBand === band.name
                  ? 'border-current bg-current/20 scale-105'
                  : 'border-gray-600 hover:border-current hover:bg-current/10'
              }`}
              style={{ 
                color: band.color,
                borderColor: selectedBand === band.name ? band.color : '#4B5563'
              }}
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {band.name}
                </h4>
                <p className="text-xs opacity-80">{band.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Track Controls */}
        {selectedBand && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Now Playing:</p>
              <p className="text-white font-semibold" style={{ fontFamily: 'Orbitron, monospace' }}>
                {bands.find(b => b.name === selectedBand)?.tracks[currentTrack]}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={nextTrack}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
              >
                Next Track
              </button>
              
              <button
                onClick={handlePlay}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Stop' : 'Play 30s Loop'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Neural Activity Indicator */}
        {isPlaying && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-green-400 text-sm">
                Neural network pulsing to {selectedBand} rhythms...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

