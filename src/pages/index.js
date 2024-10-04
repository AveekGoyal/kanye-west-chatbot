import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import axios from "axios";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [kanyeTyping, setKanyeTyping] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = { user: true, text: userInput };
    setMessages(prevMessages => [...prevMessages, newMessage, { user: false, text: "loading" }]);
    setKanyeTyping(true);
    const currentInput = userInput;
    setUserInput("");

    try {
      const response = await axios.post('/api/chat', {
        userMessage: currentInput // Changed from 'message' to 'userMessage'
      });

      if (response.data && response.data.response) {
        const botResponse = { user: false, text: response.data.response };
        setMessages(prevMessages => [...prevMessages.slice(0, -1), botResponse]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || error.message || "Oops! Something went wrong.";
      const botResponse = { user: false, text: errorMessage };
      setMessages(prevMessages => [...prevMessages.slice(0, -1), botResponse]);
    } finally {
      setKanyeTyping(false);
    }
  };

  return (
    <>
      <Head>
        <title>Kanye West Chatbot</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      </Head>
      <div className="chat-container">
        <div className="header">
          <i className="fa fa-chevron-left back-button"></i>
          <div className="contact-info">
            <img
              className="profile-image"
              src="https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds"
              alt="Profile"
            />
            <h2 className="name">YeGPT</h2>
          </div>
          <i className="fa fa-video-camera video-icon"></i>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          <p className="chat-bot-header">Powered by <a className="ref-link" href="http://metaschool.so/" target="_blank" rel="noopener noreferrer">metaschool 🔮</a></p>
          {messages.map((message, index) => (
            <div key={index} className="message-container">
              {message.user ? (
                <>
                  <div className="user-message message">
                    <div className="message-text">{message.text}</div>
                  </div>
                  <img
                    className="profile-image user-image"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                    alt="User Profile"
                  />
                </>
              ) : (
                <>
                  <img
                    className="profile-image bot-image"
                    src="https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds"
                    alt="Bot Profile"
                  />
                  {message.text === 'loading' ? (
                    <img 
                      className="typing-bubble" 
                      src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg3ZjFlNzQ1Mzc1ZTFlNTMyZTVjODIzMDYyODUwNDQ0ZDY3ZmU5YyZjdD1z/3tLfKrc4pLWiTkAAph/giphy.gif" 
                      alt="Typing"
                    />
                  ) : (
                    <div className="bot-message message">
                      <div className="message-text">{message.text}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={userInput}
            onChange={handleChange}
            disabled={kanyeTyping}
          />
          <button type="submit" disabled={kanyeTyping || !userInput.trim()}>
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    </>
  );
}