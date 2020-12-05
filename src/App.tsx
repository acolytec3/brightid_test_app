
import React from 'react';
import { ThemeProvider, Image, Stack, Spinner, Button, Input, Tabs, TabList, TabPanel, TabPanels, Tab, Text } from '@chakra-ui/core';
import Ipfs from 'ipfs'
import orbitdb from 'orbit-db'
import PeerID from 'peer-id'
import EventStore from 'orbit-db-eventstore';
import crypto from 'libp2p-crypto'
//@ts-ignore
import { getKeyPairFromSeed } from 'human-crypto-keys'
import PictureBox from './components/pictureBox'
import FileUploader from './components/fileUpload'
import './App.css';
import Gallery from './components/gallery';

//@ts-ignore
window.LOG = 'orbit*'

interface IContextProps {
  state: globalState;
  dispatch: ({ type }: { type: any }) => void;
}

type globalState = {
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

const initialState = {
  ipfs: null,
  username: '',
  password: '',
  location: {
    lat: '',
    lon: ''
  }
}

export const GlobalContext = React.createContext({} as IContextProps)

const reducer = (state: globalState, action: any): globalState => {
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


function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [loading, setLoading] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const [loadingMessage, setMessage] = React.useState('')

  const startUp = async (state: globalState, dispatch: any) => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch({ type: 'SET_LOCATION', payload: { location: { lat: position.coords.latitude, lon: position.coords.longitude } } })
      }, dispatch({ type: 'SET_LOCATION', payload: { location: { lat: '0', lon: '0' } } }))
    }
    try {
       setMessage('Deriving Keys')
      let salt = "ihatemakinguplongpasswords"
      let buffer = new TextEncoder().encode(state.username + state.password + salt)
      let keyPair = await getKeyPairFromSeed(buffer, 'rsa', { privateKeyFormat: 'raw-pem', publicKeyFormat: 'raw-pem' });
      dispatch({ type: 'SET_KEYPAIR', payload: { keyPair: keyPair } })
      setMessage('Connecting to IPFS')
      let privateKey = await crypto.keys.import(keyPair.privateKey, '');
      let peer = await PeerID.createFromPrivKey(crypto.keys.marshalPrivateKey(privateKey, "rsa"))
      //@ts-ignore
      let ipfs = await Ipfs.create(
        {
          PeerId: peer,
          relay: { enabled: true, hop: { enabled: true, active: true } },
          repo: "ipfs-inside-joke",
          config: {
            Addresses: {
              Swarm: ["/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
                "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
              ]
            },
      
          }
        })
      ipfs.libp2p.on("peer:connect", (connection: any) => console.log(`connected to ${connection.remotePeer.toB58String()}`))
      console.log('IPFS Started')
      setMessage('Connecting to Orbit-DB')
      let orbit = await orbitdb.createInstance(ipfs)
      //@ts-ignore
      let dbAddr = await orbit.determineAddress('monkey-knuckles', 'eventlog', { accessController: { write: ['*'] } })
      console.log('address is', dbAddr)
      let events: EventStore<any>
      if (dbAddr) {
        events = (await orbit.open(dbAddr)) as EventStore<any>;
        console.log('found Db!', events)
      }
      else
        events = await orbit.eventlog<any>('monkey-knuckles',{})
      await events.load()
      events.events.on('replicate', (addr) => console.log('Replicating DB to ', addr))
      events.events.on('peer', (peer) => console.log('Found a peer with our DB', peer))
      events.events.on('replicate.progress', (msg) => console.log(msg))
      events.events.on('replicated', (msg) => console.log('Replicating DB from', msg))
      console.log('Orbit DB initiated')
      dispatch({ type: 'START_IPFS', payload: { ipfs: ipfs } })
      dispatch({ type: 'START_ORBIT', payload: { orbit: events } })
      setLoading(false)
      setLoaded(true)
      setTimeout(() => {ipfs.swarm.connect('/ip4/172.31.1.4/tcp/4003/ws/p2p/QmaSDYtcdw1fuK4DGVSF2zK1QxNTUwM9GVM458AG9SFekE'); console.log('dialing')},3000)
    } catch (error) {
      console.error('IPFS init error:', error)
      setLoading(false) 
    }

  }

  const Login = () => {
    const [username, setName] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleLogin = () => {
      //@ts-ignore
      dispatch({ type: 'LOGIN', payload: { username: username, password: password } })
      startUp(state, dispatch);
    }
    return (
      <Stack align="center" >
        <Input w="200px" isRequired placeholder="Username" value={username} onChange={(evt: any) => setName(evt.target.value)} />
        <Input w="200px" isRequired placeholder="Password" type="password" value={password} onChange={(evt: any) => setPassword(evt.target.value)} />
        <Button w="150px" onClick={handleLogin}>Login</Button>
      </Stack>
    )
  }

  const value = { state, dispatch }
  return (
    <ThemeProvider>
      <GlobalContext.Provider value={value}>
        <Stack align="center" w="100%">
          <Stack align="center">
          </Stack>
          {(!state.keyPair && state.username === '') && <Login />}
          {loading && <Stack align="center" color="white">
            <Spinner />
            <Text>{loadingMessage}</Text>
            </Stack>}

          {loaded && <Tabs isFitted align="center" size="lg">
            <TabPanels>
              <TabPanel>
                <PictureBox />
              </TabPanel>
              <TabPanel>
                <FileUploader />
              </TabPanel>
              <TabPanel>
                <Gallery />
              </TabPanel>
            </TabPanels>
            <TabList position="fixed" bottom="0px" left="0px" w="100vw">
              <Tab>
                Camera
              </Tab>
              <Tab>
                Media
              </Tab>
              <Tab>
                Gallery
              </Tab>
            </TabList>
          </Tabs>}
        </Stack>
      </GlobalContext.Provider>
    </ThemeProvider>
  )
}

export default App;

