import { ArrowLeft, Settings, Camera } from 'lucide-react';
import MoodChart from '../components/mood/MoodChart';

interface ProfileProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const moodLegend = [
  { color: '#FBBF24', label: 'Heureux', percentage: 35 },
  { color: '#00B894', label: 'Calme', percentage: 25 },
  { color: '#EC4899', label: 'Excité', percentage: 20 },
  { color: '#6C5CE7', label: 'Anxieux', percentage: 10 },
  { color: '#EF4444', label: 'Frustré', percentage: 7 },
  { color: '#3B82F6', label: 'Triste', percentage: 3 },
];

export default function Profile({ onNavigate, darkMode }: ProfileProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col overflow-y-auto`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('home')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mon Profil</h1>
          <button onClick={() => onNavigate('settings')}>
            <Settings className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>

      {/* Profile header */}
      <div className="px-6 py-8">
        <div className="flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-[#6C5CE7] to-[#00B894] rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">👤</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFA502] rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <h2 className={`text-xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Marie D.</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Membre depuis mars 2024</p>

          {/* Stats */}
          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <div className="text-2xl text-[#6C5CE7] mb-1">42</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Humeurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#00B894] mb-1">18</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connexions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#FFA502] mb-1">127</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Empathies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Analytics */}
      <div className="px-6 pb-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-md mb-4`}>
          <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mes humeurs cette semaine</h3>
          
          {/* Pie chart */}
          <MoodChart type="pie" darkMode={darkMode} />

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {moodLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {item.label} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity chart */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-md mb-4`}>
          <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activité des 7 derniers jours</h3>
          <MoodChart type="bar" darkMode={darkMode} />
        </div>

        {/* Radius slider */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-md`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Rayon de recherche</h3>
            <span className="text-[#6C5CE7]">2.5 km</span>
          </div>
          
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            defaultValue="2500"
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#6C5CE7]"
          />
          
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>500m</span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>10km</span>
          </div>

          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-3`}>
            Définit la distance maximale pour trouver des connexions près de toi
          </p>
        </div>
      </div>

      {/* Spacer for bottom padding */}
      <div className="h-8"></div>
    </div>
  );
}
