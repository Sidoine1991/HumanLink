import { ArrowLeft, MapPin, List } from 'lucide-react';

interface MatchMapProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const mapMarkers = [
  { id: 1, mood: 'happy', emoji: '😊', lat: 48.8566, lng: 2.3522, color: '#FBBF24' },
  { id: 2, mood: 'calm', emoji: '😎', lat: 48.8576, lng: 2.3532, color: '#00B894' },
  { id: 3, mood: 'anxious', emoji: '😰', lat: 48.8556, lng: 2.3512, color: '#6C5CE7' },
  { id: 4, mood: 'excited', emoji: '🤩', lat: 48.8586, lng: 2.3542, color: '#EC4899' },
  { id: 5, mood: 'frustrated', emoji: '😡', lat: 48.8546, lng: 2.3502, color: '#EF4444' },
];

export default function MatchMap({ onNavigate, darkMode }: MatchMapProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col relative`}>
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-14 pb-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl text-white">Carte des émotions</h1>
          <button onClick={() => onNavigate('match-list')}>
            <List className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative bg-gray-300 dark:bg-gray-800">
        {/* Mapbox-style background */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: darkMode 
              ? 'linear-gradient(45deg, #1F2937 25%, transparent 25%), linear-gradient(-45deg, #1F2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1F2937 75%), linear-gradient(-45deg, transparent 75%, #1F2937 75%)'
              : 'linear-gradient(45deg, #E5E7EB 25%, transparent 25%), linear-gradient(-45deg, #E5E7EB 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #E5E7EB 75%), linear-gradient(-45deg, transparent 75%, #E5E7EB 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          }}
        >
          {/* Street lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <line x1="0" y1="200" x2="375" y2="200" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
            <line x1="0" y1="400" x2="375" y2="400" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
            <line x1="0" y1="600" x2="375" y2="600" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
            <line x1="100" y1="0" x2="100" y2="812" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
            <line x1="200" y1="0" x2="200" y2="812" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="812" stroke={darkMode ? '#4B5563' : '#9CA3AF'} strokeWidth="2" />
          </svg>
        </div>

        {/* Mood markers */}
        {mapMarkers.map((marker, index) => (
          <button
            key={marker.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110"
            style={{
              left: `${30 + index * 15}%`,
              top: `${35 + (index % 3) * 15}%`,
            }}
          >
            {/* Pulse animation */}
            <div 
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: marker.color, width: '48px', height: '48px', margin: '-12px' }}
            ></div>
            
            {/* Marker */}
            <div
              className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
              style={{ backgroundColor: marker.color }}
            >
              <span className="text-xl">{marker.emoji}</span>
            </div>
          </button>
        ))}

        {/* User location marker */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-[#00B894] rounded-full border-4 border-white shadow-lg"></div>
          <div className="absolute inset-0 bg-[#00B894]/30 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-24 left-6 right-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <h3 className={`text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Légende des émotions</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Heureux</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00B894]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Calme</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6C5CE7]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Anxieux</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EC4899]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Excité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Frustré</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Triste</span>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute right-6 top-32 space-y-2">
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl text-gray-700 dark:text-gray-200">+</span>
        </button>
        <button className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl text-gray-700 dark:text-gray-200">-</span>
        </button>
      </div>
    </div>
  );
}
