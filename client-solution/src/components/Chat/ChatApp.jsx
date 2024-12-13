// ChatApp.js - Переписаний для використання в ChatTab

import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import "../../styles/ChatStyles/Chat.css";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';

export function ChatApp({ roomId, currentUser, clear = [] }) {
    const [connection, setConnection] = useState(null);
    const [currentText, setCurrentText] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = (text) => {
        if (connection) {
            connection
                .invoke("SendMessageToGroup", roomId, text)
                .catch((err) => console.error("Send Error: ", err));
        }
    };



    const handleSendMessage = () => {
        if (currentText.trim() !== "") {
            sendMessage(currentText);
            setCurrentText("");
        }
    };

    const handleInputChange = (e) => {
        setCurrentText(e.target.value);
    };

    const handleClearChut = () => {
        setMessages(clear);

    }
    useEffect(() => {
        
        handleClearChut();

        console.log(roomId, currentUser);

        
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5268/ChatHub", {
                accessTokenFactory: () => currentUser.token,
            })
            .withAutomaticReconnect()
            .build();



        newConnection
            .start()
            .then(() => {
                console.log("Successfully connected to SignalR hub");

                setConnection(newConnection);

                newConnection.invoke("JoinGroup", roomId)


                newConnection.on("ReceiveMessage", (user, message) => {
                    setMessages((prevMessages) => [...prevMessages, { user, message }]);
                });
            })
            .catch((error) => {
                console.error("SignalR Connection Error: ", error);
            });

        return () => {
            if (newConnection) {
                newConnection
                    .stop()
                    .then(() => console.log("SignalR connection closed"))
                    .catch((error) => console.error("Error stopping connection: ", error));
            }
        };
    }, [currentUser.token, roomId]);


    return (
        <div className="chat-container">
            <div className="chat-header">
               {/* <h2>Чат: {roomId}</h2> */}
            </div>
            <div className="chat-messages">
                <ul className="message-list">
                    {messages.map((msg, index) => (
                        <li key={index} className="message-item">
                            <strong>{msg.user}:</strong> {msg.message}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={currentText}
                    onChange={handleInputChange}
                    placeholder="Напишіть повідомлення..."
                    className="message-input"
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSendMessage}>
                    Send
                </Button>

            </div>

            
        </div>
    );
}
