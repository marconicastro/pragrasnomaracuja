# ?? TESTE COMPLETO: Identificar por que DQS ? 92 e n?o 98

## ?? OBJETIVO:

Descobrir onde city/state/zip est?o se perdendo e corrigir para DQS = 98!

---

## ?? PASSO A PASSO (SIGA EXATAMENTE):

### **PASSO 1: Aguarde deploy completar (2-3 minutos)**

**Vercel Dashboard:**
- Deployments ? ?ltimo deploy
- Deve estar: **"Ready"** (verde) ?
- Commit: `debug: logs detalhados geo`

**Se ainda est? "Building":** Aguarde!

---

### **PASSO 2: Limpar TUDO (come?ar do zero)**

**Abra console (F12) e execute:**

```javascript
localStorage.clear();
sessionStorage.clear();
console.log('? Storage limpo! Recarregando...');
location.reload();
```

**Console vai limpar e p?gina recarregar!**

---

### **PASSO 3: Acessar site COM CONSOLE ABERTO**

**IMPORTANTE:** Console deve estar ABERTO antes de acessar!

1. **F12** (abrir console)
2. **Acesse:** https://www.maracujazeropragas.com
3. **N?O FECHE o console!**
4. **Aguarde 10 segundos** (API IP capturar)

**PROCURE por estas mensagens:**

```
?? API IP retornou: {city: "cacul?", state: "ba", zip: "46300", country: "br"}
```

**? Se aparecer:** API IP funcionou!  
**? Se N?O aparecer:** API IP falhou!

---

### **PASSO 4: Rolar p?gina at? formul?rio**

Role at? ver o formul?rio de contato.

---

### **PASSO 5: Preencher formul?rio**

1. **Nome:** Marconi Augusto de Castro
2. **Email:** marconi.castro.mc@gmail.com
3. **Telefone:** (77) 99827-6042

**N?O FECHE O CONSOLE!**

---

### **PASSO 6: Clicar "COMPRAR AGORA"**

**PROCURE por estas mensagens NO CONSOLE:**

```
?? DEBUG - Fontes de geolocaliza??o: {
  fromTracking: {city: undefined, state: undefined, zip: undefined},
  fromLocalStorage: {city: "cacul?", state: "ba", zip: "46300"}
}

?? Geolocaliza??o que ser? salva no KV: {
  city: "cacul?",
  state: "ba",
  zip: "46300"
}

?? ATEN??O: Se city/state/zip estiverem undefined...
```

**? Se city/state/zip aparecerem:** Dados est?o sendo enviados!  
**? Se aparecer undefined:** API IP n?o funcionou!

---

### **PASSO 7: Aguardar 30 segundos**

Dados salvarem no Vercel KV.

---

### **PASSO 8: Testar ReqBin**

1. **ReqBin.com**
2. **POST:** `https://www.maracujazeropragas.com/api/webhook-cakto`
3. **Header:** `Content-Type: application/json`
4. **Body:**
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

4. **Send**

---

### **PASSO 9: Verificar logs Vercel**

**Acesse:** Vercel ? Deployments ? Runtime Logs

**PROCURE por:**

```
? User tracking salvo no Vercel KV: {
  email: "marconi.castro.mc@gmail.com",
  hasFbp: true,
  hasFbc: true,
  hasCity: true,     ? DEVE SER TRUE!
  hasState: true,    ? DEVE SER TRUE!
  hasZip: true,      ? DEVE SER TRUE!
  city: "cacul?",
  state: "ba",
  zip: "46300"
}
```

**E depois:**

```
?? DEBUG - userData recebido do KV: {
  hasFbp: true,
  hasFbc: true,
  hasCity: true,     ? DEVE SER TRUE!
  hasState: true,    ? DEVE SER TRUE!
  hasZip: true,      ? DEVE SER TRUE!
  city: "cacul?",
  state: "ba",
  zip: "46300"
}

?? Purchase Data Quality Score: 98  ? OBJETIVO!
```

---

## ?? CEN?RIOS POSS?VEIS:

### **CEN?RIO A: API IP n?o captura**

**Console do navegador:**
```
? N?O aparece: "?? API IP retornou"
```

**Solu??o:** API falhou (timeout, limite de requests)

**Fix:** Adicionar city/state/zip no modal (pedir pro cliente)

---

### **CEN?RIO B: Frontend n?o envia**

**Console do navegador:**
```
? Aparece: "?? API IP retornou: {city, state, zip}"
? MAS: "?? Geolocaliza??o que ser? salva no KV: {city: undefined...}"
```

**Solu??o:** localStorage n?o est? salvando

**Fix:** Investigar advancedDataPersistence.ts

---

### **CEN?RIO C: KV n?o salva**

**Logs Vercel (ao fazer Lead):**
```
? Aparece: "?? Geolocaliza??o que ser? salva no KV: {city, state, zip}"
? MAS Logs Vercel: "? User tracking salvo: {hasCity: false...}"
```

**Solu??o:** API route n?o est? passando

**Fix:** Verificar /api/save-tracking

---

### **CEN?RIO D: Webhook n?o busca**

**Logs Vercel (ao fazer webhook):**
```
? "? User tracking salvo: {hasCity: true, city: 'cacul?'}"
? MAS "?? DEBUG - userData do KV: {hasCity: false}"
```

**Solu??o:** KV n?o est? retornando

**Fix:** Verificar getUserTracking

---

## ? O QUE EU PRECISO DE VOC?:

### **ME ENVIE 3 COISAS:**

**1. CONSOLE DO NAVEGADOR (ao fazer Lead):**

Procure e copie estas mensagens:
```
?? API IP retornou: {...}
?? DEBUG - Fontes de geolocaliza??o: {...}
?? Geolocaliza??o que ser? salva no KV: {...}
? fbp/fbc + ATTRIBUTION salvos no Vercel KV
```

---

**2. LOGS VERCEL (ao fazer Lead):**

Runtime Logs do momento que voc? preencheu o formul?rio.

Procure por:
```
? User tracking salvo no Vercel KV: {
  hasCity: ???,
  city: ???
}
```

---

**3. LOGS VERCEL (ao fazer webhook ReqBin):**

Procure por:
```
?? DEBUG - userData recebido do KV: {
  hasCity: ???,
  city: ???
}

?? Purchase Data Quality Score: ???
```

---

## ?? COM ESSAS 3 INFORMA??ES:

**Vou identificar EXATAMENTE onde city/state/zip est?o se perdendo!**

**E corrigir para DQS = 98!** ?

---

## ? PR?XIMOS PASSOS:

1. ? Aguarde 2-3 minutos (deploy completar)
2. ? localStorage.clear() + reload
3. ? Console ABERTO (F12)
4. ? Acesse site (espera 10s)
5. ? Preencha Lead
6. ? **COPIE CONSOLE** (envie pra mim)
7. ? Aguarde 30s
8. ? ReqBin ? POST
9. ? **COPIE LOGS VERCEL** (envie pra mim)

---

**Com essas informa??es, resolvo o DQS 92 ? 98 em 5 minutos!** ??

**Pode fazer o teste agora?** ?
