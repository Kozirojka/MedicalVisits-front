export function ChatItem({ chatId, onClick, selectedId, chatName, chatPreview }) {
    return (
      <li
        key={chatId}
        className={`chat-list-item ${selectedId === chatId ? "active" : ""}`}
        onClick={onClick}
      >
        <span className="chat-name">{chatName}</span>
        <span className="chat-preview">{chatPreview || "No messages yet"}</span>
      </li>
    );
  }
  