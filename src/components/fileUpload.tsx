import React, { ChangeEvent } from 'react'
import { Button, Stack, Box, useToast, Input } from '@chakra-ui/core';
import { GlobalContext } from '../App'

const FileUploader = () => {
    const state = React.useContext(GlobalContext)
    const fileRef = React.useRef<HTMLInputElement>(null)
    const [lat, setLat] = React.useState(state.state.location.lat)
    const [lon, setLon] = React.useState(state.state.location.lon)
    const [photo, setPhoto] = React.useState(undefined as unknown)
    const toast = useToast();

    const handleClick = () => {
        if (fileRef.current) fileRef.current.click()
    }

    const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
        let files = evt.target.files
        if (files && files.length > 0) setPhoto(files[0])
    }

    const uploadPhoto = async () => {
        try {
            let blob = photo
            let latitude = (lat !== '') ? lat : state.state.location.lat
            let longitude = (lon !== '') ? lon : state.state.location.lon
            if (state.state.ipfs) {
                let added = await state.state.ipfs.add(blob, {
                    progress: (prog: any) => console.log(`received: ${prog}`)
                })
                console.log(added)
                let hash = await state.state.orbit!.add({ 'hash': added.path, 'username': state.state.username, 'lat': latitude, 'lon': longitude })
                console.log('Lets verify the hash')
                console.log(state.state.orbit!.get(hash))
                toast({
                    position: "top",
                    status: 'success',
                    title: 'Media uploaded',
                    description: 'You should see your media in the Gallery shortly',
                    duration: 5000,
                })
            }
        } catch (error) {
            console.error(error);
            toast({
                position: "top",
                status: 'error',
                title: 'Something went wrong',
                description: 'Please try again',
                duration: 5000,
            })
        }
        setPhoto(undefined)
    }
    return (
        <Box>
            <Stack align="center">
                <Stack isInline>
                    <Button w="200px" onClick={handleClick}>Select Media</Button>
                    <Button w="200px" isDisabled={!photo} onClick={uploadPhoto}>Upload Media</Button>
                </Stack>
                <input ref={fileRef} type="file" id="filePicker" name='filePicker' style={{ "display": "none" }} onChange={handleUpload} />
                <Stack>
                    <Input placeholder="Latitude" defaultValue={state.state.location.lat} onChange={(evt: any) => setLat(evt.target.value)} />
                    <Input placeholder="Longitude" defaultValue={state.state.location.lon}onChange={(evt: any) => setLon(evt.target.value)} />
                </Stack>
            </Stack>
        </Box>
    )
}

export default FileUploader