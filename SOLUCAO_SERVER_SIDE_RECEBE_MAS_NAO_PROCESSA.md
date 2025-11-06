# ✅ SOLUÇÃO: Server-Side recebe mas não processa eventos

**Diagnóstico:**
- ✅ Requisições estão sendo enviadas (status 200)
- ✅ Server-Side está respondendo (200 OK + pixel GIF)
- ✅ Dados estão sendo enviados (`dtdc` com base64)
- ❌ Preview do Server-Side não mostra eventos

**Causa:** Data Client não está processando eventos ou Preview não está conectado

---

## 🔍 ANÁLISE DOS DADOS

### **Requisição enviada:**
```
URL: https://event.maracujazeropragas.com/data?v=2&event_name=view_item&dtdc=...
Método: GET
Status: 200 OK
Response: image/gif (pixel de rastreamento)
```

### **Dados decodificados (dtdc base64):**
```json
{
  "page_location": "https://www.maracujazeropragas.com/...",
  "content_ids": ["hacr962"],
  "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
  "currency": "BRL",
  "value": 39.9,
  "event_id": "ViewContent_176244947443_2v72bipihn",
  "first_name": "Ana",
  "last_name": "Silva",
  "email_address": "ana.silva@email.com",
  "city": "caculé",
  "country": "br",
  "region": "ba",
  "postal_code": "46300",
  "user_id": "sess_1762031294521_e5kv5ly8b",
  "phone_number": "1199999888"
}
```

**✅ Dados estão corretos e completos!**

---

## 🔧 SOLUÇÕES

### **Solução 1: Verificar Preview Mode do Server-Side**

**Problema:** Preview Mode pode não estar conectado corretamente

**Passos:**
1. **Fechar Preview Mode do Server-Side**
2. **Abrir novamente:**
   - GTM Server-Side → Preview/Debug
   - Adicionar URL: `https://www.maracujazeropragas.com`
   - **IMPORTANTE:** Usar a mesma URL que está no navegador
3. **Navegar no site novamente**
4. **Verificar se eventos aparecem**

**Se ainda não aparecer:**
- Verificar se está usando a mesma sessão de Preview
- Verificar se cookies `gtm_preview` e `gtm_debug` estão presentes

---

### **Solução 2: Verificar Data Client**

**Problema:** Data Client pode não estar processando eventos

**Passos:**
1. **GTM Server-Side → Clients**
2. **Abrir "Data Client"**
3. **Verificar:**
   - ✅ Está ativo?
   - ✅ Aceita eventos do Web Container?
   - ✅ Não tem filtros bloqueando?
   - ✅ Accepted Path Settings está configurado para `/data`?

**Se Data Client não aceita eventos do Web Container:**
- Configurar para aceitar eventos do Web Container
- Verificar "Ingestion Settings"

---

### **Solução 3: Verificar se eventos estão sendo processados (sem Preview)**

**Teste alternativo:**
1. **Abrir GTM Server-Side → Tags**
2. **Verificar se tags estão disparando:**
   - FB - ViewContent
   - GA4 - All Events
3. **Verificar no Meta Events Manager:**
   - Eventos estão chegando?
   - Se sim, Server-Side está processando (só Preview não mostra)

---

### **Solução 4: Verificar logs do Server-Side**

**Se usar Stape.io:**
1. **Abrir Stape.io Dashboard**
2. **Verificar logs do Server-Side**
3. **Verificar se há erros ou eventos sendo processados**

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **Preview Mode:**
- [ ] Preview Mode está aberto e conectado?
- [ ] URL no Preview é a mesma do navegador?
- [ ] Cookies `gtm_preview` e `gtm_debug` estão presentes?
- [ ] Tentou fechar e abrir Preview novamente?

### **Data Client:**
- [ ] Data Client está ativo?
- [ ] Data Client aceita eventos do Web Container?
- [ ] Não tem filtros bloqueando?
- [ ] Accepted Path Settings está configurado?

### **Tags:**
- [ ] Tags estão ativas e publicadas?
- [ ] Triggers estão configurados corretamente?
- [ ] Eventos estão chegando no Meta Events Manager?

---

## 🎯 PRÓXIMOS PASSOS

**Teste 1: Verificar Preview Mode**
1. Fechar Preview Mode do Server-Side
2. Abrir novamente com a mesma URL
3. Navegar no site
4. Verificar se eventos aparecem

**Teste 2: Verificar Data Client**
1. GTM Server-Side → Clients → Data Client
2. Verificar configuração
3. Verificar se aceita eventos do Web Container

**Teste 3: Verificar se eventos estão chegando (sem Preview)**
1. Verificar Meta Events Manager
2. Verificar se eventos estão sendo processados
3. Se sim, problema é só no Preview Mode

---

## ✅ CONCLUSÃO

**Situação atual:**
- ✅ Requisições estão sendo enviadas corretamente
- ✅ Server-Side está recebendo (status 200)
- ✅ Dados estão completos e corretos
- ❌ Preview Mode não mostra eventos

**Causa mais provável:**
- Preview Mode não está conectado corretamente
- OU Data Client não está processando eventos

**Solução:**
1. Reiniciar Preview Mode
2. Verificar Data Client
3. Verificar se eventos estão chegando no Meta (sem Preview)

