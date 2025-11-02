'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CreditCard, User, Mail, Phone } from 'lucide-react';

// Schema de validação do formulário
const checkoutFormSchema = z.object({
  fullName: z.string()
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres')
    .refine(
      (value) => {
        // Permitir letras, espaços e caracteres comuns em nomes
        return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value.trim());
      },
      'Nome deve conter apenas letras, espaços, apóstrofos e hífens'
    ),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(14, 'Telefone deve ter formato completo (XX) XXXXX-XXXX')
    .refine(
      (value) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 11;
      },
      'Telefone deve ter 10 ou 11 dígitos'
    ),
  orderBump: z.boolean().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

interface PreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutFormData & { orderBump: boolean }) => void;
}

// Configuração do Order Bump (EDITE AQUI!)
const ORDER_BUMP_CONFIG = {
  enabled: true,                                      // true = ativar order bump
  value: 19.9,                                        // Valor do order bump
  title: '🎁 OFERTA ESPECIAL: Guia Completo de Controle de Pragas',
  description: 'Receba também o guia completo com 50 receitas naturais para eliminar pragas. Valor: R$ 29,90',
  discount: 'De R$ 29,90 por apenas R$ 19,90 (33% OFF)',
  checked: false,                                     // true = marcado por padrão
};

export default function PreCheckoutModal({ isOpen, onClose, onSubmit }: PreCheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderBumpChecked, setOrderBumpChecked] = useState(ORDER_BUMP_CONFIG.checked);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      orderBump: ORDER_BUMP_CONFIG.checked,
    }
  });

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length === 0) return value;
    
    const limitedCleaned = cleaned.substring(0, 11);
    
    if (limitedCleaned.length <= 2) {
      return `(${limitedCleaned}`;
    } else if (limitedCleaned.length <= 6) {
      const ddd = limitedCleaned.substring(0, 2);
      const firstPart = limitedCleaned.substring(2);
      return `(${ddd}) ${firstPart}`;
    } else if (limitedCleaned.length <= 10) {
      const ddd = limitedCleaned.substring(0, 2);
      const firstPart = limitedCleaned.substring(2, 6);
      const secondPart = limitedCleaned.substring(6);
      return `(${ddd}) ${firstPart}-${secondPart}`;
    } else {
      const ddd = limitedCleaned.substring(0, 2);
      const firstPart = limitedCleaned.substring(2, 7);
      const secondPart = limitedCleaned.substring(7);
      return `(${ddd}) ${firstPart}-${secondPart}`;
    }
  };

  // Handlers para formatação em tempo real
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('phone', formatted);
  };

  const onFormSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...data,
        orderBump: orderBumpChecked || false
      });
      reset();
      setOrderBumpChecked(ORDER_BUMP_CONFIG.checked); // Reset order bump
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetar formulário quando o modal fechar
  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader className="text-center sm:text-left space-y-2 sm:space-y-3">
          <DialogTitle className="flex items-center justify-center sm:justify-start gap-2 text-lg sm:text-xl font-bold">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
            <span className="text-center sm:text-left">Finalize sua compra com segurança</span>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-center sm:text-left">
            Preencha seus dados para acessar o pagamento seguro e pré-preenchido
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-5">
          {/* Campo Nome Completo */}
          <div className="space-y-2">
            <Label htmlFor="precheckout_full_name" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 flex-shrink-0" />
              Nome Completo *
            </Label>
            <Input
              id="precheckout_full_name"
              name="precheckout_full_name"
              placeholder="Ex: João Silva"
              {...register('fullName')}
              className={`h-11 sm:h-12 text-base ${errors.fullName ? 'border-red-500' : ''}`}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 flex items-start gap-1">
                <span className="text-red-500 mt-0.5">•</span>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Campo E-mail */}
          <div className="space-y-2">
            <Label htmlFor="precheckout_email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 flex-shrink-0" />
              E-mail *
            </Label>
            <Input
              id="precheckout_email"
              name="precheckout_email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className={`h-11 sm:h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-start gap-1">
                <span className="text-red-500 mt-0.5">•</span>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Telefone */}
          <div className="space-y-2">
            <Label htmlFor="precheckout_phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="w-4 h-4 flex-shrink-0" />
              Telefone *
            </Label>
            <Input
              id="precheckout_phone"
              name="precheckout_phone"
              placeholder="(11) 99999-9999"
              {...register('phone')}
              onChange={handlePhoneChange}
              maxLength={15}
              className={`h-11 sm:h-12 text-base ${errors.phone ? 'border-red-500' : ''}`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 flex items-start gap-1">
                <span className="text-red-500 mt-0.5">•</span>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* ORDER BUMP */}
          {ORDER_BUMP_CONFIG.enabled && (
            <div className={`border-2 rounded-lg p-4 transition-all duration-200 ${
              orderBumpChecked 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="orderBump"
                  {...register('orderBump')}
                  checked={orderBumpChecked}
                  onChange={(e) => setOrderBumpChecked(e.target.checked)}
                  className="w-5 h-5 mt-1 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="orderBump" className="cursor-pointer flex-1">
                  <div className="font-bold text-sm sm:text-base mb-1">
                    {ORDER_BUMP_CONFIG.title}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    {ORDER_BUMP_CONFIG.description}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs text-gray-500 line-through">R$ 29,90</span>
                    <span className="text-sm sm:text-base font-bold text-green-600">
                      R$ {ORDER_BUMP_CONFIG.value.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded w-fit">
                      33% OFF
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 h-12 sm:h-14 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                <span className="animate-pulse text-sm sm:text-base">Processando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">IR PARA O PAGAMENTO SEGURO</span>
              </div>
            )}
          </Button>

          {/* Selos de Segurança */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="text-center">Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-center">Criptografia SSL</span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}