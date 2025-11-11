# 🔍 Guia de Diagnóstico: GTM Server-Side → Meta CAPI

**Objetivo:** Identificar o que o GTM Server-Side está enviando para Meta CAPI e comparar com o que está no DataLayer.

---

## 📋 MÉTODO 1: Verificar DataLayer no Navegador (Mais Fácil)

### **Passo 1: Abrir Console do Navegador**
```
1. Abrir site: https://www.maracujazeropragas.com
2. Pressionar F12 (DevTools)
3. Ir para aba "Console"
```

### **Passo 2: Verificar Eventos no DataLayer**
```javascript
// No console, executar:
console.log('📊 DataLayer completo:', window.dataLayer);

// Filtrar apenas eventos recentes:
const recentEvents = window.dataLayer.filter(e => 
  e.event && ['page_view', 'view_item', 'add_to_cart', 'begin_checkout', 'generate_lead'].includes(e.event)
);
console.log('📊 Eventos recentes:', recentEvents);

// Verificar event_id em cada evento:
recentEvents.forEach(event => {
  console.log(`📌 ${event.event}:`, {
    event_id: event.event_id,
    action_source: event.action_source,
    has_user_data: !!event.user_data,
    user_data_keys: event.user_data ? Object.keys(event.user_data) : [],
    user_data: event.user_data
  });
});
```

### **O que verificar:**
- ✅ `event_id` está presente em TODOS os eventos?
- ✅ `action_source: 'website'` está presente?
- ✅ `user_data` está completo (email, phone, fbp, fbc, etc)?
- ✅ `user_data.user_id` (external_id) está presente?

---

## 📋 MÉTODO 2: GTM Debug Mode (Recomendado)

### **Passo 1: Ativar GTM Preview Mode**
```
1. Acessar: https://tagmanager.google.com
2. Selecionar container: GTM-WCDP2ZLH (Web) ou GTM-W4PGS3LR (Server)
3. Clicar em "Preview"
4. Inserir URL: https://www.maracujazeropragas.com
5. Clicar em "Connect"
```

### **Passo 2: Verificar Tags Disparadas**
```
1. No Preview Mode, verificar aba "Tags"
2. Procurar por tags "FB - ViewContent", "FB - InitiateCheckout", etc
3. Clicar em cada tag para ver detalhes
4. Verificar:
   - ✅ Tag está disparando?
   - ✅ event_id está sendo capturado?
   - ✅ user_data está completo?
```

### **Passo 3: Verificar Variáveis**
```
1. No Preview Mode, ir para aba "Variables"
2. Procurar por: "ed - event_id"
3. Verificar se está capturando o valor correto
4. Verificar outras variáveis:
   - user_data.email_address
   - user_data.phone_number
   - user_data.fbp
   - user_data.fbc
```

---

## 📋 MÉTODO 3: Verificar Logs do GTM Server-Side (Stape.io)

### **Passo 1: Acessar Dashboard Stape**
```
1. Acessar: https://stape.io
2. Fazer login
3. Selecionar container: event.maracujazeropragas.com
4. Ir para "Logs" ou "Events"
```

### **Passo 2: Verificar Eventos Enviados**
```
1. Filtrar por evento: "InitiateCheckout", "ViewContent", etc
2. Clicar em um evento para ver detalhes
3. Verificar:
   - ✅ event_id está presente?
   - ✅ action_source está correto?
   - ✅ user_data está completo?
   - ✅ Qual URL foi chamada? (Meta CAPI endpoint)
```

### **Passo 3: Verificar Resposta do Meta**
```
1. Verificar status da resposta (200 OK?)
2. Verificar se há erros
3. Verificar se Meta aceitou o evento
```

---

## 📋 MÉTODO 4: Meta Events Manager (Test Events)

### **Passo 1: Ativar Test Event Code**
```bash
# No .env, adicionar:
META_TEST_EVENT_CODE=TEST12345
```

### **Passo 2: Verificar no Meta Events Manager**
```
1. Acessar: https://business.facebook.com/events_manager2
2. Selecionar Pixel: 1403975024017865
3. Ir para "Test Events"
4. Disparar evento no site
5. Verificar se aparece em "Test Events"
```

### **Passo 3: Comparar Eventos**
```
1. Verificar evento do navegador:
   - event_id: "InitiateCheckout_..."
   - action_source: "website"
   - user_data: { ... }

2. Verificar evento do servidor (se aparecer):
   - event_id: "InitiateCheckout_..." (DEVE SER IGUAL!)
   - action_source: "website" (DEVE SER IGUAL!)
   - user_data: { ... } (DEVE SER IGUAL!)
```

---

## 📋 MÉTODO 5: Network Tab (Ver Requisições HTTP)

### **Passo 1: Abrir Network Tab**
```
1. F12 → Network
2. Filtrar por "facebook" ou "graph.facebook"
3. Disparar evento no site
```

### **Passo 2: Verificar Requisições**
```
1. Procurar por requisições para:
   - graph.facebook.com/v18.0/{pixelId}/events
   - event.maracujazeropragas.com (GTM Server-Side)

2. Clicar em cada requisição
3. Ver aba "Payload" ou "Request"
4. Verificar:
   - ✅ event_id está no payload?
   - ✅ action_source está correto?
   - ✅ user_data está completo?
```

---

## 📋 MÉTODO 6: Criar Script de Debug (Mais Completo)

### **Adicionar ao código (temporário):**

```typescript
// Adicionar em src/lib/gtmDataLayer.ts
export function pushToDataLayer(eventData: DataLayerEvent, eventId?: string): void {
  // ... código existente ...
  
  try {
    window.dataLayer.push(eventDataWithMeta);
    
    // ✅ DEBUG COMPLETO (sempre ativo)
    console.log('🔍 DEBUG COMPLETO - DataLayer:', {
      event: eventDataWithMeta.event,
      event_id: finalEventId,
      action_source: eventDataWithMeta.action_source,
      user_data: eventDataWithMeta.user_data,
      user_data_keys: eventDataWithMeta.user_data ? Object.keys(eventDataWithMeta.user_data) : [],
      custom_data: {
        value: eventDataWithMeta.value,
        currency: eventDataWithMeta.currency,
        content_ids: eventDataWithMeta.content_ids,
        num_items: eventDataWithMeta.num_items
      },
      timestamp: new Date().toISOString(),
      dataLayer_length: window.dataLayer.length
    });
    
    // ✅ Salvar no localStorage para comparação
    const debugKey = `gtm_debug_${eventDataWithMeta.event}_${Date.now()}`;
    localStorage.setItem(debugKey, JSON.stringify({
      event: eventDataWithMeta.event,
      event_id: finalEventId,
      action_source: eventDataWithMeta.action_source,
      user_data: eventDataWithMeta.user_data,
      timestamp: new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('❌ Erro ao enviar para DataLayer:', error);
  }
}
```

---

## 📋 MÉTODO 7: Comparar com Meta Events Manager (Produção)

### **Passo 1: Disparar Evento Real**
```
1. Acessar site em produção
2. Disparar evento (ex: InitiateCheckout)
3. Anotar event_id do console
```

### **Passo 2: Verificar no Meta Events Manager**
```
1. Acessar: https://business.facebook.com/events_manager2
2. Pixel: 1403975024017865
3. Ir para "Activity" (não Test Events)
4. Filtrar por evento: "InitiateCheckout"
5. Procurar pelo event_id anotado
```

### **Passo 3: Comparar Dados**
```
1. Verificar evento do navegador:
   - event_id: "InitiateCheckout_..."
   - action_source: "website"
   - Parâmetros de correspondência avançada: Email, IP, etc

2. Verificar evento do servidor (se aparecer):
   - event_id: "InitiateCheckout_..." (DEVE SER IGUAL!)
   - action_source: "website" (DEVE SER IGUAL!)
   - Chaves de dados do usuário: DEVE TER OS MESMOS CAMPOS!
```

---

## 🎯 CHECKLIST DE DIAGNÓSTICO

### **1. DataLayer (Navegador)**
```
□ event_id está presente em TODOS os eventos?
□ action_source: 'website' está presente?
□ user_data está completo?
□ user_data.user_id (external_id) está presente?
□ user_data.fbp está presente?
□ user_data.fbc está presente?
```

### **2. GTM Server-Side (Stape.io)**
```
□ Tag está disparando?
□ Variável {{ed - event_id}} está capturando valor?
□ user_data está sendo preservado?
□ action_source está sendo preservado?
□ Requisição está sendo enviada para Meta CAPI?
```

### **3. Meta CAPI (Resposta)**
```
□ Status 200 OK?
□ Sem erros na resposta?
□ Evento aparece no Meta Events Manager?
□ event_id está correto?
□ action_source está correto?
□ user_data está completo?
```

### **4. Meta Events Manager (Comparação)**
```
□ Evento do navegador aparece?
□ Evento do servidor aparece?
□ event_id é IGUAL entre navegador e servidor?
□ action_source é IGUAL entre navegador e servidor?
□ user_data tem os MESMOS campos?
□ Deduplicação está funcionando corretamente?
```

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### **Problema 1: event_id não está no DataLayer**
**Sintoma:** `window.dataLayer` não mostra `event_id`

**Solução:**
- Verificar se `pushToDataLayer()` está recebendo `eventId`
- Verificar se `eventId` não está `undefined`
- Adicionar log para verificar

### **Problema 2: GTM não captura event_id**
**Sintoma:** Variável `{{ed - event_id}}` está vazia

**Solução:**
- Verificar se variável está configurada corretamente
- Verificar se está capturando do campo correto
- Testar com valor fixo para verificar

### **Problema 3: user_data diferente**
**Sintoma:** Navegador tem mais campos que servidor

**Solução:**
- Verificar se GTM está processando todos os campos
- Verificar se há normalização/hashing diferente
- Comparar campo por campo

### **Problema 4: action_source diferente**
**Sintoma:** Navegador tem `'website'`, servidor tem outro valor

**Solução:**
- Verificar se GTM está preservando `action_source`
- Verificar se tag está configurada corretamente
- Verificar se há override no GTM

---

## 📊 TEMPLATE DE RELATÓRIO DE DIAGNÓSTICO

```markdown
## Diagnóstico GTM Server-Side - [DATA]

### Evento Testado: InitiateCheckout

### 1. DataLayer (Navegador)
- event_id: ✅ Presente / ❌ Ausente
- Valor: "InitiateCheckout_..."
- action_source: ✅ Presente / ❌ Ausente
- Valor: "website"
- user_data: ✅ Completo / ❌ Incompleto
- Campos: email, phone, fbp, fbc, user_id, city, state, zip, country

### 2. GTM Server-Side (Stape.io)
- Tag disparou: ✅ Sim / ❌ Não
- event_id capturado: ✅ Sim / ❌ Não
- Valor: "InitiateCheckout_..."
- user_data preservado: ✅ Sim / ❌ Não
- action_source preservado: ✅ Sim / ❌ Não
- Requisição enviada: ✅ Sim / ❌ Não
- Status: 200 OK / ❌ Erro

### 3. Meta CAPI (Resposta)
- Status: 200 OK / ❌ Erro
- Erro (se houver): "..."
- Evento aceito: ✅ Sim / ❌ Não

### 4. Meta Events Manager
- Evento navegador aparece: ✅ Sim / ❌ Não
- Evento servidor aparece: ✅ Sim / ❌ Não
- event_id igual: ✅ Sim / ❌ Não
- action_source igual: ✅ Sim / ❌ Não
- user_data igual: ✅ Sim / ❌ Não
- Deduplicação: ✅ Funcionando / ❌ Não funcionando

### CONCLUSÃO:
[Descrever o problema encontrado e a causa raiz]
```

---

## 🔧 FERRAMENTAS ÚTEIS

### **1. GTM Preview Mode**
- URL: https://tagmanager.google.com
- Função: Ver tags, variáveis e eventos em tempo real

### **2. Meta Events Manager**
- URL: https://business.facebook.com/events_manager2
- Função: Ver eventos recebidos pelo Meta

### **3. Stape.io Dashboard**
- URL: https://stape.io
- Função: Ver logs e eventos do GTM Server-Side

### **4. Browser DevTools**
- Network Tab: Ver requisições HTTP
- Console: Ver logs e DataLayer
- Application: Ver localStorage/sessionStorage

---

## ✅ PRÓXIMOS PASSOS

1. **Executar Método 1** (Console do navegador) - 5 min
2. **Executar Método 2** (GTM Preview Mode) - 10 min
3. **Executar Método 3** (Stape.io Logs) - 10 min
4. **Executar Método 4** (Meta Events Manager) - 10 min
5. **Preencher Template de Relatório** - 5 min
6. **Identificar problema específico** - Baseado nos resultados

---

**FIM DO GUIA**


