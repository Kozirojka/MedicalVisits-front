import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../../styles/ChatStyles/ChatTab.css";
import CreateChatModal from '../Chat/CreateChatModal';
import { useEffect } from "react";
import { ChatApp } from '../../components/Chat/ChatApp'

export default function ChatTab() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleCreateChat = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

     useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch("http://localhost:5268/api/Chat/chats", {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                console.log(data);


                setChats(data); 
            } catch (error) {
                console.error("Помилка завантаження чатів:", error);
            }
        };

        fetchChats();
    }, []); 


    return (
        <div className="chat-tab-container">
            <aside className="chat-sidebar">
                <button onClick={handleCreateChat} className="create-chat-button">
                    Створити чат
                </button>
                <ul className="chat-list">
                    {chats.map((chat) => (
                        <li
                            key={chat.id}
                            className={`chat-list-item ${selectedChat?.id === chat.id ? "active" : ""}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <span className="chat-name">{chat.name}</span>
                            <span className="chat-preview">{chat.preview || "No messages yet"}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="chat-main">
                {selectedChat ? (
                    <div className="chat-content">
                               
                        <h2>{selectedChat.name}</h2>
                        <ChatApp
                            roomId={selectedChat.id}
                            currentUser={{
                                name: selectedChat.name,
                                token: localStorage.getItem('accessToken')
                            }}
                            />

                    </div>
                ) : (
                    <div className="chat-placeholder">
                        Виберіть чат зі списку або створіть новий.
                    </div>
                )}
            </main>

            {showModal && (
                <CreateChatModal onClose={handleCloseModal} />
            )}
        </div>
    );
}
