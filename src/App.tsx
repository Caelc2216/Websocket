import { useEffect, useRef, useState } from 'react';
import './App.css';

type Message = {
  name: string,
  text: string
}

function App() {
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
    if (!input.trim()) return;
    const socket = socketRef.current;
    // 0-connecting
    // 1-open
    // closing
    // closed
    if (socket?.readyState === WebSocket.OPEN) {
      const message = {
        name: name.trim(),
        text: input.trim()
      }
      socket.send(JSON.stringify(message));
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
      <div className="messages">
        {messages.length === 0 && <p className="empty">No messages yet. Open a second tab and say hello!</p>}
        {messages.map((message, index) => <p className="message" key={index}>{message.name}: {message.text}</p>)}
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
    </div>
  );
}

export default App;
