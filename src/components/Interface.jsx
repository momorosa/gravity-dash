import { useKeyboardControls } from "@react-three/drei"
import useGame from '../stores/useGame.jsx'

export default function Interface()
{
    const restart = useGame((state) => state.restart )
    const phase = useGame((state) => state.phase )

    // Keyboard input states
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    return <div className="fixed top-0 left-0 w-full h-screen pointer-events-none font-primary">
        {/* Timer Display */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl text-white font-bold flex justify-center items-center w-64 bg-linear-65 from-purple-900 to-red-500 opacity-75 py-4 rounded-full inset-shadow-sm">
            0.00
        </div>

        {/* Restart Button */}
        { phase === 'ended' && <div
            onClick={ restart }
            id="reset-button" 
            className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl text-white font-bold flex justify-center items-center w-80 bg-red-700 py-5 mr-6 pointer-events-auto cursor-pointer rounded-sm"
        >
            Restart
        </div>}

         {/* On-Screen Controls (D-Pad + Jump) */}
        <div className="flex flex-col items-center absolute bottom-24 right-16">
            <div className="flex justify-center">
                <div className={`m-2 bg-white size-16 border-4 border-gray-300 border-solid transition-all duration-200 rounded-sm 
                    ${ forward ? 'opacity-100' : 'opacity-50' }`}>
                </div>
            </div>
            <div className="flex justify-center gap-2">
                <div className={`m-2 bg-white size-16 border-4 border-gray-300 border-solid transition-all duration-200 rounded-sm  
                    ${ leftward ? 'opacity-100' : 'opacity-50' }`}>
                </div>
                <div className={`m-2 bg-white size-16 border-4 border-gray-300 border-solid transition-all duration-200 rounded-sm  
                    ${ backward ? 'opacity-100' : 'opacity-50' }`}>
                </div>
                <div className={`m-2 bg-white size-16 border-4 border-gray-300 border-solid transition-all duration-200 rounded-sm  
                    ${ rightward ? 'opacity-100' : 'opacity-50' }`}>
                </div>
                
            </div>
            <div className="flex justify-center">
                <div className={`m-2 bg-white w-[210px] h-16 border-4 border-gray-300 border-solid transition-all duration-200 rounded-sm  
                    ${ jump ? 'opacity-100' : 'opacity-50' }`}>
                </div>
            </div>
        </div>

        {/* Health Bar (Placeholder) */}
        <div id="controls" className="flex items-center absolute bottom-24 left-16">
            <div id="raw" className="flex justify-center">
                <div className="m-2 bg-white opacity-50 w-64 h-8 border-4 border-gray-300 border-solid rounded-sm">
                    <span className="bg-teal-800 w-64 h-8 z-10"></span>
                </div>
                
            </div>
        </div>

    </div>
}