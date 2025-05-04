import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockStepper } from './blocks.js'



export default function Level()
{
    return <>

         <BlockStart position={ [ 0, 0, 20 ] }/>
         <BlockSpinner position={ [ 0, 0, 16 ] }/>
         <BlockLimbo position={ [ 0, 0, 12 ] }/>
         <BlockAxe position={ [ 0, 0, 8 ] }/>
         <BlockStepper position={ [ 0, 0, 4 ] }/>
         <BlockStepper position={ [ 0, 0, 0 ] }/>
        
    </>
}