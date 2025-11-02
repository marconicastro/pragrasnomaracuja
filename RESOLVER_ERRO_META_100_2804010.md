# ?? RESOLVER ERRO META 100.2804010

## ?? ERRO ATUAL:

```
? Pixel ID 642933108377475 is experiencing issues
? Error code: 100.2804010
? Events impacted
```

**Causa:** CAPIG recebe evento mas envia com erro para Meta!

---

## ? CORRE??O APLICADA NO C?DIGO:

**Removi `access_token` do payload:**

**ANTES (causava erro):**
```javascript
{
  pixel_id: "642933108377475",
  access_token: "EAAUsq...",  ? Removido!
  data_source_id: "642933108377475",  ? Removido!
  event_name: "Purchase",
  ...
}
```

**AGORA (correto):**
```javascript
{
  pixel_id: "642933108377475",
  event_name: "Purchase",
  event_time: ...,
  user_data: {...},
  custom_data: {...}
}
```

**CAPIG deve usar access_token configurado no DASHBOARD!**

---

## ?? VOC? PRECISA VERIFICAR NO CAPIG:

### **Dashboard Stape ? nova_capig_maracuja**

### **1. Verificar se PIXEL est? conectado:**

**Procure aba/se??o:**
- "Websites"
- "Pixels"
- "Connected Pixels"
- "Data Sources"

**Deve mostrar:**
```
?? Pixel ID: 642933108377475
?? Status: Active/Connected
?? Domain: maracujazeropragas.com (ou similar)
```

**Se N?O estiver:**
- Bot?o "Add Website" ou "Add Pixel"
- Cole: `642933108377475`
- Domain: `maracujazeropragas.com`
- Salve

---

### **2. Verificar se ACCESS TOKEN est? configurado:**

**Procure por:**
- "Settings" ou "??"
- "Authentication"
- "Meta Access Token"
- "Facebook API"
- "Credentials"

**Deve ter campo:**
```
Meta Access Token: EAAUsq... (preenchido)
Status: Valid ?
```

**Se N?O estiver configurado:**

1. **Cole seu access token:**
```
EAAUsqHMv8GcBP5dQ8HjQcx4ZCEtCq958ZBKe71qP5ZAUZAtZAGfAN4OzsKZCAsCE3ZATp8cuTn5bWgWI2m35H31nnPKg8CMX3cqWa709DWSPdBXD2vF6P8RMXMZAnRNZCXcwX0nL0sBYbN821XurMRwrHZAM1X5qX7AjljZBabX8XArHoy4MZBZCl06lKHYHyuzBs2AZDZD
```

2. **Salve**

3. **Aguarde 1-2 minutos**

---

### **3. Verificar permiss?es do Access Token:**

**CAPIG precisa que o access token tenha:**
- ? `ads_management`
- ? `business_management`

**Como verificar:**
1. Meta Business Settings ? System Users
2. Encontre seu System User
3. Verifique permiss?es
4. Deve ter: Pixel (Full control) + Ads (Full control)

---

## ?? TESTE AP?S CONFIGURAR:

### **PASSO 1: Aguarde deploy (2-3 min)**

### **PASSO 2: Verificar erro no Meta:**

**Events Manager ? Pixel 642933108377475**

**Erro deve SUMIR!**

```
? No active issues
? Pixel healthy
```

---

### **PASSO 3: Testar ReqBin:**

**POST webhook**

---

### **PASSO 4: Verificar Test Events:**

**Meta Events Manager ? Test Events ? TEST79665**

**Deve aparecer:**
```
? Purchase_TEST_CAPIG_FIX_001_[timestamp]
? Status: Received
? Time: H? X minutos
```

---

## ?? CHECKLIST:

- [ ] Deploy completou (aguarde 2-3 min)
- [ ] **CAPIG Dashboard:**
  - [ ] Pixel 642933108377475 conectado? ?
  - [ ] Access Token configurado? ?
  - [ ] Permiss?es corretas? ?
- [ ] Erro 100.2804010 sumiu no Meta? ?
- [ ] Teste ReqBin
- [ ] Purchase aparece em Test Events? ?

---

## ?? RESUMO:

**Problema:** access_token no payload causou erro 100.2804010

**Solu??o:** 
1. Removi access_token do payload (c?digo)
2. CAPIG deve usar token configurado no dashboard
3. Voc? precisa configurar access token no CAPIG

**A??o:** Verificar CAPIG Settings ? Adicionar Access Token

---

## ?? ONDE ADICIONAR ACCESS TOKEN NO CAPIG:

**Procure em:**
- Settings (engrenagem ??)
- Authentication
- API Credentials
- Meta/Facebook API

**Cole:**
```
EAAUsqHMv8GcBP5dQ8HjQcx4ZCEtCq958ZBKe71qP5ZAUZAtZAGfAN4OzsKZCAsCE3ZATp8cuTn5bWgWI2m35H31nnPKg8CMX3cqWa709DWSPdBXD2vF6P8RMXMZAnRNZCXcwX0nL0sBYbN821XurMRwrHZAM1X5qX7AjljZBabX8XArHoy4MZBZCl06lKHYHyuzBs2AZDZD
```

**Salve e teste!**

---

**Aguarde deploy + Configure access token no CAPIG + Teste novamente!** ??

**Erro deve sumir e Purchase deve aparecer!** ?