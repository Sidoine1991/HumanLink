import { X, Frown, Smile } from 'lucide-react';

interface FeedbackProps {
  mood: string;
  onClose: () => void;
  darkMode?: boolean;
}

export default function Feedback({ mood, onClose, darkMode }: FeedbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-2xl transform transition-all`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <X className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#6C5CE7] to-[#00B894] rounded-full flex items-center justify-center">
            <span className="text-3xl">✨</span>
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-xl text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Merci d'avoir partagé !
        </h2>
        
        <p className={`text-center mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Notre analyse correspond à ce que tu ressens ?
        </p>

        {/* Feedback buttons */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={onClose}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            <Frown className="w-8 h-8 text-[#EF4444]" />
            <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Pas vraiment</span>
          </button>

          <button 
            onClick={onClose}
            className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            <Smile className="w-8 h-8 text-[#00B894]" />
            <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Oui, exactement</span>
          </button>
        </div>

        {/* Optional text area */}
        <div className="mb-4">
          <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Des précisions ? (facultatif)
          </label>
          <textarea
            placeholder="Dis-nous en plus..."
            className={`w-full p-3 rounded-xl border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:border-[#6C5CE7] resize-none`}
            rows={3}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white py-3 rounded-xl hover:shadow-lg transition-all"
        >
          Envoyer et continuer
        </button>

        {/* Skip */}
        <button
          onClick={onClose}
          className={`w-full mt-3 py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
        >
          Passer
        </button>
      </div>
    </div>
  );
}
