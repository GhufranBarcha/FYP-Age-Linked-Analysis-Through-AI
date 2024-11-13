import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Menu } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const INITIAL_PROMPT = "Hello! I'm here to assist you with understanding your child's speech development based on age analysis. Please provide your child's actual age and the age that our model predicted based on their voice sample. I'll analyze the difference between these ages to give you insights into your child's speech development and suggest any steps that might be helpful. Let's get started!";

const Solution = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { role: 'bot', content: INITIAL_PROMPT }
    ];
  });
  const [isRecording, setIsRecording] = useState(false);
  const [conversationContext, setConversationContext] = useState('');
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userInput) => {
    if (!userInput) return;

    const genAI = new GoogleGenerativeAI("AIzaSyBxv2Ssm0SZCEGx7oJJwW5plWXZKnTUQvQ");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build context-aware prompt
    const contextualPrompt = `
      Previous conversation context: ${conversationContext}
      You are a speech development analysis assistant. Your role is to help parents understand their child's speech development.
      Current user message: ${userInput}
      Please provide a relevant response while maintaining context of the conversation.
    `;

    try {
      const result = await model.generateContent(contextualPrompt);
      const responseText = await result.response.text();
      
      // Update conversation context
      const newContext = messages.slice(-3).map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
      setConversationContext(newContext);

      return responseText;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message immediately
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    try {
      // Generate and add bot response
      const responseText = await generateResponse(input);
      setMessages(prevMessages => [...prevMessages, { role: 'bot', content: responseText }]);
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'bot', content: "I encountered an error. Please try again." }
      ]);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-800">Speech Development Assistant</h1>
        <button
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => alert('About: This chatbot analyzes speech development patterns in children based on age comparison.')}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-grow p-4 overflow-auto bg-gray-50" ref={scrollAreaRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-white text-gray-800'
                } shadow-sm`}
              >
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
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ml-2 ${isRecording ? 'bg-red-500' : 'bg-gray-200'} text-gray-700 hover:bg-gray-300 transition-colors`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2 rounded-full ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Solution;
