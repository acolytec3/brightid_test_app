import { createContext } from 'react'
import EventStore from 'orbit-db-eventstore';

export type globalState = {
    ipfs: any,
    username: string,
    password: string,
    keyPair?: any,
    orbit?: EventStore<any>,
    location: {
        lat: string,
        lon: string
    }
}

export const initialState = {
    ipfs: null,
    username: '',
    password: '',
    location: {
        lat: '',
        lon: ''
    }
}

const GlobalContext = createContext<{ state: globalState, dispatch: React.Dispatch<any> }>({ state: initialState, dispatch: () => null })

export { GlobalContext as default }