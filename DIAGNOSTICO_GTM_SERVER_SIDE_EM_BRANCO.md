# 🔍 DIAGNÓSTICO: GTM Server-Side Debug em Branco

**Problema:** GTM Server-Side Debug Preview está em branco, sem eventos no stream

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Eventos não estão sendo enviados para o DataLayer**
- Verificar se `window.dataLayer.push()` está sendo chamado
- Verificar console do navegador para erros
- Verificar se eventos aparecem no DataLayer

### **2. GTM Web Container não está encaminhando para Server-Side**
- Verificar se Data Tags estão configuradas
- Verificar se Data Tags estão ativas/publicadas
- Verificar se Data Tags estão apontando para o Server-Side correto

### **3. Data Client não está recebendo eventos**
- Verificar se Data Client está configurado corretamente
- Verificar se Data Client aceita eventos do Web Container
- Verificar se há filtros bloqueando eventos

### **4. Problema com URL do Server-Side**
- Verificar se URL está correta: `https://event.maracujazeropragas.com`
- Verificar se Server-Side está acessível
- Verificar se há erros de CORS ou conexão

---

## ✅ CHECKLIST DE DIAGNÓSTICO

### **1. Verificar Console do Navegador:**
```javascript
// No console do navegador, verificar:
console.log('DataLayer:', window.dataLayer);
console.log('Últimos eventos:', window.dataLayer.slice(-5));
```

**O que procurar:**
- ✅ Eventos aparecem no `dataLayer`?
- ✅ Há erros no console?
- ✅ `event_id` está presente nos eventos?

### **2. Verificar GTM Web Preview:**
- Abrir GTM Web → Preview/Debug
- Adicionar URL do site
- Verificar se eventos aparecem no stream
- Verificar se Data Tags disparam

**O que procurar:**
- ✅ Eventos aparecem no stream do GTM Web?
- ✅ Data Tags disparam (DT - page_view, DT - view_item, etc.)?
- ✅ Há erros nas tags?

### **3. Verificar GTM Server-Side Preview:**
- Abrir GTM Server-Side → Preview/Debug
- Adicionar URL do site
- Verificar se eventos aparecem no stream

**O que procurar:**
- ✅ Eventos aparecem no stream do GTM Server-Side?
- ✅ Data Client recebe eventos?
- ✅ Tags disparam?

### **4. Verificar Network Tab:**
- Abrir DevTools → Network
- Filtrar por: `event.maracujazeropragas.com`
- Verificar se há requisições sendo enviadas

**O que procurar:**
- ✅ Requisições sendo enviadas para Server-Side?
- ✅ Status 200 OK?
- ✅ Há erros (404, 500, etc.)?

---

## 🔧 SOLUÇÕES POSSÍVEIS

### **Solução 1: Verificar Data Tags no GTM Web**

**Verificar se Data Tags existem e estão ativas:**
1. GTM Web → Tags
2. Procurar por: `DT - page_view`, `DT - view_item`, etc.
3. Verificar se estão:
   - ✅ Ativas (não desativadas)
   - ✅ Publicadas
   - ✅ Apontando para Server-Side correto

**Se não existirem, criar:**
- Tipo: Server Container URL
- Server Container URL: `https://event.maracujazeropragas.com`
- Trigger: `ce - page_view` (ou evento correspondente)

### **Solução 2: Verificar Data Client no GTM Server-Side**

**Verificar configuração do Data Client:**
1. GTM Server-Side → Clients
2. Abrir "Data Client"
3. Verificar:
   - ✅ Está ativo
   - ✅ Aceita eventos do Web Container
   - ✅ Não tem filtros bloqueando

### **Solução 3: Verificar URL do Server-Side**

**Verificar se URL está correta:**
- GTM Web → Variables → `const - server_container_url`
- Deve ser: `https://event.maracujazeropragas.com`

**Testar se Server-Side está acessível:**
```bash
curl https://event.maracujazeropragas.com
```

---

## 📋 TESTE RÁPIDO

### **Teste 1: Verificar se eventos chegam ao DataLayer**
```javascript
// No console do navegador:
window.dataLayer.push({
  event: 'test_event',
  test: true,
  event_id: 'test_123'
});
console.log('DataLayer após push:', window.dataLayer);
```

### **Teste 2: Verificar se GTM Web recebe eventos**
- Abrir GTM Web → Preview/Debug
- Navegar no site
- Verificar se eventos aparecem no stream

### **Teste 3: Verificar se Server-Side recebe eventos**
- Abrir GTM Server-Side → Preview/Debug
- Navegar no site
- Verificar se eventos aparecem no stream

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Verificar console do navegador
2. ✅ Verificar GTM Web Preview
3. ✅ Verificar GTM Server-Side Preview
4. ✅ Verificar Network Tab
5. ✅ Verificar Data Tags
6. ✅ Verificar Data Client

---

## 📝 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar melhor, preciso saber:
1. Eventos aparecem no console do navegador?
2. Eventos aparecem no GTM Web Preview?
3. Há erros no console?
4. Há requisições sendo enviadas para Server-Side (Network tab)?
5. Data Tags existem e estão ativas no GTM Web?

