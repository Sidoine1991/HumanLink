import { useState } from 'react';
import { Heart, Users, MessageCircle, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Heart,
    title: 'Connecte-toi à tes émotions',
    description: 'Exprime ce que tu ressens en toute authenticité. Tes émotions comptent.',
    gradient: 'from-[#6C5CE7] to-[#00B894]',
  },
  {
    icon: Users,
    title: 'Trouve des personnes qui te comprennent',
    description: 'Rencontre des gens qui ressentent la même chose que toi, près de chez toi.',
    gradient: 'from-[#00B894] to-[#FFA502]',
  },
  {
    icon: MessageCircle,
    title: 'Partage en toute sécurité',
    description: 'Conversations anonymes, bienveillantes et sans jugement. Tu choisis quand révéler ton identité.',
    gradient: 'from-[#FFA502] to-[#6C5CE7]',
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="w-full max-w-[375px] h-[812px] mx-auto bg-[#FAFAFA] flex flex-col">
      {/* Skip button */}
      {currentSlide < slides.length - 1 && (
        <div className="flex justify-end p-6">
          <button
            onClick={onComplete}
            className="text-gray-500"
          >
            Passer
          </button>
        </div>
      )}

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Icon with gradient background */}
        <div className={`w-64 h-64 rounded-full bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-12 relative overflow-hidden`}>
          {/* Animated glow */}
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          
          {/* Glowing heart illustration */}
          <div className="relative">
            <Icon className="w-32 h-32 text-white" strokeWidth={1.5} />
            <div className="absolute inset-0 blur-xl opacity-50">
              <Icon className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-gray-900 text-2xl text-center mb-4 px-4">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center leading-relaxed">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="p-8 pb-12">
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-[#6C5CE7]'
                  : 'w-2 bg-gray-300'
              }`}
            ></div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#00B894] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:bg-[#00A080] transition-colors"
        >
          <span>{currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer'}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
