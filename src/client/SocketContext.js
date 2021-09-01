import React from 'react'
import io from "socket.io-client"


const SocketContext = React.createContext();

const  socket = io('http://127.0.0.1:5000', {
    transports: ["websocket", "polling"] 
  });


export {SocketContext, socket};

