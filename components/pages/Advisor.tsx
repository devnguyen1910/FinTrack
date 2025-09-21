import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useFinancials } from '../../context/FinancialContext';
import { getFinancialAdvice } from '../../services/geminiService';
// FIX: Aliased the Error component to avoid name collision with the built-in Error object.
import { Error as ErrorComponent } from '../ui/Error';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 p-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const UserAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
        U
    </div>
);

const AiAvatar: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
        AI
    </div>
);


export const Advisor: React.FC = () => {
  const { transactions, budgets, goals } = useFinancials();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: 'Xin chào! Tôi là cố vấn tài chính AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    setError(null);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const financialData = {
        summary: {
            totalIncome: transactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
            totalExpense: transactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
        },
        recentTransactions: transactions.slice(-20),
        budgets,
        goals,
      };
      const aiResponseText = await getFinancialAdvice(input, financialData);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
       setError("Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };
  
  const suggestions = [
      "Phân tích chi tiêu tháng này của tôi.",
      "Tôi có thể cắt giảm chi phí ở đâu?",
      "Gợi ý cho tôi một kế hoạch tiết kiệm.",
      "Tình hình tài chính của tôi có ổn không?"
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Cố vấn tài chính AI</h2>
      <Card className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-200px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <AiAvatar />}
              <div className={`flex flex-col max-w-lg ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-lg prose prose-sm dark:prose-invert ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 rounded-tl-none'}`}>
                   <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
                <span className="text-xs text-gray-400 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {msg.sender === 'user' && <UserAvatar />}
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-3 justify-start">
                <AiAvatar />
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg rounded-tl-none">
                    <TypingIndicator />
                </div>
            </div>
          )}
          {error && <ErrorComponent message={error} onRetry={handleSend} />}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && !isLoading && !error &&(
            <div className="p-4 border-t dark:border-gray-700">
                <p className="text-sm text-gray-500 mb-2">Gợi ý cho bạn:</p>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => handleSuggestionClick(s)} className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-300 dark:hover:bg-gray-500">
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="border-t dark:border-gray-700 p-4">
          <div className="flex items-center bg-light dark:bg-dark rounded-lg border border-gray-300 dark:border-gray-600">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-transparent p-3 focus:outline-none"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="p-3 text-primary disabled:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
