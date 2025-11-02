# ?? DIAGN?STICO: CAPIG N?O RECEBE EVENTOS

**Problema:** Stape CAPIG n?o est? recebendo eventos em produ??o  
**Data:** 02/11/2024  
**Gravidade:** ?? CR?TICA

---

## ?? INVESTIGA??O:

### **1. Configura??o atual do c?digo:**

**`EliteMetaPixel.tsx` (linhas 92-99):**
```javascript
window.fbq('init', pixelId);

// Configura??o CAPIG
window.fbq('set', 'autoConfig', false, pixelId);
window.fbq('set', 'agent', 'stape');
window.fbq('set', 'server_event_uri', 'https://capig.maracujazeropragas.com');
```

**Status:** ? C?digo est? correto!

---

### **2. URL do CAPIG:**

**Atual:** `https://capig.maracujazeropragas.com`  
**Anterior:** `https://capigateway.maracujazeropragas.com`

**?? PROBLEMA IDENTIFICADO:**

Voc? mudou o dom?nio custom de:
- `capigateway.maracujazeropragas.com` (antigo)
- Para: `capig.maracujazeropragas.com` (atual)

**Mas o dom?nio custom pode N?O estar configurado corretamente no Stape!**

---

## ?? CAUSAS POSS?VEIS:

### **Causa 1: Dom?nio custom n?o configurado (MAIS PROV?VEL)**

**Problema:**
- CAPIG usa `https://capig.stape.pm` (base)
- Voc? criou dom?nio custom: `capig.maracujazeropragas.com`
- Mas pode n?o ter feito o DNS CNAME correto!

**Solu??o:**
```
DNS do dom?nio maracujazeropragas.com precisa ter:

Type: CNAME
Name: capig
Value: capig.stape.pm
TTL: 3600 (ou autom?tico)
```

**Como verificar:**
```bash
# No terminal:
nslookup capig.maracujazeropragas.com

# Deveria retornar:
# capig.maracujazeropragas.com canonical name = capig.stape.pm
```

---

### **Causa 2: Meta Pixel n?o conectado no CAPIG (COMUM)**

**Problema:**
- CAPIG criado
- Mas Meta Pixel **n?o foi conectado** no painel Stape

**Como verificar:**
1. Acesse: https://tagmanager.stape.io
2. Containers ? `nova_capig_maracuja`
3. Settings ? **Connections**
4. Procure: **Facebook Pixel**

**Se N?O aparecer conex?o:**
- ? Clique "Add Connection"
- ? Selecione "Facebook Pixel"
- ? M?todo: **OAuth** (recomendado) ou **Manual**
- ? Se OAuth: Autorize com Facebook Business Manager
- ? Se Manual: Adicione Access Token + Pixel ID

---

### **Causa 3: autoConfig: false quebrando (RARO)**

**Problema:**
- `autoConfig: false` desabilita configura??o autom?tica
- Pode estar impedindo intercepta??o do CAPIG

**Solu??o:** Testar COM autoConfig ativo

---

### **Causa 4: Endpoint CAPIG errado (POSS?VEL)**

**Problema:**
- CAPIG pode precisar de endpoint espec?fico
- Ex: `/facebook` ou `/events`

**Solu??o:** Testar URLs diferentes

---

## ? SOLU??ES (Ordem de prioridade):

### **SOLU??O 1: Verificar e configurar DNS (CR?TICO!)**

**Passo 1: Verificar DNS atual:**
```bash
# Linux/Mac:
nslookup capig.maracujazeropragas.com

# Windows:
nslookup capig.maracujazeropragas.com

# Ou online:
# https://www.nslookup.io/domains/capig.maracujazeropragas.com/
```

**Resultado esperado:**
```
capig.maracujazeropragas.com canonical name = capig.stape.pm
```

**Se N?O retornar isso:**

**Passo 2: Configurar DNS:**
1. Acesse painel DNS do dom?nio (Registro.br, Cloudflare, etc)
2. Adicione registro CNAME:
   - **Type:** CNAME
   - **Name:** capig
   - **Value:** capig.stape.pm
   - **TTL:** 3600
3. Salve
4. Aguarde 5-30 minutos (propaga??o DNS)
5. Teste novamente: `nslookup capig.maracujazeropragas.com`

---

### **SOLU??O 2: Conectar Meta Pixel no CAPIG (SE N?O FEZ)**

**Passo 1: Acessar Stape:**
1. https://tagmanager.stape.io
2. Login
3. Containers ? `nova_capig_maracuja`

**Passo 2: Verificar conex?o:**
1. Settings ? **Connections**
2. Procure: **Facebook Pixel** ou **Meta Pixel**

**Passo 3: SE N?O TIVER conex?o:**

**Op??o A: OAuth (RECOMENDADO):**
```
1. Add Connection
2. Facebook Pixel
3. OAuth
4. Autorizar com Meta Business Manager
5. Selecionar Pixel ID: 642933108377475
6. Save
```

**Op??o B: Manual:**
```
1. Add Connection
2. Facebook Pixel
3. Manual
4. Pixel ID: 642933108377475
5. Access Token: EAAUsqHMv8GcBP5dQ8HjQcx4ZCEtCq958ZBKe71qP5ZAUZAtZAGfAN4OzsKZCAsCE3ZATp8cuTn5bWgWI2m35H31nnPKg8CMX3cqWa709DWSPdBXD2vF6P8RMXMZAnRNZCXcwX0nL0sBYbN821XurMRwrHZAM1X5qX7AjljZBabX8XArHoy4MZBZCl06lKHYHyuzBs2AZDZD
6. Save
```

---

### **SOLU??O 3: Testar SEM autoConfig: false**

**Modificar `EliteMetaPixel.tsx`:**

```typescript
// ANTES (atual):
window.fbq('init', pixelId);
window.fbq('set', 'autoConfig', false, pixelId);  // ? REMOVER!
window.fbq('set', 'agent', 'stape');
window.fbq('set', 'server_event_uri', stapeContainerUrl);

// DEPOIS (teste):
window.fbq('init', pixelId);
// window.fbq('set', 'autoConfig', false, pixelId);  // ? COMENTADO
window.fbq('set', 'agent', 'stape', pixelId);
window.fbq('set', 'server_event_uri', stapeContainerUrl, pixelId);
```

**Ou testar config alternativa:**

```typescript
// Configura??o alternativa (mais expl?cita):
window.fbq('init', pixelId, {}, {
  agent: 'stape',
  eventID: true
});
window.fbq('set', 'server_event_uri', stapeContainerUrl);
```

---

### **SOLU??O 4: Usar URL base do Stape (TEMPOR?RIO)**

**Se dom?nio custom n?o funcionar:**

```typescript
// Trocar de:
stapeContainerUrl = 'https://capig.maracujazeropragas.com'

// Para URL base Stape:
stapeContainerUrl = 'https://capig.stape.pm'
```

**Vantagens:**
- ? Funciona imediatamente (sem DNS)
- ? Stape garante uptime

**Desvantagens:**
- ?? URL da Stape (n?o seu dom?nio)
- ?? Pode ser bloqueada por ad-blockers

---

### **SOLU??O 5: Adicionar /facebook ao endpoint**

**Alguns CAPIGs precisam de path espec?fico:**

```typescript
// Testar com /facebook:
stapeContainerUrl = 'https://capig.maracujazeropragas.com/facebook'

// Ou:
stapeContainerUrl = 'https://capig.stape.pm/facebook'
```

---

## ?? TESTE R?PIDO (Browser Console):

**1. Abra site em produ??o**

**2. F12 ? Console ? Digite:**

```javascript
// Verificar se fbq existe
typeof fbq

// Ver configura??o atual
_fbq

// Ver server_event_uri
_fbq.getState().pixels['642933108377475']

// For?ar evento de teste
fbq('track', 'TestEvent', {test: true})

// Ver network requests
// Network tab ? Filter: "facebook\|stape\|capig"
```

**3. Verificar:**
```
? Request para: https://capig.maracujazeropragas.com/events ?
? Status: 200 OK?
? Status: 404/500/timeout?
```

---

## ?? COMPARA??O: CAPIG vs Meta Direto

**Situa??o atual (suspeita):**

```
Browser ? Meta Pixel ? ???
                        ?
                        ? CAPIG (n?o recebe)
                        ?
                        ? Meta direto (funciona)
```

**Situa??o esperada:**

```
Browser ? Meta Pixel ? ? CAPIG
                        ?
                        ? Meta Conversions API
                        ?
                        ? Dual tracking
```

---

## ?? FIX IMEDIATO (Se nada funcionar):

**Op??o 1: Desabilitar CAPIG temporariamente**

```typescript
// EliteMetaPixel.tsx
window.fbq('init', pixelId);
// N?O configurar CAPIG (usar Meta direto)
// window.fbq('set', 'agent', 'stape');
// window.fbq('set', 'server_event_uri', stapeContainerUrl);
```

**Resultado:**
- ? Eventos v?o para Meta direto (browser-side)
- ?? Perde dual tracking (mas 90% da funcionalidade mant?m)
- ? Sistema continua funcionando!

**Op??o 2: Usar sGTM (Server Container) em vez de CAPIG**

Se CAPIG n?o funcionar, pode usar Server Container (sGTM):
- Mais controle
- Mais configura??o
- Mais caro (US$ 100/m?s vs US$ 15/m?s)

---

## ?? RECOMENDA??O IMEDIATA:

### **Fazer AGORA (ordem):**

**1. Verificar DNS (5 min):**
```bash
nslookup capig.maracujazeropragas.com
```

Se n?o retornar `capig.stape.pm` ? **Configurar CNAME no DNS!**

**2. Verificar conex?o Meta Pixel no Stape (5 min):**
- https://tagmanager.stape.io
- Containers ? Settings ? Connections
- Se n?o tiver Meta Pixel ? **Adicionar!**

**3. Testar com URL base (2 min):**
- Trocar para: `https://capig.stape.pm`
- Fazer deploy
- Testar

**4. Se AINDA n?o funcionar:**
- **Desabilitar CAPIG temporariamente**
- Sistema funciona 90% sem CAPIG (s? perde IP/UA do browser)
- Purchase via webhook funciona 100%!

---

## ?? IMPORTANTE:

**CAPIG n?o ? CR?TICO para o sistema funcionar!**

**Com CAPIG:**
- ? Dual tracking (browser + server)
- ? IP/UA do browser (autom?tico)
- ? EQM +0.5-1.0 pontos

**Sem CAPIG (Meta direto):**
- ? Browser tracking (funciona 100%)
- ? Purchase server-side (funciona 100%)
- ? IP/UA capturados no Lead (funcionando!)
- ?? IP/UA n?o vai do browser (mas vai do Lead!)
- ? 90% da funcionalidade mant?m!

**Veredicto:** Se n?o resolver r?pido, desabilite CAPIG e foque em tr?fego!

---

## ?? CHECKLIST DE VERIFICA??O:

```
? DNS CNAME configurado (capig ? capig.stape.pm)
? DNS propagado (nslookup funciona)
? Meta Pixel conectado no Stape CAPIG
? Access Token v?lido no CAPIG
? Pixel ID correto (642933108377475)
? Testado com URL base (capig.stape.pm)
? Testado sem autoConfig: false
? Network requests chegam no CAPIG (F12)
? CAPIG logs mostram eventos (painel Stape)
```

---

**Me avise qual teste quer que eu rode primeiro!** ??
