'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Play, AlertCircle, Loader2 } from 'lucide-react';
import { trackPurchaseElite } from '@/lib/eliteMetaPixelTracking';
import { trackPageViewElite } from '@/lib/eliteMetaPixelTracking';

export default function TestePurchasePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('39.9');

  useEffect(() => {
    // Carregar dados do localStorage (do Lead)
    try {
      const storedData = localStorage.getItem('userTrackingData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.firstName && parsed.lastName) {
          setName(`${parsed.firstName} ${parsed.lastName}`);
        }
      }
    } catch (e) {
      console.warn('⚠️ Erro ao ler localStorage:', e);
    }

    // Gerar order_id de teste único
    setOrderId(`TEST_${Date.now()}`);

    // Disparar PageView (obrigatório antes de Purchase)
    trackPageViewElite({
      page_name: 'Teste Purchase - Manual',
      page_category: 'test'
    });
  }, []);

  const handleTestPurchase = async () => {
    if (!email || !orderId) {
      setStatus('error');
      setMessage('⚠️ Email e Order ID são obrigatórios!');
      return;
    }

    setStatus('loading');
    setMessage('📤 Enviando Purchase via browser + CAPIG...');

    try {
      // Parsear nome
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('🎉 Disparando Purchase de TESTE via browser (EQM 9.3 via CAPIG):', {
        orderId,
        email,
        via: 'Browser + CAPIG Gateway',
        source: 'Teste Manual'
      });

      await trackPurchaseElite(
        orderId,
        {
          email,
          phone: phone || '',
          firstName,
          lastName
        },
        {
          value: parseFloat(value),
          currency: 'BRL',
          // Metadata adicional
          purchase_source: 'manual_test',
          purchase_method: 'test',
          // IMPORTANTE: Marcar como teste
          fb_event_source: 'browser_capig',
          fb_tracking_version: '2.0_elite_browser_test'
        }
      );

      setStatus('success');
      setMessage(`✅ Purchase enviado com sucesso! Order ID: ${orderId}`);
      console.log('✅ Purchase enviado via browser + CAPIG (EQM 9.3 garantido!)');
      console.log('ℹ️ Verifique no Meta Events Manager (Test Events)');
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Erro: ${error.message || 'Erro desconhecido'}`);
      console.error('❌ Erro ao disparar Purchase:', error);
    }
  };

  const handleLoadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('userTrackingData');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.firstName && parsed.lastName) {
          setName(`${parsed.firstName} ${parsed.lastName}`);
        }
        setMessage('✅ Dados carregados do localStorage!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('⚠️ Nenhum dado encontrado no localStorage');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      setMessage('❌ Erro ao ler localStorage');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-4">
              <Play className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🧪 Teste Purchase Manual
          </h1>
          <p className="text-gray-600">
            Simule uma compra sem precisar pagar na Cakto
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order ID (gerado automaticamente)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="TEST_1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
            <button
              onClick={handleLoadFromLocalStorage}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              🔄 Carregar do localStorage (do Lead)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="77998276042"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Marconi Castro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="39.9"
            />
          </div>
        </div>

        {/* Status */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            status === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              {status === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              {status === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleTestPurchase}
          disabled={status === 'loading' || !email || !orderId}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
            status === 'loading' || !email || !orderId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Disparar Purchase (EQM 9.3 via CAPIG)
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left text-xs text-gray-600">
          <p className="font-semibold mb-2">ℹ️ Como funciona:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Dispara Purchase via browser (como na página /obrigado)</li>
            <li>Passa pelo CAPIG Gateway (EQM 9.3 garantido!)</li>
            <li>Aparece no Meta Events Manager como "Test Event"</li>
            <li>Verifique em: Events Manager → Test Events</li>
          </ul>
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left text-xs text-blue-800">
            <p className="font-semibold mb-2">🔍 Debug Info:</p>
            <ul className="space-y-1 font-mono">
              <li>Order ID: {orderId || 'não definido'}</li>
              <li>Email: {email || 'não definido'}</li>
              <li>localStorage: {localStorage.getItem('userTrackingData') ? '✅ tem dados' : '❌ vazio'}</li>
              <li>Meta Pixel: {typeof window !== 'undefined' && typeof window.fbq !== 'undefined' ? '✅ carregado' : '❌ não carregado'}</li>
            </ul>
          </div>
        )}

        {/* Links */}
        <div className="mt-6 text-center space-x-4">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Voltar ao início
          </a>
          <a
            href="/obrigado"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Ver página /obrigado →
          </a>
        </div>
      </div>
    </div>
  );
}

