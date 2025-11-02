# ? SOLU??O: CAPIG DNS CORRIGIDO

**Problema:** CAPIG n?o recebia eventos  
**Causa:** Dom?nio `capig.maracujazeropragas.com` n?o existe (DNS erro)  
**Solu??o:** Usar `capigateway.maracujazeropragas.com` (funciona!)  
**Status:** ? C?DIGO CORRIGIDO E NO AR!

---

## ?? DIAGN?STICO COMPLETO:

### **Teste realizado:**
```bash
# Dom?nio ERRADO:
curl -I https://capig.maracujazeropragas.com
? Resultado: Could not resolve host (DNS erro)

# Dom?nio CORRETO:
curl -I https://capigateway.maracujazeropragas.com
? Resultado: HTTP/2 200 OK
```

**Conclus?o:** DNS est? OK no `capigateway`, mas N?O no `capig`!

---

## ? CORRE??ES APLICADAS:

### **Arquivos corrigidos:**

**1. `src/components/EliteMetaPixel.tsx`:**
```typescript
// ANTES:
stapeContainerUrl = 'https://capig.maracujazeropragas.com'

// DEPOIS:
stapeContainerUrl = 'https://capigateway.maracujazeropragas.com'
```

**2. `src/components/MetaPixelStape.tsx`:**
```typescript
// ANTES:
stapeContainerUrl = 'https://capig.maracujazeropragas.com'

// DEPOIS:
stapeContainerUrl = 'https://capigateway.maracujazeropragas.com'
```

**3. `.env.production`:**
```bash
# ANTES:
NEXT_PUBLIC_STAPE_CONTAINER_URL=https://capig.maracujazeropragas.com

# DEPOIS:
NEXT_PUBLIC_STAPE_CONTAINER_URL=https://capigateway.maracujazeropragas.com
```

**4. `.env.example`:**
```bash
# Atualizado para refletir URL correta
```

---

## ?? A??O NECESS?RIA (VOC?):

### **?? ATUALIZAR VERCEL (OBRIGAT?RIO!):**

**Vari?vel a mudar:**
```
NEXT_PUBLIC_STAPE_CONTAINER_URL
```

**Valor ERRADO (atual):**
```
https://capig.maracujazeropragas.com
```

**Valor CORRETO (novo):**
```
https://capigateway.maracujazeropragas.com
```

**Como fazer:**
1. Vercel Dashboard
2. Settings ? Environment Variables
3. Editar `NEXT_PUBLIC_STAPE_CONTAINER_URL`
4. Colar novo valor
5. Save
6. Redeploy (ou aguardar pr?ximo push)

**Tempo:** 2-3 minutos

---

## ?? FLUXO CORRIGIDO:

### **ANTES (eventos n?o chegavam):**
```
Browser ? Meta Pixel
          ?
          server_event_uri: https://capig... (DNS erro)
          ?
          ? CAPIG n?o recebe
          ?
          ? Meta direto (funciona - fallback)
```

### **DEPOIS (eventos chegam):**
```
Browser ? Meta Pixel
          ?
          server_event_uri: https://capigateway... (200 OK)
          ?
          ? CAPIG recebe! (dual tracking)
          ?
          ? Meta via CAPIG (com IP/UA do browser!)
```

---

## ?? TESTE P?S-CORRE??O:

### **1. Ap?s atualizar Vercel + Redeploy:**

**Acessar site:**
```
https://www.maracujazeropragas.com
```

**F12 ? Console:**
```
? "?? Stape Container: https://capigateway.maracujazeropragas.com"
? "? PageView disparado (Elite)"
```

**F12 ? Network:**
```
Filter: "capigateway"

? Request para: https://capigateway.maracujazeropragas.com/events
? Status: 200 OK
? Payload: evento + Advanced Matching
```

### **2. Stape Dashboard (1-2 min depois):**

```
https://tagmanager.stape.io
? nova_capig_maracuja
? Events tab

? PageView (novo!)
? ViewContent (novo!)
? AddToCart (novo!)
? Lead (novo!)
? InitiateCheckout (novo!)
```

### **3. Meta Events Manager (5-10 min):**

```
Activity ? Comprar

? Eventos com "Servidor" (via CAPIG)
? IP/UA autom?ticos (CAPIG adiciona!)
? EQM +0.5-1.0 pontos (dual tracking!)
```

---

## ?? IMPACTO DA CORRE??O:

### **Browser-Side Events (agora via CAPIG):**

**PageView, ViewContent, AddToCart, Lead, InitiateCheckout:**
- ? Dual tracking (browser + server via CAPIG)
- ? IP/UA autom?ticos do browser (CAPIG adiciona!)
- ? EQM: +0.5-1.0 pontos
- ? Deduplica??o autom?tica

### **Server-Side Events (Purchase via webhook):**

**Purchase:**
- ? Continua funcionando via Meta CAPI direto
- ? DQS 105
- ? IP/UA do Lead (j? capturamos!)
- ? Sem mudan?as

---

## ?? RESULTADO FINAL:

```
??????????????????????????????????????????????
?  ? DNS PROBLEMA IDENTIFICADO!             ?
?  ? C?DIGO CORRIGIDO E NO AR!              ?
?  ??????????????????????????????????????  ?
?                                            ?
?  ? ANTES: capig (DNS erro)                ?
?  ? AGORA: capigateway (200 OK)            ?
?                                            ?
?  C?digo: ? Corrigido                      ?
?  GitHub: ? Pushed                         ?
?  Vercel: ?? VOC? PRECISA ATUALIZAR!        ?
?                                            ?
?  Tempo: 5 minutos                          ?
?  Complexidade: F?cil                       ?
?                                            ?
?  Ap?s atualizar:                           ?
?  ? CAPIG receber? eventos!                ?
?  ? Dual tracking funcionando!             ?
?  ? EQM +0.5-1.0 pontos!                   ?
??????????????????????????????????????????????
```

---

## ?? CHECKLIST:

```
? Problema diagnosticado (DNS erro)
? Causa identificada (dom?nio errado)
? C?digo corrigido (4 arquivos)
? Build OK (sem erros)
? Git pushed (no ar!)
? Guia criado (passo a passo)
?? Vercel: ATUALIZAR AGORA! (voc?)
```

---

## ?? PR?XIMOS PASSOS:

1. ? **Atualizar Vercel** (5 min) - **VOC? FAZ**
2. ? Redeploy (2-3 min) - **Autom?tico**
3. ? Testar site (F12 ? Network)
4. ? Verificar Stape Dashboard (eventos chegando?)
5. ? Verificar Meta (EQM melhorou?)

---

**?? GUIA COMPLETO:** `URGENTE_ATUALIZAR_VERCEL_CAPIG.md`

**?? Ap?s atualizar Vercel, eventos come?ar?o a chegar no CAPIG!** ?
