import { Physics } from '@react-three/rapier'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

import Lights from '../components/Lights.jsx'
import Level from '../components/Level.jsx'
import Player from '../components/Player.jsx'
import ConfettiParticles from '../components/ConfettiParticles.jsx'
import useGame from '../stores/useGame.jsx'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount )
    const blocksSeed = useGame((state) => state.blocksSeed )

    const phase = useGame((state) => state.phase )

    return <>
        
        <color args={ [ '#023535' ] } attach="background" />
        <Physics debug={ false }>
            <Lights />
            <Level count={ blocksCount } seed={ blocksSeed} />
            <Player />
        </Physics>
        {/* Postprocessing Effects */}
        <EffectComposer disableNormalPass>
            <Bloom 
                intensity={ 0.8 }
                luminanceThreshold={ 0.3 }
                luminanceSmoothing={ 0.9 }
                mipmapBlur
            />
        </EffectComposer>
        {phase === 'ended' && <ConfettiParticles position={[0, 1, -((blocksCount + 1) * 4)]} />}
    </>
}