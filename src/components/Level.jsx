import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockStepper, BlockEnd } from './blocks.js'



export default function Level()
{
    return <>
         <BlockStart position={ [ 0, 0, 20 ] }/>
         <BlockSpinner position={ [ 0, 0, 16 ] }/>
         <BlockLimbo position={ [ 0, 0, 12 ] }/>
         <BlockAxe position={ [ 0, 0, 8 ] }/>
         <BlockStepper position={ [ 0, 0, 4 ] }/>
         <BlockEnd position={ [ 0, 0, 0 ] }/>      
    </>
}