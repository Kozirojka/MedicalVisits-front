import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "./ChatTab.css";
import CreateChatModal from './CreateChatModal';
import { useEffect } from "react";
import { ChatApp } from './ChatApp'
import { ChatItem } from './ChatItem'
import {BASE_API} from '../../../constants/BASE_API';

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

    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${BASE_API}/Chat/chats`, {
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


     useEffect(() => {
    
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
                        <ChatItem
                            key={chat.id}
                            chatId = {chat.id}
                            onClick = {() => setSelectedChat(chat)}
                            selectedId={selectedChat?.id}
                            chatName = {chat.name}
                            chatPreview = {chat.preview}
                        />
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
                <CreateChatModal onClose={handleCloseModal} onChatCreated={fetchChats}/>
            )}
        </div>
    );
}
