# ?? GUIA COMPLETO: Testar Webhook com ReqBin.com

## ?? O QUE ? REQBIN?

**ReqBin.com** ? uma ferramenta para simular requisi??es HTTP (POST, GET, etc).

Vamos usar para **simular o webhook da Cakto** e testar o Purchase event!

---

## ?? PASSO A PASSO:

### **1. Acesse ReqBin:**
```
https://reqbin.com/
```

### **2. Configure a requisi??o:**

**A) M?todo:** Selecione **POST**

**B) URL do Webhook:**
```
https://www.maracujazeropragas.com/api/webhook-cakto
```

**C) Headers:**

Clique em **"Headers"** e adicione:
```
Content-Type: application/json
```

**D) Body:**

Clique em **"Body"** e cole um dos JSONs abaixo (copie TODO o JSON!)

---

## ?? TESTE 1: COM SEU EMAIL (Lead j? existe no sistema)

### **JSON (COPIE TUDO):**

```json
{
  "secret": "12f4848f-35e9-41a8-8da4-1032642e3e89",
  "event": "purchase_approved",
  "data": {
    "refId": "TEST_CAPIG_FIX_001",
    "customer": {
      "name": "Marconi Augusto de Castro",
      "email": "marconi.castro.mc@gmail.com",
      "phone": "5577998276042"
    },
    "offer": {
      "id": "hacr962",
      "name": "Sistema 4 Fases - Ebook Trips",
      "price": 39.9
    },
    "product": {
      "name": "Sistema 4 Fases - Ebook Trips",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@maracujazeropragas.com",
      "type": "unique",
      "invoiceDescription": "Ebook - Sistema 4 Fases Maracuj? Zero Pragas"
    },
    "status": "paid",
    "amount": 39.9,
    "baseAmount": 39.9,
    "fees": 5.19,
    "paymentMethod": "pix",
    "installments": 1,
    "paidAt": "2025-11-02T11:00:00.000Z",
    "createdAt": "2025-11-02T10:55:00.000Z"
  }
}
```

### **Resultado esperado:**

**? SUCCESS:**
```json
{
  "success": true,
  "message": "Purchase enviado com sucesso",
  "processedIn": "250ms"
}
```

**Purchase no Meta com:**
- ? Email, telefone, nome
- ? fbp, fbc (do Lead)
- ? city, state, zip (do Lead)
- ? Attribution completa
- ? UTMs completos
- ? Data Quality Score: 98

---

## ?? TESTE 2: SEM LEAD (Email n?o existe no sistema)

### **JSON (COPIE TUDO):**

```json
{
  "secret": "12f4848f-35e9-41a8-8da4-1032642e3e89",
  "event": "purchase_approved",
  "data": {
    "refId": "TEST_SEM_LEAD_002",
    "customer": {
      "name": "Teste Sem Lead",
      "email": "teste.sem.lead@example.com",
      "phone": "11987654321"
    },
    "offer": {
      "id": "hacr962",
      "name": "Sistema 4 Fases - Ebook Trips",
      "price": 39.9
    },
    "product": {
      "name": "Sistema 4 Fases - Ebook Trips",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@maracujazeropragas.com",
      "type": "unique",
      "invoiceDescription": "Ebook - Sistema 4 Fases Maracuj? Zero Pragas"
    },
    "status": "paid",
    "amount": 39.9,
    "baseAmount": 39.9,
    "fees": 5.19,
    "paymentMethod": "pix",
    "installments": 1,
    "paidAt": "2025-11-02T11:00:00.000Z",
    "createdAt": "2025-11-02T10:55:00.000Z"
  }
}
```

### **Resultado esperado:**

**? SUCCESS:**
```json
{
  "success": true,
  "message": "Purchase enviado com sucesso",
  "processedIn": "200ms"
}
```

**Purchase no Meta com:**
- ? Email, telefone, nome (do webhook)
- ? Sem fbp/fbc (n?o tinha Lead)
- ? Sem city/state/zip (n?o tinha Lead)
- ? Sem attribution (n?o tinha Lead)
- ? Sem UTMs (n?o tinha Lead)
- ?? Data Quality Score: ~50 (m?nimo)

---

## ?? TESTE 3: COM ORDER BUMP (Valor diferente)

### **JSON (COPIE TUDO):**

```json
{
  "secret": "12f4848f-35e9-41a8-8da4-1032642e3e89",
  "event": "purchase_approved",
  "data": {
    "refId": "TEST_ORDER_BUMP_001",
    "customer": {
      "name": "Marconi Augusto de Castro",
      "email": "marconi.castro.mc@gmail.com",
      "phone": "5577998276042"
    },
    "offer": {
      "id": "hacr962",
      "name": "Sistema 4 Fases + Order Bump",
      "price": 59.8
    },
    "product": {
      "name": "Sistema 4 Fases + Order Bump",
      "id": "hacr962",
      "short_id": "hacr962",
      "supportEmail": "suporte@maracujazeropragas.com",
      "type": "unique",
      "invoiceDescription": "Ebook - Sistema 4 Fases + Bonus"
    },
    "status": "paid",
    "amount": 59.8,
    "baseAmount": 39.9,
    "fees": 7.77,
    "paymentMethod": "credit_card",
    "installments": 1,
    "paidAt": "2025-11-02T11:00:00.000Z",
    "createdAt": "2025-11-02T10:55:00.000Z"
  }
}
```

### **Resultado esperado:**

**? SUCCESS:**
```json
{
  "success": true,
  "message": "Purchase enviado com sucesso",
  "processedIn": "280ms"
}
```

**Purchase no Meta com:**
- ? **value: 59.8** (valor correto com bump!)
- ? Email, telefone, nome
- ? fbp, fbc (do Lead)
- ? Attribution completa
- ? Data Quality Score: 98

---

## ?? COMO USAR REQBIN:

### **Interface do ReqBin:**

```
??????????????????????????????????????????
? [POST ?] [URL do webhook______]  [Send]?
??????????????????????????????????????????
? Headers | Body | Auth                  ?
??????????????????????????????????????????
? {                                      ?
?   "secret": "...",                     ?
?   "event": "purchase_approved",        ?
?   "data": {...}                        ?
? }                                      ?
??????????????????????????????????????????
? Response:                              ?
? {                                      ?
?   "success": true,                     ?
?   "message": "Purchase enviado..."     ?
? }                                      ?
??????????????????????????????????????????
```

---

## ? CHECKLIST DE TESTE:

### **ANTES de testar:**

- [ ] Acesse seu site: `https://www.maracujazeropragas.com`
- [ ] Preencha formul?rio com SEU EMAIL
- [ ] Aguarde 1 minuto (dados salvarem no Vercel KV)

### **DURANTE o teste:**

- [ ] Abra ReqBin.com
- [ ] M?todo: POST
- [ ] URL: `https://www.maracujazeropragas.com/api/webhook-cakto`
- [ ] Header: `Content-Type: application/json`
- [ ] Body: Cole JSON do TESTE 1
- [ ] Clique em "Send"

### **AP?S o teste:**

- [ ] Verifique resposta (success: true?)
- [ ] Acesse Meta Events Manager
- [ ] Veja Purchase event
- [ ] Confirme Data Quality Score: 98

---

## ?? VERIFICAR NO META EVENTS MANAGER:

### **1. Acesse:**
```
https://business.facebook.com/events_manager2
```

### **2. Selecione seu Pixel:**
```
642933108377475
```

### **3. Veja "Atividade de Eventos":**

**Procure por:**
```
Purchase_TEST_CAPIG_FIX_001_[timestamp]
```

**Verifique:**
- ? value: 39.9 (ou 59.8 se testar bump)
- ? Chaves de dados do usu?rio: Email, Telefone, Nome, Cidade, Estado, CEP
- ? fb_data_quality_score: 98
- ? fb_first_touch_source, fb_last_touch_source
- ? utmLastSource, utmLastCampaign

---

## ?? POSS?VEIS ERROS:

### **1. "Webhook secret not configured"**

**Causa:** Vari?vel `CAKTO_WEBHOOK_SECRET` n?o configurada

**Solu??o:** Adicione na Vercel:
```
CAKTO_WEBHOOK_SECRET=12f4848f-35e9-41a8-8da4-1032642e3e89
```

---

### **2. "Vercel KV n?o dispon?vel"**

**Causa:** Vercel KV n?o conectado ou deploy antigo

**Solu??o:** 
- Verifique conex?o do KV na Vercel
- Fa?a redeploy do projeto

---

### **3. "User not found in KV"**

**Causa:** Email do teste n?o existe no Vercel KV

**Solu??o:**
- Preencha formul?rio no site ANTES de testar
- Use SEU email real
- Aguarde 1 minuto

---

### **4. "Timestamp muito antigo"**

**Causa:** `paidAt` est? h? mais de 7 dias

**Solu??o:** JSON j? est? atualizado (hoje)!

---

## ?? RESUMO:

### **3 TESTES DISPON?VEIS:**

1. **COM SEU EMAIL** ? Purchase completo (DQS: 98)
2. **SEM LEAD** ? Purchase m?nimo (DQS: 50)
3. **COM ORDER BUMP** ? Purchase com valor maior (59.8)

### **URLs:**

- **ReqBin:** https://reqbin.com/
- **Webhook:** https://www.maracujazeropragas.com/api/webhook-cakto
- **Meta Events:** https://business.facebook.com/events_manager2

---

## ?? TESTE AGORA:

**1. Preencha formul?rio no site (SEU EMAIL)**

**2. Aguarde 1 minuto**

**3. ReqBin ? POST ? Cole JSON 1**

**4. Verifique Meta Events Manager**

**5. Data Quality Score = 98?** ?

---

**Tudo pronto para testar! ??**
