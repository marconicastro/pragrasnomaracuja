# 🚨 DIAGNÓSTICO: ViewContent não está chegando na Meta via Servidor

**Problema:** ViewContent não está sendo enviado para Meta via GTM Server-Side.

**Situação:**
- ✅ Network Tab: Nada para facebook/fb.com (CAPIG não está sendo usado)
- ✅ PageView, AddToCart, Lead, InitiateCheckout chegam via servidor
- ❌ ViewContent não chega via servidor

---

## 🔍 VERIFICAÇÃO NECESSÁRIA

### **1. Verificar se Data Tag está disparando**

**No GTM Web Preview:**
1. Abrir GTM Web → Preview/Debug
2. Navegar no site
3. Verificar no stream se aparece:
   - `DT - view_item` (Data Tag)

**O que procurar:**
- ✅ Data Tag `DT - view_item` aparece no stream?
- ✅ Status: "Success" ou "Failed"?
- ❌ Se não aparecer: Data Tag não está disparando

---

### **2. Verificar Network Tab (Requisições para Server-Side)**

**No DevTools → Network:**
1. Filtrar por: `event.maracujazeropragas.com`
2. Navegar no site
3. Verificar se aparecem requisições para `view_item`

**O que procurar:**
- ✅ Requisições HTTP para `https://event.maracujazeropragas.com/...`
- ✅ Método: POST
- ✅ Status: 200 OK
- ✅ Payload contém `event: "view_item"`
- ❌ Se não aparecer: Data Tag não está enviando

---

### **3. Verificar GTM Server-Side Preview**

**No GTM Server-Side Preview:**
1. Abrir GTM Server-Side → Preview/Debug
2. Acessar o site
3. Verificar no stream se aparece:
   - Evento `view_item` recebido
   - Tag `FB - ViewContent` disparada

**O que procurar:**
- ✅ Evento `view_item` aparece no stream?
- ✅ Tag `FB - ViewContent` é disparada?
- ✅ Status: "Success" ou "Failed"?
- ❌ Se não aparecer: Evento não está chegando no servidor

---

### **4. Verificar Trigger no GTM Server-Side**

**No GTM Server-Side:**
1. Ir para **Triggers**
2. Procurar por: `dc - view_item`
3. Verificar configuração:
   - ✅ Event Name: `view_item`
   - ✅ Client Name: `Data Client`
   - ✅ Trigger está ativo

---

### **5. Verificar Tag FB - ViewContent**

**No GTM Server-Side:**
1. Ir para **Tags**
2. Procurar por: `FB - ViewContent`
3. Verificar configuração:
   - ✅ Tag está ativa
   - ✅ Trigger: `dc - view_item`
   - ✅ Event Name: `ViewContent`
   - ✅ Variáveis mapeadas corretamente

---

## ✅ SOLUÇÕES POSSÍVEIS

### **Solução 1: Data Tag não está disparando**

**Se Data Tag não aparece no GTM Web Preview:**
1. Verificar trigger da Data Tag `DT - view_item`
2. Verificar se trigger `ce - view_item` está configurado corretamente
3. Verificar se Data Tag está ativa e publicada

---

### **Solução 2: Evento não está chegando no servidor**

**Se evento não aparece no GTM Server-Side Preview:**
1. Verificar se Data Tag está enviando para URL correta
2. Verificar se Server Container URL está correto: `https://event.maracujazeropragas.com`
3. Verificar se Data Client está configurado corretamente

---

### **Solução 3: Tag não está sendo disparada**

**Se evento chega mas tag não dispara:**
1. Verificar trigger `dc - view_item` no GTM Server-Side
2. Verificar se Event Name está correto: `view_item`
3. Verificar se Client Name está correto: `Data Client`
4. Verificar se tag `FB - ViewContent` está ativa

---

### **Solução 4: Variáveis retornando undefined**

**Se tag dispara mas variáveis estão undefined:**
1. Verificar se variáveis Event Data estão criadas
2. Verificar se paths estão corretos
3. Verificar se dados estão sendo enviados no DataLayer

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **GTM Web:**
- [ ] Data Tag `DT - view_item` existe?
- [ ] Data Tag está ativa?
- [ ] Trigger `ce - view_item` está configurado?
- [ ] Data Tag aparece no Preview?

### **Network Tab:**
- [ ] Requisições para `event.maracujazeropragas.com` aparecem?
- [ ] Payload contém `event: "view_item"`?
- [ ] Status: 200 OK?

### **GTM Server-Side:**
- [ ] Evento `view_item` aparece no Preview?
- [ ] Trigger `dc - view_item` está configurado?
- [ ] Tag `FB - ViewContent` está ativa?
- [ ] Tag dispara no Preview?

### **Variáveis:**
- [ ] Variáveis Event Data estão criadas?
- [ ] Paths estão corretos?
- [ ] Dados estão sendo enviados no DataLayer?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Verificar GTM Web Preview → Data Tag `DT - view_item`
2. ✅ Verificar Network Tab → Requisições para Server-Side
3. ✅ Verificar GTM Server-Side Preview → Evento `view_item`
4. ✅ Verificar Trigger e Tag no GTM Server-Side

---

## ⚠️ SOBRE O CAPIG

**CAPIG está desativado porque:**
- ✅ Código não usa mais `window.fbq()` (Meta Pixel não está sendo carregado)
- ✅ CAPIG funciona apenas com `window.fbq()` + `server_event_uri`
- ✅ Como não há Meta Pixel no browser, CAPIG não está sendo usado
- ✅ Variável `NEXT_PUBLIC_STAPE_CONTAINER_URL` ainda está configurada, mas não está sendo usada

**Isso é correto!** CAPIG não é necessário quando usamos apenas GTM Server-Side.

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ ViewContent não está chegando na Meta via servidor
- ✅ Outros eventos (PageView, AddToCart, etc.) chegam normalmente

**Causa mais provável:**
- ⚠️ Data Tag `DT - view_item` não está disparando
- ⚠️ OU evento não está chegando no servidor
- ⚠️ OU tag `FB - ViewContent` não está sendo disparada

**Solução:**
- ✅ Verificar Data Tag no GTM Web
- ✅ Verificar Network Tab
- ✅ Verificar GTM Server-Side Preview
- ✅ Verificar Trigger e Tag no GTM Server-Side

