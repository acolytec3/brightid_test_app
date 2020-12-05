import React from 'react'
import { Button, Stack, Input} from '@chakra-ui/react';
import GlobalContext from '../context/globalContext'


const Login = (startup: any) => {
    const state = React.useContext(GlobalContext)
    const [username, setName] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleLogin = () => {
        //@ts-ignore
        state.dispatch({ type: 'LOGIN', payload: { username: username, password: password}})
        console.log(startup)
        startup.startup();
    }
    return (
        <Stack align="center" >
                <Input w="200px" isRequired placeholder="Username" value={username} onChange={(evt: any) => setName(evt.target.value)} />
                <Input w="200px" isRequired placeholder="Password" type="password" value={password} onChange={(evt: any) => setPassword(evt.target.value)} />
            <Button w="150px" onClick={handleLogin}>Login</Button>
        </Stack>
    )
}

export default Login;
