// 8. components/ChatBox.jsx
import React, { useState } from 'react';


function ChatBox({ messages, sendMessage }) {
const [text, setText] = useState('');


const handleSend = () => {
if (!text.trim()) return;
sendMessage(text);
setText('');
};


return (
<div className="chat-box">
<div className="messages">
{messages.map((msg, index) => (
<div key={index} className={`message ${msg.senderId === localStorage.getItem('userId') ? 'sent' : 'received'}`}>
{msg.text}
</div>
))}
</div>
<div className="message-input">
<input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" />
<button onClick={handleSend}>Send</button>
</div>
</div>
);
}


export default ChatBox;