import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Lights from '../components/Lights.jsx'
import Level from '../components/Level.jsx'
import Player from '../components/Player.jsx'

export default function Experience()
{
    return <>

        <OrbitControls makeDefault />
        <Physics debug={ false }>
            <Lights />
            <Level />
            <Player />
        </Physics>
    </>
}