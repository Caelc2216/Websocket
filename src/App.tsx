import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
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
      setMessages((previous) => [...previous, String(event.data)]);
    };

    socket.onclose = () => {
      console.log('Disconnected from server.');
      setConnected(false);
    };

    socket.onerror = () => console.log('WebSocket error.');

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  function sendMessage() {
    if (!input.trim()) return;
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(input);
      setInput('');
    }
  }

  return (
    <div className="chat-container">
      <h1>WebSocket Chat</h1>
      <p>Status: <strong className={connected ? 'connected' : 'disconnected'}>
        {connected ? 'Connected' : 'Disconnected'}
      </strong></p>
      <div className="messages">
        {messages.length === 0 && <p className="empty">No messages yet. Open a second tab and say hello!</p>}
        {messages.map((message, index) => <p className="message" key={index}>{message}</p>)}
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
