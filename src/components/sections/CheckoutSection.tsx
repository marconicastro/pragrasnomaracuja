/**
 * Checkout Section - Seção final com CTA de compra
 */

'use client';

import { Button } from '@/components/ui/button';
import { DollarSign, Shield, Download, Phone, CheckCircle } from 'lucide-react';

interface CheckoutSectionProps {
  onCheckoutClick: () => void;
}

export function CheckoutSection({ onCheckoutClick }: CheckoutSectionProps) {
  return (
    <div id="checkout" className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          
          <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-8 border-4 border-green-500">
            
            <div className="text-center mb-6 sm:mb-8">
              <div className="bg-green-600 text-white p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-black mb-2">
                  🎯 GARANTA SEU ACESSO AGORA!
                </h2>
                <p className="text-green-100 text-sm sm:text-base">
                  Transforme sua lavoura em 28 dias ou seu dinheiro de volta!
                </p>
              </div>

              {/* Oferta */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
                <div className="text-xs sm:text-sm font-bold mb-2">
                  🔥 OFERTA RELÂMPAGO - SÓ HOJE!
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-2">
                  <div className="text-3xl sm:text-4xl font-black">R$ 39,90</div>
                  <div className="text-lg sm:text-xl line-through opacity-75">R$ 297,00</div>
                  <div className="bg-yellow-400 text-red-600 px-2 sm:px-3 py-1 sm:py-2 rounded-full font-black text-xs sm:text-sm">
                    87% OFF
                  </div>
                </div>
                <div className="text-xs sm:text-sm">💳 Ou 12x de R$ 3,99 sem juros no cartão</div>
              </div>

              {/* Bônus */}
              <div className="bg-yellow-50 border-2 border-yellow-400 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <h3 className="font-bold text-yellow-800 mb-2 sm:mb-3 text-sm sm:text-base">
                  🎁 BÔNUS EXCLUSIVOS (Valor: R$ 497)
                </h3>
                <div className="text-left space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>📱 Suporte via WhatsApp por 30 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>📊 Planilha de controle e monitoramento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>🎥 Vídeos práticos de aplicação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>📋 Lista de produtos por região</span>
                  </div>
                </div>
              </div>

              {/* Garantias */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 text-xs">
                <div className="flex flex-col items-center gap-1 bg-green-50 p-2 sm:p-3 rounded">
                  <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  <span className="font-semibold text-center">Garantia 30 Dias</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-blue-50 p-2 sm:p-3 rounded">
                  <Download className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="font-semibold text-center">Acesso Imediato</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-purple-50 p-2 sm:p-3 rounded">
                  <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  <span className="font-semibold text-center">Suporte Total</span>
                </div>
              </div>

              {/* CTA Final */}
              <Button
                onClick={onCheckoutClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 sm:py-8 px-4 sm:px-6 rounded-lg text-xl sm:text-2xl md:text-3xl transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                COMPRAR AGORA
              </Button>

              <div className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 space-y-1">
                <p>🔒 Compra 100% segura e protegida</p>
                <p>✅ Garantia incondicional de 30 dias</p>
                <p>⚡ Acesso liberado em até 2 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
