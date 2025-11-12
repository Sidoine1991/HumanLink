import { ArrowLeft, Map, Hand } from 'lucide-react';
import AnonymousAvatar from '../components/mood/AnonymousAvatar';
import DistanceTag from '../components/mood/DistanceTag';

interface MatchListProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const matches = [
  {
    id: 1,
    mood: 'happy' as const,
    emoji: '😊',
    text: 'Je recherche des personnes positives pour partager de bons moments !',
    distance: 0.5,
    compatibility: 95,
  },
  {
    id: 2,
    mood: 'calm' as const,
    emoji: '😎',
    text: 'Amateur de méditation et de moments zen. On se comprend ?',
    distance: 0.8,
    compatibility: 88,
  },
  {
    id: 3,
    mood: 'excited' as const,
    emoji: '🤩',
    text: 'Trop d\'énergie à revendre ! Qui pour des activités fun ?',
    distance: 1.2,
    compatibility: 82,
  },
  {
    id: 4,
    mood: 'anxious' as const,
    emoji: '😰',
    text: 'Quelqu\'un pour parler quand ça va pas ? Je suis là aussi pour écouter.',
    distance: 0.3,
    compatibility: 91,
  },
  {
    id: 5,
    mood: 'happy' as const,
    emoji: '😊',
    text: 'La vie est belle aujourd\'hui ! Envie de la partager avec quelqu\'un.',
    distance: 2.1,
    compatibility: 79,
  },
];

export default function MatchList({ onNavigate, darkMode }: MatchListProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('home')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connexions suggérées</h1>
          <button onClick={() => onNavigate('match-map')}>
            <Map className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-4 py-2 bg-[#6C5CE7] text-white rounded-full text-sm whitespace-nowrap">
            Tous
          </button>
          <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-full text-sm whitespace-nowrap`}>
            Proche 📍
          </button>
          <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-full text-sm whitespace-nowrap`}>
            Compatible 💚
          </button>
        </div>
      </div>

      {/* Match cards */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-3">
              <AnonymousAvatar mood={match.mood} size="lg" darkMode={darkMode} />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Anonyme</span>
                  <span className="text-2xl">{match.emoji}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DistanceTag distance={match.distance} darkMode={darkMode} />
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00B894]"></div>
                    <span className="text-xs text-[#00B894]">{match.compatibility}% compatible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}>
              {match.text}
            </p>

            {/* Action button */}
            <button 
              onClick={() => onNavigate('chat')}
              className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              <Hand className="w-5 h-5" />
              <span>Dire bonjour</span>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom info */}
      <div className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {matches.length} personnes près de toi
        </p>
      </div>
    </div>
  );
}
