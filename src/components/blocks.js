import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

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

