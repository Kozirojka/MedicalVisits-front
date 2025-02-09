
import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import "./ChatApp.css";
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { BASE_API} from '../../../constants/BASE_API';

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

    const handleSetHistory = async (chatId) => {
        const newMessages = await fetchMessages(chatId);
    
        if (newMessages && Array.isArray(newMessages)) {
            const transformedMessages = newMessages.map((msg) => ({
                user: msg.senderId,
                message: msg.messageText,
            }));
    
            setMessages((prevMessages) => [...prevMessages, ...transformedMessages]);
        } else {
            console.error("Failed to update messages: newMessages is not an array");
        }
    };

    const fetchMessages = async (chatId) => {


        const token = localStorage.getItem('accessToken');


        const response = await fetch(`${BASE_API}/Chat/${chatId}/history`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        console.log(response);


        if (!response.ok) {
            console.error(`Error fetching messages: ${response.status} ${response.statusText}`);
            return null;
        }
    
        const messages = await response.json();

        console.log(messages);

        return messages;
    
    }

    useEffect(() => {
        
        handleClearChut();

        console.log(roomId, currentUser);

        handleSetHistory(roomId);
        
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
    }, [currentUser.token, roomId], [roomId]);


    return (
        <div className="chat-container">
            <div className="chat-header">
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
