# WebSocket Chat Demo

A small React + TypeScript frontend and Node.js WebSocket server for Lesson 1.

## Requirements
- Node.js 20.19+ or 22.12+ (compatible with Vite 7)
- npm

## Getting started

1. Open this folder in VS Code.
2. Open a terminal and run:
   ```bash
   npm install
   ```
3. Start the WebSocket server in terminal 1:
   ```bash
   npm run server
   ```
4. Open **another** terminal and start React in terminal 2:
   ```bash
   npm run dev
   ```
5. Open the local URL printed by Vite (typically http://localhost:5173).
6. Open that same URL in a second browser tab. Send a message from either tab and watch it appear in both.

## What to observe
- React connects to `ws://localhost:8080`.
- The server broadcasts messages to every connected client, including the sender.
- `onmessage` adds received messages to React state.
- The `useEffect` cleanup closes the connection when the component unmounts.
- Stopping the WebSocket server makes the UI show **Disconnected**.

## Practice
- Add a username field and include the name in outgoing messages.
- Show the total number of received messages.
- Improve the disconnected-state message.
- Prevent blank messages (the starter already checks this; explain how).
- Challenge: add a timestamp to each message.

## Notes
This is a local classroom demo, not a production chat system. It has no authentication, message history, or automatic reconnection. It uses unencrypted `ws://` only on localhost. For public deployments, use `wss://` and implement proper security controls.
