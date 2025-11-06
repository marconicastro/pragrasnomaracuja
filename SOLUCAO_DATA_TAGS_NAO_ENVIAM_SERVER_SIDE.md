# 🔧 SOLUÇÃO: Data Tags não estão enviando para Server-Side

**Problema:** GTM Web funciona, mas Server-Side não recebe eventos (como se estivesse "desligado")

---

## 🔍 DIAGNÓSTICO

### **Situação:**
- ✅ GTM Web Preview funciona normalmente
- ✅ Tags do GTM Web disparam perfeitamente
- ❌ GTM Server-Side não recebe nada
- ❌ Nenhuma requisição HTTP para Server-Side no Network tab

**Causa provável:** Data Tags não estão disparando ou não estão configuradas corretamente

---

## ✅ VERIFICAÇÃO PASSO A PASSO

### **1. Verificar se Data Tags disparam no GTM Web Preview**

**Passos:**
1. Abrir GTM Web → Preview/Debug
2. Navegar no site
3. Verificar no stream se aparecem:
   - `DT - page_view`
   - `DT - view_item`
   - `DT - add_to_cart`
   - `DT - begin_checkout`
   - `DT - generate_lead`
   - `DT - purchase`

**O que procurar:**
- ✅ Data Tags aparecem no stream?
- ✅ Status: "Success" ou "Failed"?
- ❌ Se não aparecerem: Data Tags não estão disparando

---

### **2. Verificar Network Tab (HTTP Requests)**

**Passos:**
1. Abrir DevTools → Network
2. **Limpar** requisições (botão Clear)
3. Filtrar por: `event.maracujazeropragas.com`
4. Navegar no site
5. Verificar se aparecem requisições

**O que procurar:**
- ✅ Requisições HTTP para `https://event.maracujazeropragas.com/...`
- ✅ Método: POST ou GET
- ✅ Status: 200 OK
- ❌ Se não aparecer: Data Tags não estão enviando

**Formato esperado:**
```
Name: event.maracujazeropragas.com/...
Method: POST
Status: 200
Type: xhr ou fetch
```

---

### **3. Verificar Data Tags no GTM Web**

**Passos:**
1. GTM Web → Tags
2. Procurar por: `DT - page_view`, `DT - view_item`, etc.
3. Para cada Data Tag, verificar:

**Configuração correta:**
- ✅ **Tag Type:** Server Container URL
- ✅ **Server Container URL:** `https://event.maracujazeropragas.com`
- ✅ **Trigger:** `ce - page_view` (ou evento correspondente)
- ✅ **Tag está ativa** (não desativada)
- ✅ **Tag está publicada**

**Verificar também:**
- ✅ Variável `const - server_container_url` existe?
- ✅ Valor: `https://event.maracujazeropragas.com`

---

### **4. Verificar Triggers das Data Tags**

**Passos:**
1. GTM Web → Tags → Abrir uma Data Tag (ex: `DT - page_view`)
2. Verificar Trigger:
   - ✅ Trigger está configurado?
   - ✅ Trigger é: `ce - page_view` (ou evento correspondente)?
   - ✅ Trigger está ativo?

**Verificar se Triggers existem:**
- GTM Web → Triggers
- Verificar se existem:
  - `ce - page_view`
  - `ce - view_item`
  - `ce - add_to_cart`
  - `ce - begin_checkout`
  - `ce - generate_lead`
  - `ce - purchase`

---

## 🔧 SOLUÇÕES

### **Solução 1: Data Tags não estão disparando**

**Se Data Tags não aparecem no GTM Web Preview:**

1. **Verificar se Triggers estão configurados:**
   - GTM Web → Triggers
   - Verificar se `ce - page_view`, `ce - view_item`, etc. existem
   - Se não existirem, criar

2. **Verificar se Data Tags estão ativas:**
   - GTM Web → Tags
   - Verificar se Data Tags estão ativas (não desativadas)
   - Se estiverem desativadas, ativar

3. **Publicar container:**
   - GTM Web → Submit
   - Publicar versão

---

### **Solução 2: Data Tags não estão enviando (sem requisições HTTP)**

**Se Data Tags disparam mas não há requisições HTTP:**

1. **Verificar URL do Server-Side:**
   - GTM Web → Variables → `const - server_container_url`
   - Deve ser: `https://event.maracujazeropragas.com`
   - Se estiver errado, corrigir

2. **Verificar configuração da Data Tag:**
   - GTM Web → Tags → Abrir Data Tag
   - Verificar se "Server Container URL" está correto
   - Deve usar: `{{const - server_container_url}}` ou URL direta

3. **Testar URL do Server-Side:**
   ```bash
   curl https://event.maracujazeropragas.com
   ```
   - Se retornar erro: Server-Side pode estar offline
   - Se retornar OK: Server-Side está acessível

---

### **Solução 3: Data Client não está recebendo**

**Se há requisições HTTP mas Server-Side não mostra eventos:**

1. **Verificar Data Client:**
   - GTM Server-Side → Clients
   - Abrir "Data Client"
   - Verificar:
     - ✅ Está ativo
     - ✅ Aceita eventos do Web Container
     - ✅ Não tem filtros bloqueando

2. **Verificar se Server-Side está acessível:**
   - Testar URL: `https://event.maracujazeropragas.com`
   - Verificar se retorna resposta

---

## 📋 CHECKLIST RÁPIDO

### **No GTM Web Preview:**
- [ ] Data Tags aparecem no stream? (`DT - page_view`, etc.)
- [ ] Data Tags têm status "Success"?
- [ ] Há erros nas Data Tags?

### **No Network Tab:**
- [ ] Há requisições para `event.maracujazeropragas.com`?
- [ ] Status 200 OK?
- [ ] Método POST ou GET?

### **No GTM Web (Configuração):**
- [ ] Data Tags existem?
- [ ] Data Tags estão ativas?
- [ ] Data Tags estão publicadas?
- [ ] Triggers estão configurados?
- [ ] URL do Server-Side está correta?

---

## 🎯 PRÓXIMOS PASSOS

**Me diga:**
1. ✅ Data Tags aparecem no GTM Web Preview? (DT - page_view, etc.)
2. ✅ Há requisições HTTP no Network tab para `event.maracujazeropragas.com`?
3. ✅ Se houver requisições, qual o status? (200, 404, 500, etc.)

Com essas informações, posso identificar exatamente onde está o problema!

