interface AnonymousAvatarProps {
  mood: 'sad' | 'anxious' | 'frustrated' | 'happy' | 'calm' | 'excited';
  size?: 'sm' | 'md' | 'lg';
  darkMode?: boolean;
}

const moodGradients = {
  sad: 'from-blue-400 to-blue-600',
  anxious: 'from-purple-400 to-purple-600',
  frustrated: 'from-red-400 to-red-600',
  happy: 'from-yellow-400 to-yellow-600',
  calm: 'from-green-400 to-green-600',
  excited: 'from-pink-400 to-pink-600',
};

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export default function AnonymousAvatar({ mood, size = 'md', darkMode }: AnonymousAvatarProps) {
  const gradient = moodGradients[mood];
  const sizeClass = sizes[size];

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
      {/* Blurred effect overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
      
      {/* Abstract pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full"></div>
      </div>
    </div>
  );
}
