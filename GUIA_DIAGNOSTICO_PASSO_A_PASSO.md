# 🔍 GUIA: Diagnóstico Passo a Passo - GTM Server-Side em Branco

**Problema:** GTM Server-Side Debug Preview está em branco, sem eventos no stream

---

## 📋 CHECKLIST DE DIAGNÓSTICO (FAZER NA ORDEM)

### **1. Verificar Console do Navegador** ⭐ **PRIMEIRO**

**Abrir DevTools → Console e executar:**
```javascript
// Verificar se DataLayer existe
console.log('DataLayer existe?', !!window.dataLayer);
console.log('DataLayer length:', window.dataLayer?.length);

// Ver últimos eventos
console.log('Últimos 5 eventos:', window.dataLayer?.slice(-5));

// Verificar se há eventos com event_id
window.dataLayer?.forEach(e => {
  if (e.event_id) {
    console.log('Evento com event_id:', e.event, e.event_id);
  }
});
```

**O que procurar:**
- ✅ `window.dataLayer` existe?
- ✅ Eventos aparecem no `dataLayer`?
- ✅ `event_id` está presente nos eventos?
- ❌ Há erros no console?

**Se não houver eventos no DataLayer:**
- ⚠️ Problema: Eventos não estão sendo enviados
- ✅ Solução: Verificar se código está chamando `pushToDataLayer()`

---

### **2. Verificar GTM Web Preview** ⭐ **SEGUNDO**

**Passos:**
1. Abrir GTM Web Container → Preview/Debug
2. Adicionar URL do site: `https://www.maracujazeropragas.com`
3. Navegar no site
4. Verificar se eventos aparecem no stream

**O que procurar:**
- ✅ Eventos aparecem no stream do GTM Web?
  - `page_view`
  - `view_item`
  - `add_to_cart`
  - etc.
- ✅ Data Tags disparam?
  - `DT - page_view`
  - `DT - view_item`
  - `DT - add_to_cart`
  - etc.
- ❌ Há erros nas tags?

**Se eventos aparecem no GTM Web mas Data Tags não disparam:**
- ⚠️ Problema: Data Tags não estão configuradas ou não estão ativas
- ✅ Solução: Verificar se Data Tags existem e estão ativas/publicadas

**Se eventos NÃO aparecem no GTM Web:**
- ⚠️ Problema: GTM Web não está recebendo eventos do DataLayer
- ✅ Solução: Verificar se GTM Web Container está carregado corretamente

---

### **3. Verificar Network Tab** ⭐ **TERCEIRO**

**Passos:**
1. Abrir DevTools → Network
2. Filtrar por: `event.maracujazeropragas.com`
3. Navegar no site
4. Verificar se há requisições sendo enviadas

**O que procurar:**
- ✅ Requisições sendo enviadas para Server-Side?
  - URL: `https://event.maracujazeropragas.com/...`
  - Método: POST ou GET
- ✅ Status 200 OK?
- ❌ Há erros (404, 500, CORS, etc.)?

**Se NÃO houver requisições:**
- ⚠️ Problema: Data Tags não estão enviando para Server-Side
- ✅ Solução: Verificar configuração das Data Tags

**Se houver erros (404, 500, etc.):**
- ⚠️ Problema: Server-Side não está acessível ou URL incorreta
- ✅ Solução: Verificar URL do Server-Side

---

### **4. Verificar GTM Server-Side Preview** ⭐ **QUARTO**

**Passos:**
1. Abrir GTM Server-Side Container → Preview/Debug
2. Adicionar URL do site: `https://www.maracujazeropragas.com`
3. Navegar no site
4. Verificar se eventos aparecem no stream

**O que procurar:**
- ✅ Eventos aparecem no stream do GTM Server-Side?
- ✅ Data Client recebe eventos?
- ✅ Tags disparam?

**Se eventos NÃO aparecem:**
- ⚠️ Problema: Data Client não está recebendo eventos
- ✅ Solução: Verificar configuração do Data Client

---

### **5. Verificar Data Tags no GTM Web**

**Passos:**
1. GTM Web → Tags
2. Procurar por: `DT - page_view`, `DT - view_item`, etc.
3. Verificar cada Data Tag:
   - ✅ Está ativa (não desativada)?
   - ✅ Está publicada?
   - ✅ Server Container URL está correto: `https://event.maracujazeropragas.com`?
   - ✅ Trigger está configurado corretamente?

**Se Data Tags não existem:**
- ⚠️ Problema: Data Tags não foram criadas
- ✅ Solução: Criar Data Tags para cada evento

**Se Data Tags existem mas não disparam:**
- ⚠️ Problema: Triggers não estão configurados corretamente
- ✅ Solução: Verificar triggers das Data Tags

---

### **6. Verificar Data Client no GTM Server-Side**

**Passos:**
1. GTM Server-Side → Clients
2. Abrir "Data Client"
3. Verificar:
   - ✅ Está ativo?
   - ✅ Aceita eventos do Web Container?
   - ✅ Não tem filtros bloqueando?

**Se Data Client não aceita eventos do Web Container:**
- ⚠️ Problema: Data Client não está configurado corretamente
- ✅ Solução: Configurar Data Client para aceitar eventos do Web Container

---

## 🎯 SOLUÇÕES RÁPIDAS

### **Solução 1: Verificar se eventos estão sendo enviados**

**Teste rápido:**
```javascript
// No console do navegador:
window.dataLayer.push({
  event: 'test_event',
  test: true,
  event_id: 'test_123'
});
```

**Se aparecer no GTM Web Preview:**
- ✅ DataLayer está funcionando
- ⚠️ Problema pode estar nas Data Tags ou Data Client

**Se NÃO aparecer no GTM Web Preview:**
- ❌ Problema: GTM Web não está carregado ou não está recebendo eventos

---

### **Solução 2: Verificar URL do Server-Side**

**Verificar variável no GTM Web:**
- GTM Web → Variables → `const - server_container_url`
- Deve ser: `https://event.maracujazeropragas.com`

**Testar se Server-Side está acessível:**
```bash
curl https://event.maracujazeropragas.com
```

**Se retornar erro:**
- ❌ Problema: Server-Side não está acessível
- ✅ Solução: Verificar se Server-Side está rodando

---

## 📝 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar melhor, preciso saber:

1. ✅ Eventos aparecem no console do navegador? (DataLayer)
2. ✅ Eventos aparecem no GTM Web Preview?
3. ✅ Data Tags disparam no GTM Web Preview?
4. ✅ Há requisições sendo enviadas para Server-Side? (Network tab)
5. ✅ Eventos aparecem no GTM Server-Side Preview?
6. ❌ Há erros no console?
7. ❌ Há erros no Network tab?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Fazer checklist na ordem
2. ✅ Identificar onde está o problema
3. ✅ Aplicar solução correspondente
4. ✅ Testar novamente

