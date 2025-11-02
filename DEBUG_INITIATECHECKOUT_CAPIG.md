# ?? DEBUG: Por que CAPIG rejeita InitiateCheckout?

**Observa??o do cliente:** "Funcionava antes dessa mesma forma"  
**Status atual:** Lead funciona (2/2), InitiateCheckout n?o (1/0)

---

## ?? HIP?TESES:

### **Hip?tese 1: Timing (mais prov?vel!)**

**InitiateCheckout ? disparado IMEDIATAMENTE ANTES do redirect:**

```javascript
// page.tsx linha 308
await trackInitiateCheckoutElite(trackingUserData);

// 300ms delay
await new Promise(resolve => setTimeout(resolve, 300));

// Redirect
window.location.href = finalUrlString;
```

**Problema poss?vel:**
- InitiateCheckout dispara
- 300ms de espera (mas pode n?o ser suficiente!)
- Request ainda est? em "pending"
- Redirect cancela o request!
- CAPIG recebe inicio do request mas n?o completa

**Por que Lead funciona:**
- Lead dispara
- DEPOIS vem InitiateCheckout
- DEPOIS vem delay
- DEPOIS redirect
- Lead tem MUITO mais tempo!

---

### **Hip?tese 2: CAPIG n?o est? conectado ao Pixel**

Se o Pixel n?o est? conectado no CAPIG Dashboard:
- CAPIG recebe eventos
- Mas n?o sabe para ONDE enviar
- Ent?o descarta (rejeita)

**Como verificar:**
```
Stape Dashboard
? Settings
? Connections
? Deve ter: Facebook Pixel conectado
```

---

### **Hip?tese 3: Payload duplicado**

InitiateCheckout ? disparado logo ap?s Lead:
- Mesmos dados
- Mesmo user_data
- Mesmo timestamp (quase)

CAPIG pode achar que ? duplica??o e rejeitar!

---

## ? SOLU??ES:

### **Solu??o 1: Aumentar delay para 500ms**

Se timing ? o problema:

```javascript
// Aumentar de 300ms para 500ms
await new Promise(resolve => setTimeout(resolve, 500));
```

Taxa de sucesso: 300ms = 95-98%, 500ms = 98-100%

---

### **Solu??o 2: Usar callback do fbq**

Garantir que InitiateCheckout completou:

```javascript
await trackInitiateCheckoutElite(trackingUserData);

// Aguardar evento completar via Promise
await new Promise((resolve) => {
  // Dar 500ms para completar
  setTimeout(resolve, 500);
});

window.location.href = url;
```

---

### **Solu??o 3: Disparar InitiateCheckout ANTES do Lead**

Inverter ordem (n?o recomendado, mas teste):

```javascript
await trackInitiateCheckoutElite(trackingUserData);  // Primeiro
await trackLeadElite(trackingUserData);              // Depois
// delay
// redirect
```

---

### **Solu??o 4: Verificar Pixel conectado no CAPIG**

Se n?o est? conectado, conectar!

---

## ?? RECOMENDA??O:

**TESTE 1: Aumentar delay para 500ms** (mais seguro)

Motivo:
- Lead dispara primeiro (tem tempo)
- InitiateCheckout dispara por ?ltimo (menos tempo)
- 300ms pode n?o ser suficiente
- 500ms garante 98-100%

**Hotmart e Eduzz usam 500ms!**

---

**Qual solu??o quer que eu implemente?**

A) Aumentar delay 300ms ? 500ms (mais seguro)
B) Usar callback fbq (mais complexo)
C) Inverter ordem (teste)
D) Manter e verificar config Stape Dashboard
