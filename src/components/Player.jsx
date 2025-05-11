import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import useGame from '../stores/useGame.jsx'


export default function Player()
{
    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const { rapier, world } = useRapier()

    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    const jump = () =>
    {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if(!body.current) return
        
        if(hit.timeOfImpact < 0.15)
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }

    const reset = () =>
    {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 })
        body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() => 
    {
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (phase) => 
            {
                if(phase === 'ready')
                    reset()
            }
        )

        const unsubscribeJump = subscribeKeys(
            // Selector - listening to the jump/spacebar
            (state) => state.jump,
            (value) => 
            { 
                if(value) 
                    jump()                 
            }
        )

        const unsubscribeAny = subscribeKeys(
            () =>
            {
                start()
            }
        )

        return () =>
        {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
        }
    }, [])

    useFrame((state, delta) => 
    {
        /**
         * Controls
         * Apply directional impulse and torque based on keyboard input.
         */
        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 1 * delta
        const torqueStrength = 1 * delta

        if(forward)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if(rightward)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }
        
        if(backward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
            
        if(leftward)
        {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        if(!body.current) return

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)  

        /**
         * Camera
         * Smoothly interpolate camera position and target toward the player.
         */
        const bodyPosition = body.current.translation()

        // Desired camera position (offset behind and above the player)
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        // Where the camera should look (slightly above the player’s center)
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        // Smooth camera movement using linear interpolation (lerp)
        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        // Apply smoothed position and target to the actual camera
        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
         * Phases
         */

        if(bodyPosition.z < - (blocksCount * 4 + 2))
            end()

        if(bodyPosition.y < - 4)
            restart()
    })

    return <RigidBody 
        ref={ body } 
        canSleep={ false } 
        colliders="ball" 
        restitution={ 0.2 } 
        friction={ 1 } 
        linearDamping={ 0.5 }
        angularDamping={ 0.5 }
        position={ [ 0, 1, 0] } 
    >
        <mesh castShadow>
            <icosahedronGeometry args={ [ 0.3, 1 ] } />
            <meshStandardMaterial flatShading color="#000000" roughness={ 0.7 } metalness={ 0.2 }/>
        </mesh>
    </RigidBody>
   
}