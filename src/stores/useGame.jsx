import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
    {
        return {
            blocksCount: 10,
            blocksSeed: 0,

            /**
             * Time
             */  
            startTime: 0,

            /**
             * Health
             */ 
            // existing state
            health: 10,

            reduceHealth: ( amount = 0.5 ) => 
            {
                set((state) => 
                {
                    return { health: Math.max(0, state.health - amount ) }
                })
            },

            /**
             * Phases
             */
            phase: 'ready',
        
            start: () =>
            {
                set((state) =>
                {
                    if(state.phase === 'ready')
                        return { 
                            phase: 'playing', 
                            startTime: Date.now() + 7000, 
                            health: 10
                        }
        
                    return {}
                })
            },
        
            restart: () =>
            {
                set((state) =>
                {
                    if(state.phase === 'playing' || state.phase === 'ended' || state.health === 0)
                        return { phase: 'ready', blocksSeed: Math.random(), health: 10 }
        
                    return {}
                })
            },
        
            end: () =>
            {
                set((state) =>
                {
                    if(state.phase === 'playing')
                        return { phase: 'ended', endTime: Date.now() }
        
                    return {}
                })
            },    
        }
    }
))