import React from 'react'
import { Button, Stack, Box, Image, Text, useDisclosure, 
    Modal, ModalBody, ModalContent, ModalOverlay, ModalCloseButton, ModalHeader, SimpleGrid, Flex } from '@chakra-ui/react';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import GlobalContext from '../context/globalContext'
import { LatLngTuple } from 'leaflet'

const Gallery = () => {
    const state = React.useContext(GlobalContext)
    const [gallery, showGallery] = React.useState(false)
    const {isOpen, onOpen, onClose } = useDisclosure();
    const [activeMarker, setActive] = React.useState(null as any)
    const [location, setLoc] = React.useState([parseFloat(state.state.location.lat),parseFloat(state.state.location.lon)] as LatLngTuple)

    const handleClick = () => {
        showGallery(!gallery)

    }

    const MyMap = () => {
        let media = state.state.orbit!.iterator({ limit: -1 }).collect().filter((picture) => picture.payload.value.lat !== undefined)
        return (
            <Map center={location} zoom={12} style={{ height: "60vh" }} >
                 {media.map((picture: any) => (
                <Marker key={picture.hash}
                    position={[picture.payload.value.lat, picture.payload.value.lon]}
                    onClick={() => setActive(picture)}
                />))}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {activeMarker && <Popup position={[activeMarker.payload.value.lat, activeMarker.payload.value.lon]}
                onClose={() => setActive(null)}>
                <Stack key={activeMarker.clock.toString()} isInline>
                    <Image key={activeMarker.hash}
                        width="100px"
                        objectFit="cover"
                        src={`https://gateway.ipfs.io/ipfs/${activeMarker.payload.value.hash}`}
                        alt="Unknown"
                    />
                    {activeMarker.payload.value.username && <Text color="white" key={activeMarker.hash + '1'}>Posted by {activeMarker.payload.value.username}</Text>}
                </Stack>
            </Popup>}
                
            </Map>)
    }

    const PictureWall = () => {
        let media = state.state.orbit!.iterator({ limit: -1 }).collect()
        return (<SimpleGrid minChildWidth="100px" spacingX="20px" spacingY="10px">
            {media.map((picture) => {
                return <Stack isInline key={picture.clock.toString()} spacing={1}>
                    <Image key={picture.hash}
                        width="100px"
                        objectFit="cover"
                        src={`https://gateway.ipfs.io/ipfs/${picture.payload.value.hash}`}
                        alt="Unknown"
                    />
                    {picture.payload.value.username && <Text color="white" key={picture.hash + '1'}>Posted by {picture.payload.value.username}</Text>}
                </Stack>
            })}
        </SimpleGrid>)
    }
    return (
        <Box>
            <Flex align="center" direction="column" >
                <Stack isInline><Button mw="50vw" onClick={handleClick}>View Posted Media</Button>
                <Button w="200px" onClick={onOpen}>Open Map</Button></Stack>
                {gallery && <PictureWall />}
                <Modal isOpen={isOpen} onClose={onClose} isCentered size="100%">
                    <ModalOverlay />
                    <ModalHeader>Reported Activity</ModalHeader>
                    <ModalCloseButton />
                    <ModalContent>
                        <ModalBody>
                            <MyMap />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Flex>

        </Box>
    )
}

export default Gallery