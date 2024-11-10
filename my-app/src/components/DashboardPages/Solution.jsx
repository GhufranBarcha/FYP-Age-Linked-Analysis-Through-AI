// const Solution = () => {
//   return <div>Solution</div>;
// };

// export default Solution;


import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Menu, Plus } from 'lucide-react';

const Solution = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');

    try {
      const response = await fetchBotResponse(input);
      const botMessage = { role: 'bot', content: response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  const fetchBotResponse = async (message) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "I'm an AI assistant specialized in children's speech development. How can I help you today?";
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Implement voice recognition logic here
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-800">Speech Development Assistant</h1>
        <button
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => alert('About: This chatbot is designed to assist with questions about children\'s speech development.')}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-grow p-4 overflow-auto bg-gray-50" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'} shadow-sm`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="p-4 bg-white border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ml-2 ${isRecording ? 'bg-red-500' : 'bg-gray-200'} text-gray-700 hover:bg-gray-300 transition-colors`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={sendMessage}
            className="p-2 rounded-full ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Solution;
