/**
 * Hero Section - Seção principal da landing page
 */

'use client';

import { Button } from '@/components/ui/button';
import { Award, Rocket, Star, Users, TrendingUp } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold text-xs sm:text-sm mb-4 sm:mb-6">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
            MÉTODO VALIDADO PELA EMBRAPA
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-4 leading-tight">
            <span className="text-red-600">PARE DE JOGAR</span><br />
            <span className="text-gray-800">DINHEIRO FORA</span><br />
            <span className="text-green-600">COM O TRIPS!</span>
          </h1>

          {/* Logo do E-book */}
          <div className="mb-4 sm:mb-6">
            <OptimizedImage 
              src="/ebook-logo.webp" 
              alt="E-book Sistema de Controle de Trips" 
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
              style={{ maxWidth: '200px' }}
              priority={true}
              width={200}
              height={200}
              fetchPriority="high"
            />
          </div>

          {/* Sub-headline */}
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-4 sm:mb-6 font-semibold px-2">
            Descubra o <span className="text-green-600 font-black">Sistema de 4 Fases</span> que elimina 
            o trips de vez e <span className="text-green-600 font-black">economiza até R$ 5.000 por hectare</span> 
            em defensivos ineficazes
          </p>

          {/* Prova Social */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg mb-4 sm:mb-6 inline-block">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="font-bold">+1.247 produtores</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
                <span className="font-bold">4.9/5 estrelas</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="font-bold">94% de sucesso</span>
              </div>
            </div>
          </div>

          {/* CTA Principal */}
          <Button 
            onClick={onCtaClick}
            className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 sm:py-6 px-6 sm:px-12 rounded-full text-base sm:text-xl md:text-2xl mb-4 sm:mb-6 transform hover:scale-105 transition-all duration-200 shadow-2xl animate-bounce w-full sm:w-auto"
          >
            <Rocket className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            QUERO ECONOMIZAR R$ 5.000 AGORA!
          </Button>

          {/* Oferta */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-lg shadow-xl">
            <div className="text-xs sm:text-sm font-bold mb-2">🔥 OFERTA RELÂMPAGO - APENAS HOJE!</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <div className="text-2xl sm:text-3xl font-black">R$ 39,90</div>
              <div className="text-base sm:text-lg line-through opacity-75">R$ 297,00</div>
              <div className="bg-yellow-400 text-red-600 px-2 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm">
                87% OFF
              </div>
            </div>
            <div className="text-xs sm:text-sm mt-2">💳 Ou 12x de R$ 3,99 sem juros</div>
          </div>
        </div>
      </div>
    </div>
  );
}
