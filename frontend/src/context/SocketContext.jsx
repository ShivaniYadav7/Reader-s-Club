import React, { createContext, useContext, useEffect, useState} from "react";
import io from "socket.io-client";

const SocketContext = createContext();

const SOCKET_URL = window.location.hostname === "localhost"
  ? "http://localhost:3001" 
  : "https://verse-villa-backend.onrender.com"; 
  
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            // transports: ["websocket"],
        });

        setSocket(newSocket);

        // Cleanup: Disconnecting when user closes the site
        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value = {socket}>{children}</SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);