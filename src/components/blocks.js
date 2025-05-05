import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'

// Shared geometry and materials - created once, when the file is first loaded for perf optimization
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Define materials for different surfaces and obstacles
const floor1Material = new THREE.MeshStandardMaterial({ color: '#FF0000', roughness: 0.2, metalness: 0.2 })
const floor2Material = new THREE.MeshStandardMaterial({ color: '#E300FF', roughness: 0.2, metalness: 0.2 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: '#910000'})
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#910000'})

/**
 * BlockStart
 * A simple flat floor block used to mark the start of the level.
 */
export function BlockStart({ position = [ 0, 0, 0 ] })
{
    return <group position= { position }>
        <mesh 
            geometry={ boxGeometry } 
            material={ floor2Material} 
            position={ [ 0, -0.1, 0] } 
            scale={ [ 4, 0.2, 4] } 
            receiveShadow 
        />
    </group>
}

/**
 * BlockSpinner
 * A rotating obstacle block. The rotation speed and direction are randomized using useState.
 * This ensures variation across multiple BlockSpinner instances in the level.
 */
export function BlockSpinner({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => 
    {
        const time = state.clock.getElapsedTime()
        
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler( 0, time * speed, 0 ))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position= { position }>
        {/* Static floor */}
        <mesh 
            geometry={ boxGeometry } 
            material={ floor1Material} 
            position={ [ 0, -0.1, 0] } 
            scale={ [ 4, 0.2, 4] } 
            receiveShadow 
        />
        {/* Kinematic rotating obstacle */}
        <RigidBody 
        ref={ obstacle } 
        type="kinematicPosition" 
        position={ [ 0, 0.3, 0 ] } 
        restitution={ 0.2 } 
        friction={ 0 }
        >
            <mesh 
                geometry={ boxGeometry } 
                material={ obstacleMaterial } 
                position={ [ 0, -0.1, 0] } 
                scale={ [ 3.5, 0.3, 0.3 ] } 
                castShadow 
                receiveShadow 
            />
        </RigidBody>
    </group>
}

/**
 * BlockLimbo
 * A vertically oscillating obstacle (like a limbo bar).
 * Uses a sine wave to move the obstacle up and down continuously.
 * A random phase offset ensures variation when used multiple times in a level.
 */
export function BlockLimbo({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => 
    {
        const time = state.clock.getElapsedTime()
        
        const y = Math.sin(time + timeOffset) + 1.15
        obstacle.current.setNextKinematicTranslation( { x: position[0], y: position[1] + y, z: position[2] } )
    })

    return <group position= { position }>
        {/* Static floor */}
        <mesh 
            geometry={ boxGeometry } 
            material={ floor1Material} 
            position={ [ 0, -0.1, 0] } 
            scale={ [ 4, 0.2, 4] } 
            receiveShadow 
        />
        {/* Kinematic rotating obstacle */}
        <RigidBody 
        ref={ obstacle } 
        type="kinematicPosition" 
        position={ [ 0, 0.3, 0 ] } 
        restitution={ 0.2 } 
        friction={ 0 }
        >
            <mesh 
                geometry={ boxGeometry } 
                material={ obstacleMaterial } 
                position={ [ 0, -0.1, 0] } 
                scale={ [ 3.5, 1.25, 0.3 ] } 
                castShadow 
                receiveShadow 
            />
        </RigidBody>
    </group>
}

/**
 * BlockAxe (Updated)
 * A swinging axe made of a vertical shaft and horizontal blade.
 * Rotates left and right like a pendulum around the Z-axis.
 */
export function BlockAxe({ position = [0, 0, 0] }) {
    const obstacle = useRef()
    const [speed] = useState(() => (Math.random() * 0.5 + 1.75))
    const [offset] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const angle = Math.sin(time * speed + offset) * Math.PI * 0.35 // ~40 deg swing

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, 0, angle)) // Z-axis rotation (pendulum)

        obstacle.current.setNextKinematicRotation(rotation)
    })

    return (
        <group position={ position }>
            {/* Static floor */}
            <mesh
                geometry={ boxGeometry }
                material={ floor1Material }
                position={ [ 0, -0.1, 0 ] }
                scale={ [ 4, 0.2, 4 ] }
                receiveShadow
            />

            {/* Swinging axe group */}
            <RigidBody
                ref={ obstacle }
                type="kinematicPosition"
                position={ [ 0, 1.5, 0 ] }
                restitution={ 0.2 }
                friction={ 0 }
            >
                <group>
                    {/* Axe shaft */}
                    <mesh
                        geometry={ boxGeometry }
                        material={ obstacleMaterial }
                        scale={ [ 0.2, 1, 0.2 ] }
                        position={ [ 0, -0.5, 0 ] } // centered around pivot
                        castShadow
                    />
                    {/* Axe blade */}
                    <mesh
                        geometry={ boxGeometry }
                        material={ obstacleMaterial }
                        scale={ [ 1.5, 0.7, 0.2 ] }
                        position={ [ 0, -1.1, 0 ] }
                        castShadow
                    />
                </group>
            </RigidBody>
        </group>
    )
}

/**
 * BlockStepper
 * A sequence of stepping platforms that move vertically at random speeds and time offsets.
 * Each BlockStepper instance generates a unique rhythm for its three steps.
 */

export function BlockStepper({ position }) {
    const stepRefs = [ useRef(), useRef(), useRef() ]

    // Generate unique speeds and phase offsets for each step on mount
    const [motion] = useState(() =>
        Array.from({ length: 3 }, () => ({
            speed: Math.random() * 0.6 + 1.0,       // random speed between 1.0 and 1.6
            offset: Math.random() * Math.PI * 2     // full sine phase offset
        }))
    )

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        stepRefs.forEach(( ref, i ) => {
            const { speed, offset } = motion[i]
            const y = Math.sin( time * speed + offset ) * 0.5 + 0.4
            ref.current.setNextKinematicTranslation({
                x: position[0] + (i - 1) * 1.2,
                y: position[1] + y,
                z: position[2],
            })
        })
    })

    return (
        <group position={ position }>
            {/* Static floor */}
            <mesh
                geometry={ boxGeometry }
                material={ floor1Material }
                position={ [ 0, -0.1, 0 ] }
                scale={ [ 4, 0.2, 4 ] }
                receiveShadow
            />
            {/* Animated stepping platforms */}
            {stepRefs.map((ref, i) => (
                <RigidBody
                    key={ i }
                    ref={ ref }
                    type="kinematicPosition"
                    restitution={ 0.2 }
                    friction={ 0 }
                >
                    <mesh
                        geometry={ boxGeometry }
                        material={ obstacleMaterial }
                        position={ [ 0, -0.1, 0 ] }
                        scale={ [ 0.8, 0.2, 0.8 ] }
                        castShadow
                        receiveShadow
                    />
                </RigidBody>
            ))}
        </group>
    )
}

/**
 * BlockEnd
 * A simple flat floor block used to mark the end of the level.
 */
export function BlockEnd({ position = [ 0, 0, 0 ] })
{
    return <group position= { position }>
        {/* Static floor */}
        <mesh 
            geometry={ boxGeometry } 
            material={ floor2Material} 
            position={ [ 0, 0, 0] } 
            scale={ [ 4, 0.2, 4] } 
            receiveShadow 
        />
        <RigidBody  
        type="fixed" 
        position={ [ - 1.6, 0.25, - 1.25 ] } 
        restitution={ 0.2 } 
        friction={ 0 }
        >
            <Text3D
                curveSegments={ 32 }
                bevelEnabled
                bevelSize={ 0.04 }
                bevelThickness={ 0.1 }
                height={ 0.5 }
                lineHeight={ 0.5 }
                letterSpacing={ 0.06 }
                size={ 0.6 }
                font="../Montserrat_Bold.json"
                castShadow
                receiveShadow
            >
                {`FINISH`}
                <meshStandardMaterial color={ '#E300FF'} roughness={ 0.0 } metalness={ 0.2 } />
            </Text3D>

        </RigidBody>
    </group>
}
