import { Physics } from '@react-three/rapier'
import { Stage } from '@react-three/drei'
import Lights from '../components/Lights.jsx'
import Level from '../components/Level.jsx'
import Player from '../components/Player.jsx'
import useGame from '../stores/useGame.jsx'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount )
    const blocksSeed = useGame((state) => state.blocksSeed )

    return <>
        <color args={ [ '#212121' ] } attach="background" />
        <Physics debug={ false }>
            <Lights />
            <Level count={ blocksCount } seed={ blocksSeed} />
            <Player />
        </Physics>
    </>
}