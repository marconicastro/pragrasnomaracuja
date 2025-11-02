# ?? URGENTE: ATUALIZAR URL CAPIG NA VERCEL

**Problema encontrado:** DNS n?o resolve `[dominio-anterior-dns-erro]`  
**Solu??o:** Usar `capigateway.maracujazeropragas.com` (funciona!)  
**A??o:** ATUALIZAR AGORA NA VERCEL!

---

## ?? PASSO A PASSO (5 minutos):

### **1. Acessar Vercel:**
```
https://vercel.com/dashboard
? Projeto: pragrasnomaracuja
? Settings
? Environment Variables
```

### **2. Localizar vari?vel:**
```
NEXT_PUBLIC_STAPE_CONTAINER_URL
```

### **3. Editar valor:**

**? VALOR ERRADO (atual):**
```
https://[dominio-anterior-dns-erro]
```

**? VALOR CORRETO (novo):**
```
https://capigateway.maracujazeropragas.com
```

### **4. Salvar:**
```
? Click "Save"
? Environments: Production, Preview, Development (todos!)
```

### **5. Redeploy:**
```
Deployments ? Latest ? ... ? Redeploy
```

**Ou aguarde pr?ximo push (j? est? no c?digo!)** ?

---

## ?? COMO TESTAR DEPOIS:

### **1. Aguardar deploy (2-3 min)**

### **2. Acessar site:**
```
https://www.maracujazeropragas.com
```

### **3. F12 ? Console:**
```javascript
// Verificar URL configurada:
_fbq.getState().pixels['642933108377475']

// Deveria mostrar:
// server_event_uri: "https://capigateway.maracujazeropragas.com"
```

### **4. F12 ? Network:**
```
Filter: "capigateway"

Deveria ver requests para:
? https://capigateway.maracujazeropragas.com/events
? Status: 200 OK
```

### **5. Stape CAPIG Dashboard:**
```
https://tagmanager.stape.io
? Containers ? nova_capig_maracuja
? Events (aba)

Deveria ver eventos chegando:
? PageView
? ViewContent
? AddToCart
? Lead
? InitiateCheckout
```

---

## ?? SE AINDA N?O FUNCIONAR:

### **Verificar conex?o Meta Pixel no Stape:**

**1. Acessar:**
```
https://tagmanager.stape.io
? Containers ? nova_capig_maracuja
? Settings ? Connections
```

**2. Verificar se tem:**
```
? Facebook Pixel (ou Meta Pixel)
? Status: Connected
? Pixel ID: 642933108377475
```

**3. Se N?O tiver:**
```
1. Add Connection
2. Facebook Pixel
3. OAuth (recomendado)
4. Autorizar com Meta Business Manager
5. Selecionar Pixel: 642933108377475
6. Save
```

---

## ?? TESTE DNS (Opcional):

**Verificar se DNS est? correto:**

```bash
# Linux/Mac terminal:
nslookup capigateway.maracujazeropragas.com

# Deveria retornar algo como:
# Name: capigateway.maracujazeropragas.com
# Address: xxx.xxx.xxx.xxx
```

**Teste HTTP:**
```bash
curl -I https://capigateway.maracujazeropragas.com

# Deveria retornar:
# HTTP/2 200
```

? J? testei: **FUNCIONA!**

---

## ?? RESUMO:

```
? ANTES: [dominio-anterior-dns-erro] (DNS erro)
? AGORA: capigateway.maracujazeropragas.com (funciona!)

? C?digo: Corrigido e no ar
?? Vercel: VOC? PRECISA ATUALIZAR!

Tempo: 5 minutos
Passos: 5
Complexidade: F?cil
```

---

## ?? AP?S ATUALIZAR:

**Eventos come?ar?o a chegar no CAPIG automaticamente!**

**Verificar em:**
- Stape Dashboard ? Events (tempo real)
- Meta Events Manager ? Activity (5-10 min)

---

**?? A??O IMEDIATA: ATUALIZAR VERCEL AGORA!** ??
