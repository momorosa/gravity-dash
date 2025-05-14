import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Text3D } from '@react-three/drei'

// Shared geometry and materials - created once, when the file is first loaded for perf optimization
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Define materials for different surfaces and obstacles
const floor1Material = new THREE.MeshStandardMaterial({ color: '#023535'})
const floor2Material = new THREE.MeshStandardMaterial({ color: '#E300FF'})
const obstacleMaterial = new THREE.MeshStandardMaterial({ 
    color: '#0FC2C0',
    emissive: '#0CABA8',
    emissiveIntensity: 2,
    toneMapped: false,
})
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#015958'})

/**
 * BlockStart
 * A simple flat floor block used to mark the start of the level.
 */
export function BlockStart({ position = [ 0, 0, 0 ] })
{
    return <group position= { position }>
        <Float floatIntensity={ 0.25 } rotationIntensity={ 0.25 }>
            <Text
                font="./bebas-neue-v9-latin-regular.woff" 
                scale={ 0.5 }
                maxWidth={ 0.25 }
                lineHeight={ 0.75 }
                textAlign='right'
                position={ [ 0.75, 0.65, 0 ] }
                rotation-y={ - 0.25 }
            >
                Gravity Dash
                <meshBasicMaterial toneMapped ={ false } />
            </Text>
        </Float>
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
    const meshRef = useRef()
    const [isHit, setIsHit] = useState(false)

    // Rotate obstacle
    const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

    useFrame((state) => 
    {
        const time = state.clock.getElapsedTime()
        
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler( 0, time * speed, 0 ))
        
        if (!obstacle.current) return
        obstacle.current.setNextKinematicRotation(rotation)
    })

    // Update material emissive color based on hit
    const material = useMemo(() => obstacleMaterial.clone(), [])
    
    useEffect(() => {
        if (meshRef.current)
        {
            meshRef.current.material.emissive.set(isHit ? '#C23110' : '#0FC2C0')
        }
    }, [isHit])

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
            name="obstacle"
            position={ [ 0, 0.3, 0 ] } 
            restitution={ 0.2 } 
            friction={ 0 }
            onCollisionEnter={() => setIsHit(true)}
            onCollisionExit={() => setIsHit(false)}
        >
            <mesh
                ref={ meshRef }
                geometry={ boxGeometry } 
                material={ material } 
                position={ [ 0, -0.1, 0] } 
                scale={ [ 3.5, 0.3, 0.3 ] } 
                castShadow 
                receiveShadow 
            />
            <CuboidCollider 
                args={[ 3.5 / 2, 0.3 / 2, 0.3 / 2 ]} // Half extents!
                position={[ 0, -0.1, 0 ]}            // Match mesh's local position
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
    const meshRef = useRef()
    const [isHit, setIsHit] = useState(false)

    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

    // Update material emissive color based on hit
    const material = useMemo(() => obstacleMaterial.clone(), [])
    
    useEffect(() => {
        if (meshRef.current)
        {
            meshRef.current.material.emissive.set(isHit ? '#C23110' : '#0FC2C0')
        }
    }, [isHit])

    useFrame((state) => 
    {
        const time = state.clock.getElapsedTime()
        
        const y = Math.sin(time + timeOffset) + 1.15
        if (!obstacle.current) return
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
        name="obstacle"
        position={ [ 0, 0.3, 0 ] } 
        restitution={ 0.2 } 
        friction={ 0 }
        onCollisionEnter={() => setIsHit(true)}
        onCollisionExit={() => setIsHit(false)}
        >
            <mesh
                ref={ meshRef }
                geometry={ boxGeometry } 
                material={ material } 
                position={ [ 0, -0.1, 0] } 
                scale={ [ 3.5, 0.75, 0.3 ] } 
                castShadow 
                receiveShadow 
            />
            <CuboidCollider 
                args={[ 3.5 / 2, 0.75 / 2, 0.3 / 2 ]} // Half extents!
                position={[ 0, -0.1, 0 ]}            // Match mesh's local position
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
    const meshRef = useRef()

    const [isHit, setIsHit] = useState(false)
    const [speed] = useState(() => (Math.random() * 0.5 + 1.75))
    const [offset] = useState(() => Math.random() * Math.PI * 2)

    // Update material emissive color based on hit
    const material = useMemo(() => obstacleMaterial.clone(), [])
    
    useEffect(() => {
        if (meshRef.current)
        {
            meshRef.current.material.emissive.set(isHit ? '#C23110' : '#0FC2C0')
        }
    }, [isHit])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const angle = Math.sin(time * speed + offset) * Math.PI * 0.35 // ~40 deg swing

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, 0, angle)) // Z-axis rotation (pendulum)

        if (!obstacle.current) return
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
                name="obstacle"
                position={ [ 0, 1.5, 0 ] }
                restitution={ 0.2 }
                friction={ 0 }
                onCollisionEnter={() => setIsHit(true)}
                onCollisionExit={() => setIsHit(false)}
            >
                <group>
                    {/* Axe shaft */}
                    <mesh
                        ref={ meshRef }
                        geometry={ boxGeometry }
                        material={ material }
                        scale={ [ 0.2, 1, 0.2 ] }
                        position={ [ 0, -0.5, 0 ] } // centered around pivot
                        castShadow
                    />
                    {/* Axe blade */}
                    <mesh
                        ref={ meshRef }
                        geometry={ boxGeometry }
                        material={ material }
                        scale={ [ 2, 1.2, 0.2 ] }
                        position={ [ 0, -1.1, 0 ] }
                        castShadow
                    />
                </group>
                <CuboidCollider args={[0.1, 0.5, 0.1]} position={[0, -0.5, 0]} />
                <CuboidCollider args={[1, 0.6, 0.1]} position={[0, -1.1, 0]} />
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
    const meshRef = useRef()

    const [isHit, setIsHit] = useState(false)

    // Generate unique speeds and phase offsets for each step on mount
    const [motion] = useState(() =>
        Array.from({ length: 3 }, () => ({
            speed: Math.random() * 0.6 + 2.0,       // random speed between 1.0 and 2.6
            offset: Math.random() * Math.PI * 2     // full sine phase offset
        }))
    )

    const randomHeights = useMemo(() => 
        Array.from({ length: 3 }, () => 0.2 + Math.random() * 0.4), []
    )

    // Update material emissive color based on hit
    const material = useMemo(() => obstacleMaterial.clone(), [])
    
    useEffect(() => {
        if (meshRef.current)
        {
            meshRef.current.material.emissive.set(isHit ? '#C23110' : '#0FC2C0')
        }
    }, [isHit])

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        stepRefs.forEach(( ref, i ) => {

            if (!ref.current) return
            
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
                    name="obstacle"
                    colliders="cuboid"
                    restitution={ 0.2 }
                    friction={ 0 }
                    onCollisionEnter={() => setIsHit(true)}
                    onCollisionExit={() => setIsHit(false)}
                >
                    <mesh
                        ref={ meshRef }
                        geometry={ boxGeometry }
                        material={ material }
                        position={ [ 0, -0.1, 0 ] }
                        scale={ [ 0.8, randomHeights[i], 0.8 ] }
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
        <Float floatIntensity={ 0.25 } rotationIntensity={ 0.25 }>
            <Text
                font="./bebas-neue-v9-latin-regular.woff" 
                scale={ 1.5 }
                maxWidth={ 0.5 }
                textAlign='center'
                position={ [ 0, 1.30, 0 ] }
                rotation-y={ - 0.25 }
                color={'#E300FF'}
            >
                Finish
                <meshBasicMaterial toneMapped ={ false } />
            </Text>
        </Float>
    </group>
}

export function Bounds({ length = 1 })
{
    return <>
        <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
            <mesh
                position={ [ 2.15, 0.75, - (length * 2) +2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                castShadow     
            />
            <mesh
                position={ [ - 2.15, 0.75, - (length * 2) +2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 0.3, 1.5, 4 * length ] }
                receiveShadow   
            />
            <mesh
                position={ [ 0, 0.75, - (length * 4) +2 ] }
                geometry={ boxGeometry }
                material={ wallMaterial }
                scale={ [ 4.6, 1.5, 0.3 ] }
                receiveShadow   
            />
            <CuboidCollider 
                args={ [ 2, 0.1, 2 * length ] } 
                position={ [ 0, - 0.1, - (length * 2) + 2 ] }
                restitution={ 0.2 }
                friction={ 1 }
            />
        </RigidBody>
    </>
}
