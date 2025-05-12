// components/ConfettiParticles.jsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function ConfettiParticles({ position = [0, 2, 0], count = 200, radius = 1.5, size = 0.2, spread = 3.0, burstSpeed = 3.5, gravity = 3.2, opacity = 0.85 }) {
    // const { count, radius, size, spread, burstSpeed, gravity, opacity } = useControls('Confetti', {
    //   count: { value: 150, min: 10, max: 500 },
    //   radius: { value: 1.5, min: 0.5, max: 5 },
    //   size: { value: 0.12, min: 0.01, max: 0.3 },
    //   spread: { value: 2, min: 0.2, max: 5 },
    //   burstSpeed: { value: 2, min: 0.5, max: 5 },
    //   gravity: { value: 9.8, min: 0, max: 30 },
    //   opacity: { value: 0.9, min: 0.1, max: 1 },
    // }) 
  
    const mesh = useRef()

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorOptions = ['#00FAAD', '#D400FA', '#FA3600', '#9437A5', '#3D7A68']
    const colorVec = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Random position within a sphere
      const r = radius * Math.random()
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.cos(phi)
      positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta)

      // Random velocity
      velocities[i3 + 0] = (Math.random() - 0.5) * spread
      velocities[i3 + 1] = Math.random() * burstSpeed
      velocities[i3 + 2] = (Math.random() - 0.5) * spread

      // Random color
      colorVec.set(colorOptions[Math.floor(Math.random() * colorOptions.length)])
      colors[i3 + 0] = colorVec.r
      colors[i3 + 1] = colorVec.g
      colors[i3 + 2] = colorVec.b
    }

    return { positions, velocities, colors }
  }, [count, radius])

  const positionAttribute = useRef(new THREE.BufferAttribute(positions, 3))

  useFrame((_, delta) => {
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      velocities[i3 + 1] -= gravity * delta // gravity

      positions[i3 + 0] += velocities[i3 + 0] * delta
      positions[i3 + 1] += velocities[i3 + 1] * delta
      positions[i3 + 2] += velocities[i3 + 2] * delta
    }
    positionAttribute.current.needsUpdate = true
  })


  return (
    <Billboard position={position} follow lockZ>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            ref={positionAttribute}
            array={positions}
            count={positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
            size={size}
            opacity={opacity}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
        />
      </points>
    </Billboard>
  )
}
