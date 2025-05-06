import { useMemo } from 'react'
import { BlockStart, BlockSpinner, BlockLimbo, BlockAxe, BlockStepper, BlockEnd, Bounds } from './blocks.js'

export default function Level({  count = 7, types = [ BlockSpinner, BlockLimbo, BlockAxe, BlockStepper ] })
{
    const blocks = useMemo(() => 
    {
        const blocks = []
        
        for (let i = 0; i < count; i++)
        {
            const type = types[ Math.floor(Math.random() * types.length) ]
            blocks.push(type)
        }
        return blocks
    }, [ count, types ])

    return <>
        <BlockStart position={ [ 0, 0, 0 ] }/>
        { blocks.map((Block, index) => <Block key={ index } position={ [ 0, 0, -(index + 1) * 4 ] } /> )}
        <BlockEnd position={ [ 0, 0, -(count + 1) * 4 ] } />

        <Bounds length={ count + 2 }/>
    </>
}