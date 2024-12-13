// ChatApp.js - Переписаний для використання в ChatTab

import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import "../../styles/ChatStyles/Chat.css";

export function ChatApp({ roomId, currentUser }) {
    const [connection, setConnection] = useState(null);
    const [currentText, setCurrentText] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = (text) => {
        if (connection) {
            connection
                .send("SendMessage", roomId, text, currentUser.name)
                .then(() => console.log("Message sent successfully: ", text))
                .catch((error) => console.error("Error while sending message: ", error));
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

    useEffect(() => {
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
                <button className="send-button" onClick={handleSendMessage}>
                    Відправити
                </button>
            </div>
        </div>
    );
}
