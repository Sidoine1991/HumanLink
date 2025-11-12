import { useState } from 'react';
import { Mail, Lock, User, Chrome, Apple } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="w-full max-w-[375px] h-[812px] mx-auto bg-[#FAFAFA] flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-[#6C5CE7] to-[#00B894] pt-16 pb-12 px-8 rounded-b-[40px]">
        <h1 className="text-white text-3xl mb-2">
          {isLogin ? 'Bienvenue !' : 'Rejoins-nous'}
        </h1>
        <p className="text-white/90">
          {isLogin ? 'Connecte-toi pour continuer' : 'Crée ton compte gratuitement'}
        </p>
      </div>

      {/* Form container */}
      <div className="flex-1 px-8 py-8">
        {/* Toggle */}
        <div className="bg-white rounded-2xl p-1 flex mb-8 shadow-sm">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl transition-all ${
              isLogin
                ? 'bg-[#6C5CE7] text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl transition-all ${
              !isLogin
                ? 'bg-[#6C5CE7] text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-[#6C5CE7] focus:outline-none transition-colors"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-[#6C5CE7] text-sm">
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#00B894] text-white py-4 rounded-2xl shadow-lg hover:bg-[#00A080] transition-colors mt-6"
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <button className="w-full bg-white border border-gray-200 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
            <Chrome className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700">Continuer avec Google</span>
          </button>

          <button className="w-full bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
            <Apple className="w-5 h-5" />
            <span>Continuer avec Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}
