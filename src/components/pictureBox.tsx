import React from 'react';
import {
    Text, Image,
    Button, Stack, useToast, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, 
} from '@chakra-ui/core';
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { GlobalContext } from '../App'

const PictureBox = () => {
    const state = React.useContext(GlobalContext)
    const [photo, setPhoto] = React.useState('')

    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast()

    function dataURItoBlob(dataURI: string) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }

        var dataView = new DataView(arrayBuffer);
        var blob = new Blob([dataView], { type: mimeString });
        return blob;
    }

    const handleTakePhoto = async (dataUri: string) => {
        setPhoto(dataUri)
        onClose()
    }

    const uploadPhoto = async (lat: string, lon: string) => {
        try {
            let blob = dataURItoBlob(photo)
            if (state.state.ipfs) {
                let added = await state.state.ipfs.add(blob, {
                    progress: (prog: any) => console.log(`received: ${prog}`)
                })
                console.log(added)
                let hash = await state.state.orbit!.add({ 'hash': added.path, 'username': state.state.username, 'lat': lat, 'lon': lon })
                console.log('Lets verify the hash')
                console.log(state.state.orbit!.get(hash))
                toast({
                    position: "top",
                    status: 'success',
                    title: 'Media uploaded',
                    description: 'You should see your media in the Gallery shortly',
                    duration: 5000,
                })
                setPhoto('')
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
    }

    return (
        <Stack align="center">

            {(photo === '') ? <Button alignSelf="center" width="200px" onClick={onOpen} isDisabled={!navigator.mediaDevices}>Take Picture</Button>
                :
                <Stack maxWidth="100vh" align="center">
                    <Image maxWidth="100px" src={photo} />
                    {(state.state.location && state.state.location.lat !== '') &&
                        <Text color="white">Latitude: {state.state.location!.lat}, Longitude: {state.state.location.lon}</Text>}
                    <Button alignSelf="center" width="200px" onClick={() => {
                        let lat: string
                        let lon: string
                        if (state.state.location) {
                            lat = state.state.location.lat
                            lon = state.state.location.lon
                        }
                        else { lat = ''; lon = '' }
                        uploadPhoto(lat, lon)
                    }}>Upload Picture</Button>
                </Stack>}
                {!navigator.mediaDevices && <Text color="white">The camera is unavailable in this browser</Text>}

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="100%">
                <ModalOverlay />
                <ModalContent>
                    <ModalBody>
                        <Camera
                            onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                            onCameraError={(error) => { alert(error.toString()); }}
                            idealFacingMode={FACING_MODES.ENVIRONMENT}
                            isImageMirror={false}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Stack>
    )
}

export default PictureBox