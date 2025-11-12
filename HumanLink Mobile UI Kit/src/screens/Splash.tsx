import { Heart } from 'lucide-react';

export default function Splash() {
  return (
    <div className="w-full max-w-[375px] h-[812px] mx-auto bg-gradient-to-br from-[#6C5CE7] via-[#00B894] to-[#6C5CE7] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-75"></div>
      
      {/* Logo */}
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 animate-bounce">
          <Heart className="w-12 h-12 text-[#6C5CE7] fill-[#6C5CE7]" />
        </div>
        
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl -z-10"></div>
      </div>
      
      {/* App name */}
      <h1 className="text-white text-4xl mb-3">HumanLink</h1>
      
      {/* Slogan */}
      <p className="text-white/90 text-center px-12">
        Connecte-toi à tes émotions
      </p>
      
      {/* Loading indicator */}
      <div className="mt-16 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
      </div>
    </div>
  );
}
