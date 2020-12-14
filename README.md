# BrightID Test App

This is a demo app that allows anyone integrating with [BrightID](https://brightid.org) to test their out their application context as well as demo all the features of the BrightID [Javascript/Typescript SDK](https://www.npmjs.com/package/brightid_sdk).

## Definitions

- context - The specific string that BrightID nodes use to validate a contextId's status for a given application (e.g. Gitcoin/1Hive/etc)
- contextId - An arbitrary string that links a specific BrightID to a context that can be used by an application to verify the uniqueness of a given user (without exposing that user's BrightID to the application)
- Sponsor private key - A private key provided by a BrightID node operator to an application to allow applications to sponsor users and give their BrightID a "sponsored" status and confirm them as unique
- Testing key - A private key provided by a BrightID node operator to an application to allow testing of an application's context by temporarily delinking specific BrightID statuses for a specific contextId

## Features

- Generate arbitrary contextIds for any context as well as QR code/deeplinks for testing out BrightID app linking
- Verify the status of a contextID
- Sponsor a contextID 
- Use the BrightID `/testblocks` endpoint to temporarily change the status of any contextID associated with an application's content
- Show API responses when interacting with a BrightID node for ease of application testing

## Usage

### Linking a contextID to a BrightId

- Enter a context (e.g. Gitcoin) and then either supply or generate a contextId
- Scan the QR code or tap on the generated deeplink from a mobile browser on a device where the BrightID native app is installed

### Verifying a contextID's status in a context

- Enter a context and contextId
- Click "Check Status" to view the contextId's current status in relationship to the context

### Sponsoring a contextId in a given context

- Enter a context
- Enter or generate a contextId
- Enter your sponsor private key and click sponsor
- Click "check status" to view the contextId's status after getting a successful response from the node

### Using the ContextId status testing tools

- Enter a context and contextId
- Click "Check status" to verify the context is verified/linked to your context
- Click Unverify/Unsponsor/Unlink and then "check status" 
- View the response from the node to determine what a contextId without that specific status looks like to the BrigthID node
- Click "Delete Unverify/Unsponsor/Unlink" to remove the test status and return the specified contextId to normal.  
- Wait 1-2 minutes and then click "Check status" to confirm tha the contextId's status is being reported correctly again
## Note

In a real BrightID-linked application, you would **never** leave your sponsor or testing keys exposed in the client-side of the application.  Please do not copy this app line for line and use in production or you will expose your keys!

