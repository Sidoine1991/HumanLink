import { useState } from 'react';
import { ArrowLeft, Send, Eye, EyeOff } from 'lucide-react';
import AnonymousAvatar from '../components/mood/AnonymousAvatar';

interface ChatProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const quickReplies = [
  "Je te comprends 💚",
  "C'est dur parfois...",
  "Merci de partager 🙏",
  "On en parle ?",
];

const messages = [
  { id: 1, text: "Salut ! J'ai vu qu'on ressentait un peu la même chose...", sent: false, time: '14:32' },
  { id: 2, text: "Oui, c'est vrai ! Comment tu gères ça toi ?", sent: true, time: '14:33' },
  { id: 3, text: "J'essaie de méditer le matin, ça m'aide beaucoup. Et toi ?", sent: false, time: '14:35' },
  { id: 4, text: "Je fais du sport, ça me vide la tête. Mais c'est pas toujours facile.", sent: true, time: '14:36' },
  { id: 5, text: "Je comprends totalement. L'important c'est de trouver ce qui marche pour nous.", sent: false, time: '14:38' },
];

export default function Chat({ onNavigate, darkMode }: ChatProps) {
  const [message, setMessage] = useState('');
  const [identityRevealed, setIdentityRevealed] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => onNavigate('timeline')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          
          <div className="flex items-center gap-3">
            <AnonymousAvatar mood="happy" darkMode={darkMode} />
            <div>
              <h1 className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {identityRevealed ? 'Sarah M.' : 'Conversation anonyme'}
              </h1>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
          
          <div className="w-6"></div>
        </div>

        {/* Reveal identity toggle */}
        <button
          onClick={() => setIdentityRevealed(!identityRevealed)}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 ${
            identityRevealed
              ? 'bg-[#00B894]/20 text-[#00B894]'
              : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
          } transition-all`}
        >
          {identityRevealed ? (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm">Identité révélée</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">Révéler mon identité</span>
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Info message */}
        <div className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
          <div className={`inline-block px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            Conversation démarrée aujourd'hui à 14:32
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${msg.sent ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.sent
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white rounded-br-sm'
                    : darkMode 
                      ? 'bg-gray-800 text-gray-200 rounded-bl-sm'
                      : 'bg-white text-gray-900 rounded-bl-sm'
                } shadow-sm`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1 block ${msg.sent ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick replies */}
      <div className="px-6 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setMessage(reply)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                  : 'bg-white text-gray-700 border border-gray-200'
              } hover:border-[#6C5CE7] transition-colors`}
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écris un message..."
            className={`flex-1 px-4 py-3 rounded-2xl ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]`}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className={`p-3 rounded-2xl ${
              message.trim()
                ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white'
                : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
            } transition-all`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
