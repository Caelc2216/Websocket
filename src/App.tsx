import { useEffect, useRef, useState } from 'react';
import './App.css';

type Message = {
  timestamp: string,
  name: string,
  text: string
}

function App() {
  const [errorMessage, setErrorMessage] = useState("")
  const [messagesSent, setMessagesSent] = useState(0)
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState("Unknown")
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected to server!');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      setMessages((previous) => [...previous, JSON.parse(event.data) as Message]);
    };

    socket.onclose = () => {
      console.log('Disconnected from server.');
      setConnected(false);
    };

    socket.onerror = () => console.log("EVENT: onerror");

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  function sendMessage() {
    setErrorMessage("")
    if(input.trim() == ""){
      setErrorMessage("text can't be empty")
    }
    if (!input.trim()) return;
    const socket = socketRef.current;
    // 0-connecting
    // 1-open
    // closing
    // closed
    if (socket?.readyState === WebSocket.OPEN) {
      const message = {
        timestamp: new Date().toLocaleTimeString(),
        name: name.trim(),
        text: input.trim()
      }
      socket.send(JSON.stringify(message));
      setMessagesSent(prev => prev + 1)
      setInput('');
    }
  }

  return (
    <div className="chat-container">
      <h1>WebSocket Chat</h1>
      <p>Status: <strong className={connected ? 'connected' : 'disconnected'}>
        {connected ? 'Connected' : 'Disconnected'}
      </strong></p>
      <div>
        <label htmlFor='username'>Username: </label>
        <input 
          id='username' 
          value={name} 
          onChange={(event) => setName(event.target.value)}
          placeholder='Enter Name'
          
        ></input>
      </div>
      <p> Messages Received: {messages.length - messagesSent}</p>
      <div className="messages">
        {messages.length === 0 && <p className="empty">No messages yet. Open a second tab and say hello!</p>}
        {messages.map((message, index) => <p className="message" key={index}>[{message.timestamp}] {message.name.trim() == "" ? "Unknown" : message.name}: {message.text}</p>)}
      </div>
      <div className="message-input">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message..."
          onKeyDown={(event) => { if (event.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage} disabled={!connected}>Send</button>
      </div>
        {!connected && <p style={{color: "red"}}>Cannot send message when disconnected</p>}
        {errorMessage != "" && <p style={{color: "red"}}>{errorMessage}</p>}
    </div>
  );
}

export default App;
