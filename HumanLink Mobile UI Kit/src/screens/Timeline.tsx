import { ArrowLeft, Home, Search, Users, User, ThumbsUp, MessageCircle } from 'lucide-react';
import AnonymousAvatar from '../components/mood/AnonymousAvatar';
import DistanceTag from '../components/mood/DistanceTag';

interface TimelineProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const timelineData = [
  {
    id: 1,
    mood: 'anxious' as const,
    emoji: '😰',
    text: "Je me sens un peu stressé aujourd'hui... Trop de choses à gérer.",
    distance: 0.8,
    reactions: 12,
    time: 'il y a 5 min',
  },
  {
    id: 2,
    mood: 'happy' as const,
    emoji: '😊',
    text: 'Belle journée ! Le soleil me donne de l\'énergie positive 🌞',
    distance: 1.2,
    reactions: 24,
    time: 'il y a 15 min',
  },
  {
    id: 3,
    mood: 'calm' as const,
    emoji: '😎',
    text: 'Après une bonne méditation, je me sens tellement plus léger.',
    distance: 2.5,
    reactions: 8,
    time: 'il y a 32 min',
  },
  {
    id: 4,
    mood: 'frustrated' as const,
    emoji: '😡',
    text: 'Les transports en commun... Pourquoi c\'est toujours aussi compliqué ?',
    distance: 0.3,
    reactions: 15,
    time: 'il y a 1h',
  },
  {
    id: 5,
    mood: 'excited' as const,
    emoji: '🤩',
    text: 'Trop hâte pour ce soir ! Ça va être génial !',
    distance: 1.8,
    reactions: 19,
    time: 'il y a 2h',
  },
];

export default function Timeline({ onNavigate, darkMode }: TimelineProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('home')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Timeline</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Timeline cards */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {timelineData.map((post) => (
          <div
            key={post.id}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 shadow-md`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <AnonymousAvatar mood={post.mood} darkMode={darkMode} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Anonyme</span>
                    <DistanceTag distance={post.distance} darkMode={darkMode} />
                  </div>
                  <span className="text-gray-500 text-xs">{post.time}</span>
                </div>
              </div>
              <span className="text-3xl">{post.emoji}</span>
            </div>

            {/* Content */}
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 leading-relaxed`}>
              {post.text}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-[#6C5CE7]/10 to-[#00B894]/10 text-[#6C5CE7] dark:text-[#00B894] py-3 rounded-xl flex items-center justify-center gap-2 hover:from-[#6C5CE7]/20 hover:to-[#00B894]/20 transition-all">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">Je ressens la même chose</span>
                <span className="text-xs opacity-60">({post.reactions})</span>
              </button>
              
              <button 
                onClick={() => onNavigate('chat')}
                className={`px-5 py-3 rounded-xl ${
                  darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                } hover:bg-[#FFA502]/20 hover:text-[#FFA502] transition-all`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-6 py-4 shadow-lg`}>
        <div className="flex items-center justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-[#00B894]" />
            <span className="text-xs text-[#00B894]">Accueil</span>
          </button>
          <button 
            onClick={() => onNavigate('match-list')}
            className={`flex flex-col items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Explorer</span>
          </button>
          <button className={`flex flex-col items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Users className="w-6 h-6" />
            <span className="text-xs">Timeline</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
