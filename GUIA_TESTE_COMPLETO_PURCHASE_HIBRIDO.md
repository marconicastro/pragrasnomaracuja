# 🧪 Guia Completo: Testar Purchase Híbrido (Browser + Webhook)

## 📋 Pré-requisitos

✅ **Sistema já configurado:**
- Pixel Meta: `1403975024017865`
- CAPIG Gateway: `https://capigateway.maracujazeropragas.com`
- Webhook Cakto: `/api/webhook-cakto`
- Página Obrigado: `/obrigado`

---

## 🎯 Passo a Passo para Teste

### **1️⃣ Limpar Cache e Dados Antigos (IMPORTANTE!)**

```javascript
// Abrir Console do Navegador (F12)
// Executar para limpar dados de testes anteriores:

localStorage.clear();
sessionStorage.clear();
console.log('✅ Cache limpo!');
```

**Ou:**
- Abrir aba anônima (Ctrl+Shift+N)
- Melhor para teste isolado

---

### **2️⃣ Fazer Lead (Para Salvar Email no localStorage)**

1. **Acessar página principal:**
   ```
   https://www.maracujazeropragas.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=teste_purchase
   ```

2. **Preencher formulário Lead:**
   - Nome: `Marconi Castro` (ou seu nome)
   - Email: `marconi.castro.mc@gmail.com` (ou seu email)
   - Telefone: `77998276042` (ou seu telefone)
   - CEP: `46300-000` (ou qualquer CEP válido)

3. **Verificar no Console (F12):**
   ```
   ✅ Lead enviado com sucesso
   ✅ fbp/fbc + ATTRIBUTION salvos no Vercel KV
   ✅ InitiateCheckout enviado
   ```

4. **Verificar localStorage:**
   ```javascript
   // No Console:
   JSON.parse(localStorage.getItem('userTrackingData'))
   // Deve mostrar email, phone, firstName, lastName
   ```

---

### **3️⃣ Fazer Compra no Cakto**

1. **Ser redirecionado para checkout** (deve abrir automaticamente após Lead)
2. **Completar pagamento** (ou usar modo teste)
3. **Aguardar redirecionamento** para `/obrigado`

---

### **4️⃣ Verificar Página /obrigado**

**O que deve acontecer:**

#### **A. Console do Navegador (F12):**

```
✅ PageView: Enviado
✅ Dados do usuário recuperados do KV via API (se aplicável)
🎉 Disparando Purchase via browser (EQM 9.3 via CAPIG):
   {
     orderId: 'browser_XXXXXXX',
     email: 'marconi.castro.mc@gmail.com',
     via: 'Browser + CAPIG Gateway',
     source: 'localStorage + API fallback',
     note: 'Webhook já enviou com order_id real (backup garantido)'
   }
✅ Purchase enviado via browser + CAPIG (EQM 9.3 garantido!)
ℹ️ Nota: Webhook também enviará (deduplicação automática pelo Meta)
```

#### **B. Network Tab (Rede):**

1. **Verificar requisição CAPIG:**
   - URL: `https://capigateway.maracujazeropragas.com/events`
   - Método: `POST`
   - Status: `200 OK` (ou `204 No Content`)
   - Payload deve conter:
     ```json
     {
       "event_name": "Purchase",
       "user_data": { "em": "...", "ph": "..." },
       "custom_data": { "value": 39.9, "currency": "BRL" }
     }
     ```

2. **Verificar API `/api/get-recent-purchase`:**
   - Se faltarem dados, deve fazer requisição
   - Status: `200 OK`
   - Response: `{ success: true, userData: {...} }`

---

### **5️⃣ Verificar Logs do Webhook (Vercel)**

1. **Acessar Vercel Dashboard:**
   ```
   https://vercel.com/seu-projeto/functions
   ```

2. **Verificar logs de `/api/webhook-cakto`:**
   ```
   📨 Webhook Cakto recebido
   ✅ Webhook validado
   ✅ User data encontrado no Vercel KV
   📤 Enviando Purchase via Meta CAPI direto
   ✅ SUCCESS: Purchase enviado via Meta CAPI direto
   ```

**⚠️ IMPORTANTE:** Webhook também enviará Purchase (backup garantido)

---

### **6️⃣ Verificar Meta Events Manager**

1. **Acessar:** https://business.facebook.com/events_manager2

2. **Ir em:** Test Events (ou Eventos de Teste)

3. **Procurar por:** `Purchase` recente

4. **Verificar:**

   #### **Browser Event (via CAPIG):**
   - ✅ Event Name: `Purchase`
   - ✅ Event Source: `website` ou `browser`
   - ✅ **EQM: 9.3** (deve aparecer!)
   - ✅ DQS: 90+ (dados do browser)
   - ✅ fbp: Presente
   - ✅ fbc: Pode estar presente (se válido)
   - ✅ User Agent: Presente
   - ✅ Custom Data: `value`, `currency`, etc.

   #### **Webhook Event (backup):**
   - ✅ Event Name: `Purchase`
   - ✅ Event Source: `website` (server-side)
   - ✅ EQM: ~8.0 (via Meta CAPI direto)
   - ✅ DQS: 85
   - ✅ Deduplicado: Meta deve marcar como "Deduplicated" (mesmo event_id ou email+timestamp)

---

## ✅ Checklist de Validação

### **Browser Event (via CAPIG):**
- [ ] Purchase disparado no console
- [ ] Requisição CAPIG enviada (Network tab)
- [ ] CAPIG retornou 200 OK
- [ ] Event apareceu no Meta Events Manager
- [ ] EQM: 9.3 ✅
- [ ] DQS: 90+ ✅

### **Webhook Event (backup):**
- [ ] Webhook recebido (logs Vercel)
- [ ] Purchase enviado via Meta CAPI
- [ ] Event apareceu no Meta Events Manager
- [ ] EQM: ~8.0 (via Meta direto)
- [ ] DQS: 85 ✅

### **Deduplicação:**
- [ ] Meta identificou como duplicata (ou ambos aparecem)
- [ ] Apenas 1 conversão contabilizada no final

---

## 🐛 Troubleshooting

### **❌ Purchase não disparou na página /obrigado**

**Possíveis causas:**
1. Email não encontrado no localStorage
   - **Solução:** Verificar se Lead foi feito antes da compra
   - Verificar: `localStorage.getItem('userTrackingData')`

2. API `/api/get-recent-purchase` falhou
   - **Solução:** Verificar logs do Vercel
   - Verificar se KV está configurado

3. Meta Pixel não carregou
   - **Solução:** Verificar console por erros
   - Verificar se `window.fbq` existe

**Debug:**
```javascript
// No console da página /obrigado:
console.log('Email no localStorage:', localStorage.getItem('userTrackingData'));
console.log('Meta Pixel carregado:', typeof window.fbq !== 'undefined');
```

---

### **❌ CAPIG não está recebendo evento**

**Verificar:**
1. Console mostra "Purchase enviado via browser + CAPIG"
2. Network tab mostra requisição para CAPIG
3. CAPIG retornou erro?

**Se CAPIG retornar erro:**
- Verificar URL do CAPIG está correto
- Verificar se pixel_id está no payload
- Verificar logs do CAPIG (se tiver acesso)

---

### **❌ Webhook não recebeu evento**

**Verificar:**
1. Cakto está configurado para enviar webhook?
2. URL do webhook está correto?
3. Secret está correto?

**Testar webhook manualmente:**
- Usar ReqBin (como feito antes)
- Enviar payload de teste
- Verificar logs do Vercel

---

### **❌ EQM não está 9.3**

**Possíveis causas:**
1. fbp/fbc não estão presentes
   - **Solução:** Verificar se Meta Pixel carregou antes do Purchase

2. User Agent não está sendo enviado
   - **Solução:** Verificar se browser está enviando

3. Dados de matching incompletos
   - **Solução:** Verificar se email, phone estão no payload

**Verificar no Meta Events Manager:**
- Ir em "Test Events" → Selecionar Purchase → Ver detalhes
- Verificar quais campos estão presentes
- Verificar EQM score na interface

---

## 📊 Resultados Esperados

### **✅ Sucesso Completo:**

```
Browser Event:
✅ EQM: 9.3
✅ DQS: 90+
✅ Via: CAPIG Gateway
✅ Status: Enviado

Webhook Event:
✅ EQM: ~8.0
✅ DQS: 85
✅ Via: Meta CAPI direto
✅ Status: Enviado (backup)

Deduplicação:
✅ Meta identificou duplicata
✅ Apenas 1 conversão contabilizada
```

---

## 🎉 Próximos Passos Após Teste

1. **Se tudo funcionou:**
   - ✅ Sistema pronto para produção
   - ✅ Monitorar EQM no Meta Events Manager
   - ✅ Comparar conversões antes/depois

2. **Se algo não funcionou:**
   - Verificar logs específicos
   - Comparar com este guia
   - Ajustar conforme necessário

---

## 📞 Suporte

Se encontrar problemas não cobertos aqui:
1. Verificar logs completos (console + Vercel)
2. Capturar screenshots dos erros
3. Verificar configurações do CAPIG e Meta Pixel

---

**Boa sorte com o teste! 🚀**

