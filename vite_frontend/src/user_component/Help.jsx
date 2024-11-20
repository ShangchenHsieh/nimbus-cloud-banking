import React, { useState } from 'react';
import './styling/Help.css';
import UserNavBar from './UserNavBar';  
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const Help = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // State to store chat history

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Clear the chat history when the modal is closed
    setChatHistory([]);
    setIsModalOpen(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add the user's message to chat history
      const userMessage = { sender: 'user', text: message };
      const autoResponse = {
        sender: 'system',
        text: 'Thank you for reaching out. An employee will get back to you shortly.'
      };

      // Update the chat history
      setChatHistory((prevHistory) => [...prevHistory, userMessage, autoResponse]);

      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <>
      <UserNavBar />  

      <div className="help-page">
        <div className="common-concerns">
          <div className = "titlebanner" Style = {{fontWeight: 'bold'}}>
            <h1>Live support</h1>
          </div>
          <div className = "descriptionbanner">
          <p style = {{color: 'white', fontWeight: 'bold', fontSize: '30px', position: 'relative', padding: '0px', top: '10px'}}>Access our 24/7 live support with dedicated people working to solve your issues</p>
          <p style = {{color: 'white', fontWeight: 'bold', fontSize: '30px', position: 'relative', padding: '0px', top: '-20px'}}>We ask you to please take a look at our <Link to="/Q&A">Frequently Q&A page here</Link> first </p>
          <p style = {{color: 'white', fontWeight: 'bold', fontSize: '30px', position: 'relative', padding: '0px', top: '-50px'}}>Please be patient and respectful to make it easier for us to help</p>

          </div>
          <div className = "livechatbanner" style = {{position: 'relative', padding: '0px', right: '-500px'}}>
            <button className = "live-chat-button" onClick ={openModal}> Get help</button>
          </div>
        </div>

        {/* Modal for Live Chat */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="chat-modal"
          overlayClassName={`chat-overlay ${isModalOpen ? 'open' : ''}`}  
        >
          <div className="chat-header">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
          </div>
          <div className="chat-body">
            {/* Display chat history */}
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`chat-message ${entry.sender === 'user' ? 'user-message' : 'system-message'}`}
              >
                {entry.text}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input
              type="text"
              className="chat-input"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="chat-submit" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Help;
