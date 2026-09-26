import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI shopping assistant. Ask me anything — find products, get recommendations, or check an order." },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const endRef = useRef(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setSending(true);
    try {
      const res = await api.post('/chat', { message: userMsg });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, something went wrong.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h1 className="text-xl font-bold">AI Shopping Assistant</h1>
      </div>
      <p className="text-sm text-ink-400 mb-6">Ask me anything — find products, get suggestions, compare options.</p>

      <div className="border border-ink-200 rounded-xl p-4 h-[500px] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-ink-50 text-ink-600'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-ink-50 rounded-xl px-4 py-2 text-sm text-ink-400">Thinking...</div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-ink-200 rounded-full px-4 py-2 text-sm outline-none"
          />
          <button type="submit" disabled={sending} className="bg-purple-500 text-white rounded-full p-2 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}