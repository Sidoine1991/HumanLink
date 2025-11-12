interface MoodButtonProps {
  emoji: string;
  label: string;
  color: string;
  isSelected?: boolean;
  onClick: () => void;
  darkMode?: boolean;
}

export default function MoodButton({ emoji, label, color, isSelected, onClick, darkMode }: MoodButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
        isSelected 
          ? 'scale-105 shadow-lg' 
          : 'hover:scale-105'
      }`}
      style={{
        backgroundColor: isSelected ? color + '20' : (darkMode ? '#1F2937' : 'white'),
        borderWidth: isSelected ? '2px' : '1px',
        borderColor: isSelected ? color : (darkMode ? '#374151' : '#E5E7EB'),
      }}
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isSelected ? 'scale-110' : ''
        }`}
        style={{ backgroundColor: color + '20' }}
      >
        <span className="text-3xl">{emoji}</span>
      </div>
      <span 
        className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
        style={{ color: isSelected ? color : undefined }}
      >
        {label}
      </span>
    </button>
  );
}
