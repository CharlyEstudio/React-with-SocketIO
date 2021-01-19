import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

const connectSocketServer = () => {
  return io.connect('http://localhost:3001', {
    transports: ['websocket']
  });
};

function App() {
  const [online, setOnline] = useState(false);
  const [socket] = useState(connectSocketServer());
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');

  const onChange = e => {
    setText(e.target.value);
  };

  useEffect(() => {
    setOnline( socket.connected );
  }, [socket]);

  useEffect(() => {
    socket.on('connect', () => setOnline(true));
  }, [socket]);

  useEffect(() => {
    socket.on('disconnect', () => setOnline(false));
  }, [socket]);

  useEffect(() => {
    socket.on('message-from-server', resp => setResponse(resp));
  }, [socket]);

  const sendMessage = () => {
    socket.emit('message-to-server', text);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {
          online
            ?
              <div>
                <p>OnLine</p>
                <p>Respuesta del Servidor: { response }</p>
                <div>
                  <input type="text" name="text" value={text} placeholder="Ingrese un mensaje" onChange={onChange}/>
                  <button onClick={sendMessage}>Enviar Mensaje</button>
                </div>
              </div>
            : <p>OffLine</p>
        }
      </header>
    </div>
  );
}

export default App;
