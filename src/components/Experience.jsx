import { Physics } from '@react-three/rapier'
import Lights from '../components/Lights.jsx'
import Level from '../components/Level.jsx'
import Player from '../components/Player.jsx'
import useGame from '../stores/useGame.jsx'

export default function Experience()
{
    const blocksCount = useGame((state) => state.blocksCount )

    return <>
        <Physics debug={ false }>
            <Lights />
            <Level count={ blocksCount } />
            <Player />
        </Physics>
    </>
}