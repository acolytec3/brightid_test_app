import { Box, Button, ChakraProvider, Code, Flex, Heading, HStack, Input, Link, Skeleton, Text, Textarea, VStack } from '@chakra-ui/react';
import { generateDeeplink, putTestingBlock, removeTestingBlock, sponsor, verifyContextId, availableSponsorships } from 'brightid_sdk';
import QRCode from 'qrcode.react';
import React from 'react';
import { v4 } from 'uuid';

function App() {
  const [verified, setVerified] = React.useState<any>()
  const [privateKey, setPrivateKey] = React.useState<string>()
  const [testingKey, setTestingKey] = React.useState<string>()
  const [context, setContext] = React.useState<string>()
  const [contextId, setContextId] = React.useState<string>()
  const [deeplink, setDeeplink] = React.useState<string>()
  const [sponsorships, setSponsorships] = React.useState<number>(0)
  const [res, setRes] = React.useState<string>()

  const generateContextId = () => {
    setContextId(v4())
  }

  const verify = async () => {
    let res = await verifyContextId(context!, contextId!)
    setVerified(res)
    setRes(JSON.stringify(res, null, 2))
    console.log(res)
  }

  const trySponsor = async () => {
    let res = await sponsor(privateKey!, context!, contextId!)
    setRes(JSON.stringify(res, null, 2))
    console.log(res)
  }

  const testBlocks = async (op: string) => {
    let res = await putTestingBlock(op, testingKey!, context!, contextId!)
    setRes(JSON.stringify(res, null, 2))
    console.log(res)

  }

  const deleteTestBlocks = async (op: string) => {
    let res = await removeTestingBlock(op, testingKey!, context!, contextId!)
    setRes(JSON.stringify(res, null, 2))
    console.log(res)
  }

  React.useEffect(() => {
    if (context && contextId) {
      setDeeplink(generateDeeplink(context, contextId))
    }
    else setDeeplink('')
  }, [context, contextId])

  React.useEffect(() => {
    if (context) {
      availableSponsorships(context).then((res: number | any) => {
        if (typeof res === 'number') 
          setSponsorships(res)
      })
    }
  }, [context])
  return (
    <ChakraProvider>
      <VStack align="center" w="100%" px="10%">
        <Heading>BrightID Test App</Heading>
        <Box borderWidth="1px" borderColor="grey.300" p="5px" minWidth="200px">
          <Heading size="sm">Application Context</Heading>
          <HStack><VStack>
            <Input my="5px" placeholder="Context" value={context} onChange={(evt) => setContext(evt.target.value)} />
            <Input placeholder="ContextId" value={contextId} onChange={(evt) => setContextId(evt.target.value)} />
            <Button onClick={generateContextId}>Generate ContextId</Button>
          </VStack>
            <VStack>
              <Heading size="xs">Linking QR Code</Heading>
              <Skeleton isLoaded={deeplink !== ''}>
                <QRCode value={deeplink ? deeplink : ''} />
              </Skeleton>
              <Skeleton isLoaded={deeplink !== ''}>
                <Link color="blue.700" w="128px" overflow="ellipsis" href={deeplink}>Clickable link</Link>
              </Skeleton>
            </VStack>
          </HStack>
        </Box>
        <Box borderWidth="1px" borderColor="grey.300" p="5px" minWidth="200px" >
          <Heading size="sm">ContextID Status</Heading>
          <Flex direction="row">
            <VStack align="start">
              <HStack mb="5px">
              <Button w="200px" onClick={verify} isDisabled={!context || !contextId}>Check status</Button>
              <Text w="250px">Status verified: {verified && verified.hasOwnProperty('unique') ? verified.unique.toString() : 'unknown '}</Text>
            </HStack>
            <HStack>
              <Button w="200px" onClick={trySponsor} isDisabled={!privateKey || !context || !contextId}>Sponsor</Button>
              <Text w="250px">Available sponsorships: {sponsorships}</Text>
            </HStack>
            </VStack>
            <Box>
              <Heading size="xs">Node Response</Heading>
            <Code>
              <Textarea height="200px" fontSize={10} value={res} isReadOnly={true} />
            </Code>
            </Box>
            </Flex>
        </Box>
        <Box borderWidth="1px" borderColor="grey.300" p="5px">
          <Heading size="sm">Application Keys</Heading>
          <Input my="5px" placeholder="Sponsor Private Key" value={privateKey} onChange={(evt) => setPrivateKey(evt.target.value)} />
          <Input placeholder="Testing Key" value={testingKey} onChange={(evt) => setTestingKey(evt.target.value)} />
        </Box>
        <Box borderWidth="1px" borderColor="grey.300" p="5px" minWidth="200px">
          <Heading size="sm">Set Test Blocks</Heading>
          <Text>Use these buttons to temporarily remove a context ID's status (verified/sponsored/linked) for a given context</Text>
          <HStack spacing={4}>
            <Button onClick={() => testBlocks('verification')} isDisabled={!testingKey || !context || !contextId}>Unverify</Button>
            <Button onClick={() => testBlocks('sponsorship')} isDisabled={!testingKey || !context || !contextId}>Unsponsor</Button>
            <Button onClick={() => testBlocks('link')} isDisabled={!testingKey || !context || !contextId} >Unlink</Button>
          </HStack>
        </Box>
        <Box borderWidth="1px" borderColor="grey.300" p="5px" minWidth="200px">
          <Heading size="sm">Remove Test Blocks</Heading>
          <Text>Use these buttons to remove test blocks previously set for a context ID's status (verified/sponsored/linked) for a given context</Text>
          <HStack spacing={4}>
            <Button onClick={() => deleteTestBlocks('verification')} isDisabled={!testingKey || !context || !contextId}>Delete Unverify</Button>
            <Button onClick={() => deleteTestBlocks('sponsorship')} isDisabled={!testingKey || !context || !contextId}>Delete Unsponsor</Button>
            <Button onClick={() => deleteTestBlocks('link')} isDisabled={!testingKey || !context || !contextId}>Delete Unlink</Button>
          </HStack>
        </Box>
      </VStack>
    </ChakraProvider>
  )
}

export default App;

