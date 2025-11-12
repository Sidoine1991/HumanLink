import { ArrowLeft, Heart, MessageCircle, UserPlus, TrendingUp } from 'lucide-react';

interface NotificationsProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
}

const notifications = [
  {
    id: 1,
    type: 'match',
    icon: Heart,
    color: '#EC4899',
    title: 'Nouvelle connexion !',
    message: 'Quelqu\'un ressent la même chose que toi près de chez toi',
    time: 'il y a 5 min',
    unread: true,
  },
  {
    id: 2,
    type: 'message',
    icon: MessageCircle,
    color: '#6C5CE7',
    title: 'Nouveau message',
    message: 'Tu as reçu un message dans une conversation anonyme',
    time: 'il y a 15 min',
    unread: true,
  },
  {
    id: 3,
    type: 'empathy',
    icon: Heart,
    color: '#00B894',
    title: '12 personnes te comprennent',
    message: 'Ton humeur a reçu des empathies',
    time: 'il y a 1h',
    unread: false,
  },
  {
    id: 4,
    type: 'connection',
    icon: UserPlus,
    color: '#FFA502',
    title: 'Marie a révélé son identité',
    message: 'Vous pouvez maintenant échanger librement',
    time: 'il y a 2h',
    unread: false,
  },
  {
    id: 5,
    type: 'insight',
    icon: TrendingUp,
    color: '#6C5CE7',
    title: 'Analyse hebdomadaire disponible',
    message: 'Découvre l\'évolution de tes humeurs cette semaine',
    time: 'il y a 1 jour',
    unread: false,
  },
  {
    id: 6,
    type: 'match',
    icon: Heart,
    color: '#EC4899',
    title: '3 nouvelles suggestions',
    message: 'Des personnes près de toi partagent tes émotions',
    time: 'il y a 1 jour',
    unread: false,
  },
];

export default function Notifications({ onNavigate, darkMode }: NotificationsProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('home')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h1>
          <button className="text-[#6C5CE7] text-sm">
            Tout lire
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          <button className="px-4 py-2 bg-[#6C5CE7] text-white rounded-full text-sm whitespace-nowrap">
            Toutes
          </button>
          <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-full text-sm whitespace-nowrap`}>
            Messages
          </button>
          <button className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} rounded-full text-sm whitespace-nowrap`}>
            Connexions
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          
          return (
            <button
              key={notif.id}
              onClick={() => {
                if (notif.type === 'message') {
                  onNavigate('chat');
                } else if (notif.type === 'match' || notif.type === 'connection') {
                  onNavigate('match-list');
                }
              }}
              className={`w-full px-6 py-4 flex gap-4 ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-white'
              } transition-colors border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} ${
                notif.unread ? (darkMode ? 'bg-gray-800/50' : 'bg-white') : ''
              }`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: notif.color + '20' }}
              >
                <Icon className="w-6 h-6" style={{ color: notif.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} ${notif.unread ? '' : ''}`}>
                    {notif.title}
                  </h3>
                  {notif.unread && (
                    <div className="w-2 h-2 bg-[#6C5CE7] rounded-full mt-1"></div>
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {notif.message}
                </p>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {notif.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
