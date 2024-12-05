import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styling/Help.css";
import UserNavBar from "./UserNavBar";
import Modal from "react-modal";
import UserQandADrop from "./UserQandADrop";

const questions = [
   {
      question: "How do I create a new bank account?",
      answer:
         "To register your account with us, first navigate to the 'Sign Up' page. Next, fill in your information and make sure to remember your password. After that, you are free to open an account with us!",
      categories: ["Account", "Navigation", "Info"],
   },
   {
      question: "Where can I find my account balance statement?",
      answer:
         "After logging in, you can navigate to your account balance statement by clicking on 'dashboard' and then on 'view statement'.",
      categories: ["Navigation", "Funds"],
   },
   {
      question: "I forgot my password. How can I login?",
      answer:
         "You can click on 'forgot password' on the login page and follow the instructions. If you don't have the information to recover your password, talk to a representative in our live chat, and we will help you.",
      categories: ["Account", "Navigation"],
   },
   {
      question: "I think my account is compromised!",
      answer:
         "Before you do anything, change your password to block any further damage. Next, please contact our live support, and we will help you sort it out.",
      categories: ["Account"],
   },
   {
      question: "My money didn't come through!",
      answer:
         "In rare cases, it can take some time for a deposit to come through depending on the traffic on our servers. If it takes more than an hour, please contact us so we can figure it out for you.",
      categories: ["Funds"],
   },
   {
      question: "I cannot withdraw my money",
      answer:
         "First, make sure you aren't withdrawing more than you currently have and that you're withdrawing from the correct account. If you have just received the money, it may take some time for the transaction to finalize. If the issue persists, please talk to us.",
      categories: ["Funds"],
   },
   {
      question: "Can I have multiple accounts?",
      answer:
         "Yes, you can have multiple types of accounts. You are not limited to either a checking or a savings account.",
      categories: ["Account", "Info"],
   },
   {
      question: "How does interest work?",
      answer:
         "Interest is paid monthly on the first day and is based on our current interest rate of 4% on the amount in the savings account. Note that the interest rate is subject to change.",
      categories: ["Funds", "Info"],
   },
   {
      question: "Is my money secure?",
      answer:
         "Yes! Protecting your money is our highest priority. We have dedicated tools and great minds ensuring your deposits are safe.",
      categories: ["Info", "Funds"],
   },
   {
      question: "How can I pay automatically?",
      answer:
         "You can set up recurring transactions in our dashboard under 'pay'.",
      categories: ["Funds", "Navigation"],
   },
   {
      question: "How can I pay a bill?",
      answer:
         "In your dashboard, go to 'pay' and choose the account to deduct funds from. Type in the amount and click 'pay now'. Make sure you have enough funds.",
      categories: ["Funds", "Navigation"],
   },
   {
      question: "I looked at my account details and some info doesn't match.",
      answer: (
         <>
            You can change your information in the settings{" "}
            <Link to="/settings">here</Link>. If you’re still having trouble,
            please <Link to="/help">Talk to us here</Link>.
         </>
      ),
      categories: ["Account"],
   },
   {
      question: "I changed my address/phone number.",
      answer: (
         <>
            Update your account settings <Link to="/settings">here</Link> by
            clicking edit and entering the new information.
         </>
      ),
      categories: ["Account", "Navigation"],
   },
   {
      question: "I want to get information about my account history.",
      answer:
         "You can view recent transactions in your dashboard, which include details like amount, time, and place, as well as monthly categorized activity.",
      categories: ["Account", "Info", "Navigation"],
   },
   {
      question: "I need documents about my bank activity.",
      answer: (
         <>
            You can download documents like your tax activity, monthly, and
            annual statements in the settings <Link to="/settings">here</Link>.
         </>
      ),
      categories: ["Account", "Navigation"],
   },
   {
      question: "How does the $100 checking account promotion work?",
      answer:
         "When you open a checking account, you will receive $100. This is for new customers only and can take some time to arrive. The promotion is subject to change.",
      categories: ["Info", "Funds", "Account"],
   },
   {
      question: "There's no Chase ATMs near me. Can I still withdraw my funds?",
      answer: "You can still withdraw your funds, but there may be fees.",
      categories: ["Info", "Funds"],
   },
   {
      question: "Do you accept checks?",
      answer:
         "Yes, we accept checks. Go to the dashboard under 'deposit' and take a picture of the check.",
      categories: ["Info", "Funds"],
   },
   {
      question: "I still need help, what can I do?",
      answer: (
         <>
            You can contact our 24/7 chat <Link to="/help">here</Link>.
         </>
      ),
      categories: ["Navigation", "Account", "Info", "Funds"],
   },
];

const Help = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [message, setMessage] = useState("");
   const [chatHistory, setChatHistory] = useState([]); // State to store chat history
   const [selectedCategory, setSelectedCategory] = useState("All");

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
         const userMessage = { sender: "user", text: message };
         const autoResponse = {
            sender: "system",
            text: "Thank you for reaching out. An employee will get back to you shortly.",
         };

         // Update the chat history
         setChatHistory((prevHistory) => [
            ...prevHistory,
            userMessage,
            autoResponse,
         ]);

         setMessage(""); // Clear the input after sending
      }
   };

   const handleCategoryChange = (category) => {
      setSelectedCategory(category);
   };

   const filteredQuestions =
      selectedCategory === "All"
         ? questions
         : questions.filter((q) => q.categories.includes(selectedCategory));

   const categoryCounts = questions.reduce((counts, q) => {
      q.categories.forEach((category) => {
         counts[category] = (counts[category] || 0) + 1;
      });
      return counts;
   }, {});

   return (
      <>
         <UserNavBar />
         <div className="help-page">
            <h1 className="title" style={{ textAlign: "center" }}>
               Frequently Asked Questions (FAQ)
            </h1>
            <div className="filter-container">
               <button
                  className="filter-button"
                  onClick={() => handleCategoryChange("All")}
               >
                  All ({questions.length})
               </button>
               {Object.keys(categoryCounts).map((category) => (
                  <button
                     className="filter-button"
                     key={category}
                     onClick={() => handleCategoryChange(category)}
                  >
                     {category} ({categoryCounts[category]})
                  </button>
               ))}
            </div>
            {filteredQuestions.map((q, index) => (
               <UserQandADrop
                  key={index}
                  question={q.question}
                  answer={q.answer}
               ></UserQandADrop>
            ))}

            {/* Live Chat Button */}
            <button className="live-chat-button" onClick={openModal}>
               Live Chat
            </button>

            {/* Modal for Live Chat */}
            <Modal
               isOpen={isModalOpen}
               onRequestClose={closeModal}
               className="chat-modal"
               overlayClassName={`chat-overlay ${isModalOpen ? "open" : ""}`}
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
                        className={`chat-message ${
                           entry.sender === "user"
                              ? "user-message"
                              : "system-message"
                        }`}
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
