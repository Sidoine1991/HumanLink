import { useState } from 'react';
import { Bell, User, Send } from 'lucide-react';
import MoodButton from '../components/mood/MoodButton';

interface HomeProps {
  onMoodSubmit: (mood: string) => void;
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const moods = [
  { emoji: '😔', label: 'Triste', value: 'sad', color: '#3B82F6' },
  { emoji: '😰', label: 'Anxieux', value: 'anxious', color: '#6C5CE7' },
  { emoji: '😡', label: 'Frustré', value: 'frustrated', color: '#EF4444' },
  { emoji: '😊', label: 'Heureux', value: 'happy', color: '#FBBF24' },
  { emoji: '😎', label: 'Calme', value: 'calm', color: '#00B894' },
  { emoji: '🤩', label: 'Excité', value: 'excited', color: '#EC4899' },
];

export default function Home({ onMoodSubmit, onNavigate, darkMode }: HomeProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodText, setMoodText] = useState('');

  const handleSubmit = () => {
    if (selectedMood) {
      onMoodSubmit(selectedMood);
    }
  };

  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>HumanLink</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('notifications')}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <User className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Mood Check-in Card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-lg mb-6`}>
          <h2 className={`text-xl text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Comment te sens-tu là,
          </h2>
          <h2 className={`text-xl text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            tout de suite ?
          </h2>

          {/* Mood grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {moods.map((mood) => (
              <MoodButton
                key={mood.value}
                emoji={mood.emoji}
                label={mood.label}
                color={mood.color}
                isSelected={selectedMood === mood.value}
                onClick={() => setSelectedMood(mood.value)}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* Text area */}
          <textarea
            value={moodText}
            onChange={(e) => setMoodText(e.target.value)}
            placeholder="Partage ce que tu ressens... (facultatif)"
            className={`w-full p-4 rounded-2xl border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:border-[#6C5CE7] resize-none mb-4`}
            rows={3}
          />

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all ${
              selectedMood
                ? 'bg-[#00B894] text-white hover:bg-[#00A080]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Partager mon humeur</span>
          </button>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('timeline')}
            className={`w-full p-4 rounded-2xl ${
              darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
            } shadow-md hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#00B894] rounded-full"></div>
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>Voir la timeline</div>
                <div className="text-gray-500 text-sm">Découvre ce que ressentent les autres</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('match-list')}
            className={`w-full p-4 rounded-2xl ${
              darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'
            } shadow-md hover:shadow-lg transition-shadow text-left`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FFA502] to-[#6C5CE7] rounded-full"></div>
              <div>
                <div className={darkMode ? 'text-white' : 'text-gray-900'}>Trouver des connexions</div>
                <div className="text-gray-500 text-sm">Rencontre des personnes comme toi</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
