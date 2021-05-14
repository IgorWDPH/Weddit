import React, {useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
//import config from 'config';

const ENDPOINT = 'http://localhost:5001';
const header = 'weddit_messenger';
let socket;

export const useMessengerPage = () => {
    const [response, setResponse] = useState([]);
    const { token } = useContext(AuthContext); 
    useEffect(() => {        
        socket = io(ENDPOINT, {
            withCredentials: true,
            extraHeaders: {
                'socket_io_header': 'abcd'
            },
            auth: {
                token: token
            }
        });
        socket.on('connect', function () {
            setResponse([...response, 'Connected']);
        });
        socket.on('connect_error', function() {
            setResponse([...response, 'Connection failed']);
        });
        socket.on('reconnect_failed', function() {
            setResponse([...response, 'Reconnection failed']);
        });
        socket.on('message', (arg) => {
            setResponse([...response, arg.message]);
        });
    }, []);

    const emitEverything = () => {
      socket.emit('update', 'alpha', 'bravo', (res) => {
        setResponse([...response, res.status]);
      });
    }

    return (
      <div>
        <h1>SocketIO</h1>
        <h3>Result Data:</h3>
        <button onClick={emitEverything}>EMIT</button>
        {response.map(message => (
          <p>{message}</p>
        ))}
      </div>    
    );
}

export default useMessengerPage;