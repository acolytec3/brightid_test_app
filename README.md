# BrightID Test App

This is a demo app that allows anyone integrating with BrightID to test their out their application context as well as demo all the features of the BrightID [Javascript/Typescript SDK](https://www.npmjs.com/package/brightid_sdk).

## Features

- Generate arbitrary contextIds for any context as well as QR code/deeplinks for testing out BrightID app linking
- Verify the status of a contextID
- Sponsor a contextID 
- Use the BrightID `/testblocks` endpoint to temporarily change the status of any contextID associated with an application's content
- Show API responses when interacting with a BrightID node for ease of application testing
## Note

In a real BrightID-linked application, you would **never** leave your sponsor or testing keys exposed in the client-side of the application.  Please do not copy this app line for line and use in production or you will expose your keys!

