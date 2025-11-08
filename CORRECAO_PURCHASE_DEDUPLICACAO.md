# 🔧 Diagnóstico: Navegador Não Está Enviando Eventos

## 📋 Problema Identificado

1. **Navegador não está enviando eventos** (apenas servidor está enviando)
2. **Purchase está OK** - é um evento que vem do webhook, não precisa ser alterado

## 🔍 Situação Atual

### Purchase (Webhook - OK)
- ✅ Purchase vem do webhook (servidor)
- ✅ Não precisa de deduplicação (não há evento do navegador)
- ✅ Está funcionando corretamente
- ✅ Formato: `${orderId}_${timestamp}`

### Outros Eventos (Navegador - PROBLEMA)
- ❌ Navegador não está enviando eventos
- ❌ Apenas servidor está enviando
- ❌ Eventos aparecem como "Desduplicado" porque só há um evento (servidor)

## 🔍 Causa Raiz: Navegador Não Envia Eventos

Possíveis causas:
1. **GTM Server-Side não está processando eventos do navegador**
   - Configuração do GTM Server-Side pode estar bloqueando eventos do browser
   - Triggers podem não estar configurados corretamente

2. **Script do GTM Server-Side não está carregando corretamente**
   - `strategy="lazyOnload"` pode estar causando delay
   - Script pode estar sendo bloqueado por ad blockers

3. **DataLayer não está sendo populado**
   - Eventos podem não estar sendo enviados para o DataLayer
   - GTM Server-Side pode não estar escutando o DataLayer

## ✅ Ações Necessárias (NÃO Implementadas - Apenas Diagnóstico)

### Purchase (NÃO ALTERAR)
- ✅ Purchase está OK - vem do webhook
- ✅ Não precisa de deduplicação
- ✅ Formato correto: `${orderId}_${timestamp}`

### Outros Eventos (VERIFICAR)
- ⚠️ Verificar por que navegador não está enviando eventos
- ⚠️ Verificar configuração do GTM Server-Side
- ⚠️ Verificar se DataLayer está funcionando

## 📊 Situação Atual

### Purchase (OK):
- ✅ Purchase vem do webhook (servidor)
- ✅ Funcionando corretamente
- ✅ Não precisa de deduplicação

### Outros Eventos (PROBLEMA):
- ❌ Navegador não está enviando eventos
- ❌ Apenas servidor está enviando
- ❌ Eventos aparecem como "Desduplicado" porque só há um evento (servidor)

## 🔍 Verificação

### No Meta Events Manager:

1. **Purchase aparece como "Processado"** (OK - é esperado, vem só do servidor)
2. **Outros eventos aparecem como "Desduplicado"** (PROBLEMA - deveriam ter 2 eventos)

### No Console do Navegador:

1. **Verificar se eventos estão sendo enviados para DataLayer:**
   ```javascript
   // Ver eventos no DataLayer
   console.log(window.dataLayer);
   
   // Verificar se GTM Server-Side está carregado
   console.log(window.dataLayer.find(e => e.event === 'gtm.js'));
   ```

2. **Verificar se há requisições para GTM Server-Side:**
   - Abrir DevTools → Network
   - Filtrar por: `event.maracujazeropragas.com`
   - Verificar se há requisições POST para `/data`

3. **Verificar logs de debug:**
   ```
   🔍 DEBUG GTM - DataLayer Push: {
     event: 'view_item',
     event_id: 'ViewContent_1762629859208_80k9g8ct06',
     action_source: 'website',
     ...
   }
   ```

## ⚠️ Sobre Navegador Não Enviar Eventos

Se o navegador ainda não estiver enviando eventos, verificar:

1. **GTM Server-Side está carregado?**
   - Abrir DevTools → Network
   - Procurar por requisições para `event.maracujazeropragas.com`
   - Verificar se há erros 404 ou 500

2. **DataLayer está funcionando?**
   - Abrir Console
   - Digitar: `window.dataLayer`
   - Verificar se eventos estão sendo adicionados

3. **GTM Server-Side está processando eventos?**
   - Verificar configuração do GTM Server-Side (Stape.io)
   - Verificar se há triggers configurados para eventos do navegador
   - Verificar se há filtros bloqueando eventos

4. **Script do GTM está carregando?**
   - Verificar se `strategy="lazyOnload"` não está causando delay
   - Considerar mudar para `strategy="afterInteractive"` se necessário

## 📝 Arquivos Verificados (NÃO Modificados)

1. `src/lib/gtmDataLayer.ts`
   - ✅ `pushPurchase()` está OK (não precisa alterar)
   - ✅ Outros eventos estão enviando para DataLayer corretamente

2. `src/lib/eliteMetaPixelTracking.ts`
   - ✅ `trackPurchaseElite()` está OK (não precisa alterar)
   - ✅ Outros eventos estão sendo disparados corretamente

3. `src/lib/offlineConversions.ts`
   - ✅ `sendPurchaseToGTM()` está OK (formato correto)
   - ✅ Purchase do servidor está funcionando

## 🎯 Próximos Passos

1. ✅ Purchase está OK - não precisa alterar
2. ⚠️ **VERIFICAR**: Por que navegador não está enviando eventos para GTM Server-Side
3. ⚠️ **VERIFICAR**: Configuração do GTM Server-Side (Stape.io)
   - Verificar se triggers estão configurados para eventos do navegador
   - Verificar se há filtros bloqueando eventos
4. ⚠️ **VERIFICAR**: Se DataLayer está sendo populado corretamente
   - Abrir Console → `window.dataLayer`
   - Verificar se eventos estão sendo adicionados

