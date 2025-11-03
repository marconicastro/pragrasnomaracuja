# 🔧 Solução: CAPIG Timing e Configuração

## 📊 Problema Identificado

**Sintoma:**
- CAPIG recebe apenas 1 evento (InputData - customizado)
- CAPIG não está enviando eventos para Meta (0 sent)
- Eventos standard (PageView, ViewContent, etc.) não aparecem no dashboard da CAPIG

**Causa Raiz:**
Os eventos estão sendo disparados **ANTES** do CAPIG estar totalmente configurado. Os comandos `fbq('set', ...)` são assíncronos e precisam de tempo para processar.

---

## ✅ Soluções Implementadas

### 1. **Delay Antes de Disparar Eventos**
```typescript
// ANTES: Disparava imediatamente
trackPageViewElite();

// AGORA: Aguarda 1 segundo para CAPIG configurar
setTimeout(() => {
  // Verificar se CAPIG está configurado
  // Disparar eventos apenas após confirmação
}, 1000);
```

### 2. **Verificação de Configuração**
```typescript
// Verificar se server_event_uri está realmente configurado
const pixelState = window._fbq?.getState?.();
if (pixelState?.pixels?.[pixelId]) {
  const capigConfig = {
    server_event_uri: pixelState.pixels[pixelId].server_event_uri,
    agent: pixelState.pixels[pixelId].agent,
    autoConfig: pixelState.pixels[pixelId].autoConfig
  };
  
  // Verificar se configuração está correta
  if (capigConfig.server_event_uri?.includes('capigateway')) {
    // CAPIG configurado! Disparar eventos
    trackPageViewElite();
  }
}
```

### 3. **Logs Detalhados para Debug**
```typescript
console.log('✅ CAPIG pronto! Config:', {
  server_event_uri: capigConfig.server_event_uri,
  agent: capigConfig.agent,
  autoConfig: capigConfig.autoConfig,
  pixelId: pixelId
});

trackPageViewElite().then(result => {
  console.log('📊 PageView result:', result);
});
```

### 4. **Fallback e Retry**
```typescript
// Se configuração falhar, tentar novamente
if (!isConfigured) {
  // Reconfigurar CAPIG
  window.fbq('set', 'autoConfig', false, pixelId);
  window.fbq('set', 'agent', 'stape', pixelId);
  window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
  
  // Aguardar e tentar novamente
  setTimeout(() => {
    trackPageViewElite();
  }, 500);
}
```

---

## 🔍 Como Verificar se Está Funcionando

### 1. **Console do Navegador**
Abra o DevTools (F12) e verifique os logs:
```
✅ ELITE Meta Pixel inicializado
📡 CAPIG URL: https://capigateway.maracujazeropragas.com
✅ CAPIG Config verificado: { server_event_uri: "...", agent: "stape", ... }
✅ CAPIG pronto! Disparando PageView...
📊 PageView result: { success: true, eventId: "..." }
```

### 2. **Meta Pixel Helper**
Instale a extensão Meta Pixel Helper e verifique:
- ✅ Eventos sendo disparados
- ✅ `server_event_uri` configurado
- ✅ Event ID presente

### 3. **Dashboard CAPIG**
Aguarde 10-15 minutos e verifique:
- ✅ Events received > 0 (deve aumentar)
- ✅ Events sent > 0 (deve aumentar)
- ✅ Event types: PageView, ViewContent, etc.

---

## 📝 Arquivos Modificados

1. **`src/components/EliteMetaPixel.tsx`**
   - Adicionado delay de 1 segundo antes de disparar eventos
   - Verificação de configuração do CAPIG
   - Logs detalhados para debug
   - Fallback e retry automático

---

## 🎯 Próximos Passos

1. **Testar localmente**
   - Abra o site
   - Verifique console do navegador
   - Confirme que CAPIG está configurado antes dos eventos

2. **Aguardar 10-15 minutos**
   - Verifique dashboard da CAPIG
   - Confirme que eventos estão sendo recebidos E enviados

3. **Se ainda não funcionar:**
   - Verificar se URL precisa de `/events` no final
   - Verificar se Pixel ID está correto na CAPIG
   - Verificar se Access Token está correto na CAPIG

---

## ⚠️ Notas Importantes

1. **Timing é Crítico**: Os comandos `fbq('set', ...)` são assíncronos. Sempre aguardar antes de disparar eventos.

2. **Verificação Necessária**: Não assuma que CAPIG está configurado. Sempre verifique antes de disparar.

3. **Logs são Essenciais**: Use os logs do console para debugar problemas.

4. **Atraso no Dashboard**: Eventos podem levar 10-15 minutos para aparecer no dashboard da CAPIG.

---

## 🔗 Referências

- Meta Pixel Documentation: https://developers.facebook.com/docs/meta-pixel
- Stape CAPIG: https://stape.io/conversions-api-gateway
- Meta Events Manager: https://business.facebook.com/events_manager2

