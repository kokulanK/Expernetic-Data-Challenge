import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your Airbnb Data Expert. Ask me about pricing, hosting, occupancy, or analytics.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      // In production, you would attach the JWT token here
      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:8000/api/chat/', {
        question: userMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      if (error.response?.data?.error === 'OUT_OF_SCOPE') {
        setMessages(prev => [...prev, { role: 'assistant', content: error.response.data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-8 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-4 text-white flex items-center gap-3">
            <Bot size={24} />
            <div>
              <h3 className="font-bold">Airbnb AI Analyst</h3>
              <p className="text-xs opacity-80">Online & ready</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px] space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-white"/> : <Bot size={16} className="text-white"/>}
                </div>
                <div className={`p-3 rounded-2xl max-w-[75%] text-sm shadow-sm ${msg.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white"/>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about market trends..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white px-4 text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} className="ml-1"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
