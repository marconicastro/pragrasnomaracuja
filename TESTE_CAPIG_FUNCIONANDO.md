# ?? COMO TESTAR SE CAPIG EST? FUNCIONANDO

**Corre??o aplicada:** pixelId adicionado aos comandos set()  
**Status:** ? C?digo corrigido e no ar!  
**Pr?ximo:** VOC? testa se CAPIG volta a funcionar!

---

## ?? TESTE 1: Configura??o do Pixel (CR?TICO!)

### **Abrir site + F12 ? Console:**

```javascript
// 1. Verificar se fbq existe:
typeof window.fbq
// Deve retornar: "function" ?

// 2. Verificar configura??o do pixel:
window._fbq.getState().pixels['642933108377475']

// Deve retornar OBJETO com:
{
  id: "642933108377475",
  agent: "stape",                    // ? SE TIVER = CAPIG OK!
  autoConfig: false,
  server_event_uri: "https://capigateway.maracujazeropragas.com",
  ...
}
```

**? SE TIVER `agent: "stape"` ? CAPIG CONFIGURADO!**

**? SE N?O TIVER `agent: "stape"` ? AINDA QUEBRADO!**

---

## ?? TESTE 2: Network Requests

### **F12 ? Network tab:**

**1. Filter:** `capigateway`

**2. Fazer a??o no site:**
- Rolar p?gina (ViewContent)
- Clicar "Comprar" (AddToCart)
- Preencher form (Lead)

**3. Verificar requests:**

```
? Request para: https://capigateway.maracujazeropragas.com/events
? Method: POST
? Status: 200 OK
? Payload: {
     id: "642933108377475",
     ev: [{
       event_name: "PageView",
       event_time: timestamp,
       user_data: {...},
       custom_data: {...}
     }]
   }
```

**Se VIR requests ? CAPIG FUNCIONANDO! ?**

**Se N?O VIR ? Problema persiste!**

---

## ?? TESTE 3: Stape Dashboard (Definitivo!)

### **1. Acessar:**
```
https://tagmanager.stape.io
? Login
? Containers
? nova_capig_maracuja
```

### **2. Ir para Events tab:**

```
Events ? Last 24h
```

### **3. Verificar se EVENTOS est?o chegando:**

```
? PageView (timestamp recente)
? ViewContent (timestamp recente)
? AddToCart (se clicar bot?o)
? Lead (se preencher form)
? InitiateCheckout (se preencher form)
```

**Se EVENTOS aparecem ? CAPIG 100% FUNCIONANDO! ?**

**Se N?O aparecem ? Verificar:**
1. Vari?vel Vercel atualizada?
2. Deploy conclu?do?
3. Pixel conectado no CAPIG?

---

## ?? TESTE 4: Meta Events Manager

### **5-10 minutos ap?s teste:**

```
Meta Events Manager
? Activity
? Comprar (evento Purchase)
? Clicar em qualquer evento
```

**Verificar:**

```
Fonte da a??o:
? Navegador (browser-side) ?
? Servidor (via CAPIG!) ? ? ISSO ? O QUE IMPORTA!

Chaves de dados do usu?rio:
? Endere?o IP (do browser - CAPIG adiciona!) ?
? Agente do usu?rio (do browser - CAPIG adiciona!) ?
```

**Se tiver "Servidor" + IP/UA ? DUAL TRACKING OK! ?**

---

## ?? CHECKLIST DE TESTES:

```
? 1. Atualizar Vercel (NEXT_PUBLIC_STAPE_CONTAINER_URL)
? 2. Aguardar deploy (2-3 min)
? 3. Acessar site
? 4. F12 ? Console ? Verificar:
     window._fbq.getState().pixels['642933108377475']
     ? Tem "agent: stape"?
? 5. F12 ? Network ? Filter "capigateway"
     ? V? requests?
     ? Status 200 OK?
? 6. Stape Dashboard ? Events
     ? Eventos aparecendo?
? 7. Meta Events Manager (5-10 min)
     ? Eventos com "Servidor"?
     ? IP/UA presentes?
```

---

## ?? SE N?O FUNCIONAR (troubleshooting):

### **Problema 1: agent: "stape" n?o aparece**

**Causa:** Config ainda n?o aplicou

**Solu??o:**
```typescript
// Testar sintaxe alternativa:
window.fbq('init', pixelId, {}, {
  agent: 'stape',
  eventID: true
});
window.fbq('set', 'server_event_uri', stapeContainerUrl);
```

---

### **Problema 2: Requests n?o aparecem no Network**

**Causa:** Dom?nio DNS ou CAPIG n?o configurado

**Solu??es:**
1. Verificar DNS: `nslookup capigateway.maracujazeropragas.com`
2. Verificar Pixel conectado no Stape Dashboard
3. Testar com URL base: `https://capig.stape.pm`

---

### **Problema 3: Eventos n?o aparecem no Stape Dashboard**

**Causa:** Pixel n?o conectado no CAPIG

**Solu??o:**
```
Stape Dashboard
? Settings
? Connections
? Add Connection
? Facebook Pixel
? OAuth ou Manual
? Conectar Pixel ID: 642933108377475
```

---

## ?? O QUE ESPERAR (Sucesso):

### **Console (imediato):**
```
? ELITE Meta Pixel inicializado
? Pixel ID: 642933108377475
? Stape Container: https://capigateway...
? CAPIG Config: agent: stape ?
? PageView disparado (Elite)
```

### **Network (imediato):**
```
? POST https://capigateway.../events
? Status: 200 OK
? Response: success
```

### **Stape Dashboard (1-2 min):**
```
? PageView (agora)
? ViewContent (se rolar)
? AddToCart (se clicar)
? Lead (se preencher)
```

### **Meta Events Manager (5-10 min):**
```
? Eventos com "Servidor"
? IP/UA presentes
? EQM 8.5-9.5/10
```

---

## ?? CONCLUS?O:

**Corre??o aplicada:** pixelId adicionado ?  
**Build:** OK ?  
**Git:** Pushed ?  

**Pr?ximo passo:** VOC? testa e confirma! ??

**Expectativa:** CAPIG volta a funcionar 100%! ??

---

**ME AVISE OS RESULTADOS DOS TESTES!** ??
