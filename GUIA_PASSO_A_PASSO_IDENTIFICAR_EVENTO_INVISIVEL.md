# 🔍 GUIA PASSO A PASSO: Identificar Evento "Invisível"

**Problema:** Todos os eventos do servidor chegam desduplicados, indicando que há um evento chegando ANTES.

**Objetivo:** Identificar qual sistema está enviando eventos automaticamente.

---

## 📋 PASSO 1: Verificar Network Tab

### **1.1. Abrir DevTools**
1. Abrir a página do site
2. Pressionar `F12` ou `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (Mac)
3. Ir para a aba **Network**

### **1.2. Filtrar Requisições**
1. No campo de filtro, digitar: `facebook` ou `fb.com` ou `graph.facebook`
2. Recarregar a página (`F5` ou `Ctrl+R`)
3. Realizar ações que disparam eventos (scroll, clicar em botão, etc.)

### **1.3. Analisar Requisições**
**Verificar cada requisição para `facebook.com` ou `fb.com`:**

1. **Clicar em cada requisição**
2. **Verificar aba "Headers":**
   - **Request URL:** Qual é a URL completa?
   - **Request Method:** GET ou POST?
   - **Origin:** De onde vem a requisição? (Stape.io, Meta direto, etc.)

3. **Verificar aba "Payload" ou "Request":**
   - Há `server_event_uri` no payload?
   - Há `event_id` no payload?
   - Qual é o `event_id`? (copiar e comparar com eventos desduplicados)

4. **Verificar aba "Response":**
   - Status code: 200 (sucesso)?
   - Há mensagem de erro?

### **1.4. Anotar Resultados**
**Criar uma lista:**
```
Requisição 1:
- URL: https://graph.facebook.com/v18.0/1403975024017865/events
- Origin: Stape.io (ou Meta direto, ou GTM Server-Side)
- event_id: ViewContent_1762452305433_tb6qzy30wj
- Timestamp: 15:05:11.123

Requisição 2:
- URL: https://event.maracujazeropragas.com/data?client_name=...
- Origin: GTM Server-Side
- event_id: ViewContent_1762452305433_tb6qzy30wj
- Timestamp: 15:05:11.456
```

**Comparar timestamps:** Qual chegou primeiro?

---

## 📋 PASSO 2: Verificar Stape.io Dashboard

### **2.1. Acessar Stape.io**
1. Acessar: https://stape.io
2. Fazer login
3. Selecionar o container do GTM Server-Side

### **2.2. Verificar Configurações**
**Procurar por:**
1. **"Auto-Enhanced Events"** - Está ativado?
2. **"Automatic Event Tracking"** - Está ativado?
3. **"Intercept Data Layer"** - Está ativado?
4. **"CAPIG Gateway"** - Está configurado?
5. **"Server Event URI"** - Está configurado?

### **2.3. Verificar Data Client**
1. Ir para **"Clients"** → **"Data Client"**
2. Verificar configuração:
   - Há interceptação automática?
   - Há `server_event_uri` configurado?
   - Há auto-track ativado?

### **2.4. Verificar Logs**
1. Ir para **"Logs"** ou **"Events"**
2. Verificar se há eventos sendo enviados automaticamente
3. Verificar timestamps dos eventos

---

## 📋 PASSO 3: Verificar GTM Server-Side

### **3.1. Acessar GTM**
1. Acessar: https://tagmanager.google.com
2. Selecionar container **Server-Side** (`GTM-W4PGS3LR`)

### **3.2. Verificar Data Client**
1. Ir para **"Clients"** → **"Data Client"**
2. Verificar configuração:
   - Há interceptação automática?
   - Há auto-fire configurado?
   - Há `server_event_uri` configurado?

### **3.3. Verificar Tags**
1. Ir para **"Tags"**
2. Verificar cada tag do Meta Pixel:
   - `FB - PageView`
   - `FB - ViewContent`
   - `FB - AddToCart`
   - `FB - InitiateCheckout`
   - `FB - Lead`
   - `FB - Purchase`

3. **Para cada tag, verificar:**
   - Está ativada?
   - Qual é o trigger?
   - Há "Auto-fire" configurado?

### **3.4. Verificar Preview Mode**
1. Ativar **Preview Mode**
2. Acessar o site
3. Verificar se eventos aparecem no stream
4. Verificar se tags são disparadas

---

## 📋 PASSO 4: Verificar Código

### **4.1. Verificar Meta Pixel**
**No console do navegador:**
```javascript
// Verificar se Meta Pixel está carregado
console.log('Meta Pixel:', window.fbq);

// Verificar se há eventos sendo enviados
window.fbq = function(...args) {
  console.log('fbq chamado:', args);
  // Chamar função original se existir
};
```

### **4.2. Verificar DataLayer**
**No console do navegador:**
```javascript
// Verificar eventos no DataLayer
console.log('DataLayer:', window.dataLayer);

// Interceptar pushes do DataLayer
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log('DataLayer push:', args);
  return originalPush.apply(this, args);
};
```

### **4.3. Verificar Network Tab (novamente)**
**Após interceptar:**
1. Recarregar a página
2. Verificar se há logs no console
3. Verificar se há requisições no Network Tab
4. Comparar timestamps

---

## 📋 PASSO 5: Comparar Resultados

### **5.1. Criar Tabela Comparativa**
```
Evento: ViewContent_1762452305433_tb6qzy30wj

| Origem          | Timestamp    | Status      |
|-----------------|--------------|-------------|
| Stape.io        | 15:05:11.123 | Processado  |
| GTM Server-Side | 15:05:11.456 | Desduplicado|
```

### **5.2. Identificar Origem**
**Se Stape.io chegou primeiro:**
- ✅ Stape.io está interceptando eventos automaticamente
- ✅ Solução: Desativar interceptação no Stape.io

**Se GTM Server-Side chegou primeiro:**
- ✅ GTM Server-Side está enviando duas vezes
- ✅ Solução: Verificar tags duplicadas no GTM Server-Side

**Se Meta direto chegou primeiro:**
- ✅ Meta Pixel está sendo carregado em algum lugar
- ✅ Solução: Remover Meta Pixel do código

---

## ✅ SOLUÇÕES BASEADAS NO RESULTADO

### **Se Stape.io está interceptando:**
1. No Stape.io Dashboard, desativar "Auto-Enhanced Events"
2. Desativar "Automatic Event Tracking"
3. Remover `server_event_uri` se configurado
4. Garantir que apenas GTM Server-Side envia eventos

### **Se GTM Server-Side está enviando duas vezes:**
1. Verificar se há tags duplicadas
2. Verificar se há triggers duplicados
3. Verificar se há "Auto-fire" configurado
4. Remover duplicatas

### **Se Meta Pixel está sendo carregado:**
1. Verificar se há componente carregando Meta Pixel
2. Verificar se há `fbevents.js` sendo carregado
3. Remover Meta Pixel do código
4. Garantir que apenas GTM Server-Side envia eventos

---

## 🎯 RESULTADO ESPERADO

**Após identificar e corrigir:**
- ✅ Apenas GTM Server-Side envia eventos
- ✅ Eventos chegam processados (não desduplicados)
- ✅ ViewContent aparece corretamente (não como PageView)

---

## ⚠️ PROBLEMA ADICIONAL: ViewContent como PageView

**Se ViewContent aparece como PageView:**
1. Verificar tag `FB - ViewContent` no GTM Server-Side
2. Verificar mapeamento do evento `view_item` → `ViewContent`
3. Verificar trigger `dc - view_item`
4. Verificar se há configuração incorreta

---

## 📝 CHECKLIST FINAL

- [ ] Network Tab verificado
- [ ] Stape.io Dashboard verificado
- [ ] GTM Server-Side verificado
- [ ] Código verificado
- [ ] Origem do evento identificada
- [ ] Solução aplicada
- [ ] Teste realizado
- [ ] Eventos chegando processados (não desduplicados)

