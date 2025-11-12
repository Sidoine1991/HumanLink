import { ArrowLeft, Moon, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

interface SettingsProps {
  onNavigate: (screen: any) => void;
  darkMode?: boolean;
  onToggleDarkMode: () => void;
}

export default function Settings({ onNavigate, darkMode, onToggleDarkMode }: SettingsProps) {
  return (
    <div className={`w-full max-w-[375px] h-[812px] mx-auto ${darkMode ? 'bg-gray-900' : 'bg-[#FAFAFA]'} flex flex-col`}>
      {/* Header */}
      <div className={`px-6 pt-14 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('profile')}>
            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`} />
          </button>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Paramètres</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Appearance section */}
        <div>
          <h2 className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Apparence</h2>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-sm`}>
            <button
              onClick={onToggleDarkMode}
              className={`w-full px-4 py-4 flex items-center justify-between ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              } transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Moon className={`w-5 h-5 ${darkMode ? 'text-[#FFA502]' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>Mode sombre</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {darkMode ? 'Activé' : 'Désactivé'}
                  </div>
                </div>
              </div>
              <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-[#6C5CE7]' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Notifications section */}
        <div>
          <h2 className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notifications</h2>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-sm`}>
            <button className={`w-full px-4 py-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>Notifications push</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recevoir des alertes
                  </div>
                </div>
              </div>
              <div className="w-12 h-7 bg-[#6C5CE7] rounded-full p-1">
                <div className="w-5 h-5 bg-white rounded-full translate-x-5"></div>
              </div>
            </button>

            <button className={`w-full px-4 py-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>Nouveaux messages</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Alertes de chat
                  </div>
                </div>
              </div>
              <div className="w-12 h-7 bg-[#6C5CE7] rounded-full p-1">
                <div className="w-5 h-5 bg-white rounded-full translate-x-5"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Privacy & Security section */}
        <div>
          <h2 className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confidentialité & Sécurité</h2>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-sm`}>
            <button className={`w-full px-4 py-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Shield className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>Données personnelles</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Gérer tes données
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Support section */}
        <div>
          <h2 className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Support</h2>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden shadow-sm`}>
            <button className={`w-full px-4 py-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>Centre d'aide</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    FAQ et support
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </button>

            <button className={`w-full px-4 py-4 flex items-center justify-between ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <HelpCircle className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
                </div>
                <div className="text-left">
                  <div className={darkMode ? 'text-white' : 'text-gray-900'}>À propos</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Version 1.0.0
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={() => onNavigate('auth')}
          className="w-full bg-red-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-md"
        >
          <LogOut className="w-5 h-5" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
