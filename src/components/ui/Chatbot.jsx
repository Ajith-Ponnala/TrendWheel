import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! 👋 How can I help you today? Try asking about shipping, returns, or orders.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    // Greetings
    if (text.match(/\b(hi|hello|hey|greetings|morning|afternoon)\b/)) {
      return "Hello! 👋 Welcome to Trend Wheel! How can I assist you with your shopping today?";
    }
    
    // About Trend Wheel
    if (text.match(/\b(about|who are you|trend wheel|trendwheel)\b/)) {
      return "Trend Wheel is your premium destination for modern fashion. We offer a curated selection of Men's, Women's, and Kids' clothing, as well as Accessories.";
    }

    // Categories & Products
    if (text.match(/\b(categories|products|sell|men|women|kids|accessories|clothes|clothing|buy)\b/)) {
      return "We sell a wide variety of clothing! You can browse our dedicated categories for Men, Women, Kids, and Accessories from the top navigation bar.";
    }

    // Shipping & Delivery
    if (text.match(/\b(shipping|delivery|time|deliver|ship)\b/)) {
      return "We offer FREE delivery on all orders over ₹1000! Standard delivery takes 3-5 business days across India. Orders below ₹1000 have a flat ₹100 delivery fee.";
    }
    
    // Returns & Refunds
    if (text.match(/\b(return|refund|exchange|cancel)\b/)) {
      return "We have a hassle-free 30-day easy return policy. You can initiate a return or exchange directly from the 'My Orders' page in your profile.";
    }
    
    // Orders & Tracking
    if (text.match(/\b(order|track|status|where is my package)\b/)) {
      return "You can track your orders in real-time! Just head over to 'My Profile' -> 'My Orders'. You'll see a visual timeline showing if your order is Pending, Packed, Shipped, or Delivered.";
    }

    // Payment Methods
    if (text.match(/\b(pay|payment|upi|cod|card|credit card|debit card|cash)\b/)) {
      return "We accept all major Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), and Cash on Delivery (COD) for your convenience. All transactions are 100% secure.";
    }

    // Wishlist & Cart
    if (text.match(/\b(wishlist|cart|bag|save)\b/)) {
      return "See something you like? Click the ❤️ icon on any product to save it to your Wishlist for later! Or click 'Add to Bag' to purchase it right away.";
    }

    // Recently Viewed
    if (text.match(/\b(history|viewed|recently|saw|forgot)\b/)) {
      return "Did you lose a product you were looking at? Don't worry! Scroll to the bottom of the Home page or any Product page to see your 'Recently Viewed' items.";
    }

    // Account & Profile
    if (text.match(/\b(login|register|account|profile|password)\b/)) {
      return "You can manage your account, view your order history, and update your details by clicking the User icon in the top right corner of the page.";
    }

    // Theme (Dark/Light mode)
    if (text.match(/\b(dark mode|light mode|theme|color)\b/)) {
      return "Trend Wheel fully supports Dark Mode! 🌙 Just click the Moon/Sun icon in the top navigation bar to toggle between themes.";
    }

    // Customer Support
    if (text.match(/\b(contact|support|help|call|email|human)\b/)) {
      return "Need to speak with a human? You can reach our support team at support@trendwheel.com or call us at 1800-123-4567, Monday-Friday 9AM-6PM.";
    }
    
    // Default fallback
    return "I'm not quite sure how to answer that! Try asking me about our products, shipping, returns, order tracking, payment methods, or how to contact support.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate network delay for bot response
    setTimeout(() => {
      const botResponseText = generateBotResponse(userMessage.text);
      const botMessage = { id: Date.now() + 1, sender: 'bot', text: botResponseText };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-primary-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm">Trend Wheel Support</h3>
                <p className="text-[10px] text-primary-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-primary-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-gray-50 dark:bg-gray-950 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-primary-600" />
                  </div>
                )}
                <div 
                  className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-sm' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-primary-600" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-sm shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-0 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white transition-colors outline-none"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-gray-600 dark:bg-gray-800' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
