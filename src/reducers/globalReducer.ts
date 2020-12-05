import { globalState} from '../context/globalContext';

const reducer = (state: globalState, action: { type: string, payload: any }): globalState => {
    if (action.type !== 'LOGIN') console.log(state)
    if (action.type !== 'LOGIN') console.log(action)
    switch (action.type) {
        case 'START_IPFS': {
            return { ...state, ipfs: action.payload.ipfs }
        }
        case 'LOGIN':
            return { ...state, username: action.payload.username, password: action.payload.password, keyPair: action.payload.keyPair }
        case 'SET_KEYPAIR':
            return { ...state, keyPair: action.payload.keyPair, username: '', password: '' }
        case 'START_ORBIT':
            return { ...state, orbit: action.payload.orbit }
        case 'SET_LOCATION':
            return { ...state, location: action.payload.location }
        default:
            return state;
    }
}

export default reducer