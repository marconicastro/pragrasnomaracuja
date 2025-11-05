# 🔍 DIAGNÓSTICO: Eventos Disparados Duas Vezes

**Problema:** Todos os eventos estão sendo disparados duas vezes

---

## 📊 INFORMAÇÕES NECESSÁRIAS PARA DIAGNÓSTICO

Preciso das seguintes informações do teste:

### **1. GTM Preview Mode - Tags Disparadas**

**Screenshot ou texto mostrando:**
- Quais tags estão disparando duas vezes?
- Exemplo:
  ```
  FB - PageView → Disparou 2 vezes
  DT - page_view → Disparou 2 vezes
  GA4 - page_view → Disparou 2 vezes
  ```

### **2. Console do Navegador (DevTools)**

**Informações necessárias:**
- Abra o Console (F12)
- Procure por mensagens que começam com `📊 DataLayer push:`
- **Copie TODAS as mensagens** que aparecem quando você testa um evento

**Exemplo do que procurar:**
```javascript
📊 DataLayer push: {event: 'page_view', ...}
📊 DataLayer push: {event: 'page_view', ...}  // DUPLICADO?
```

### **3. Network Tab (DevTools)**

**Verificar:**
- Abra a aba Network
- Filtre por "gtm" ou "google-analytics"
- Quando testar um evento, veja se há requisições duplicadas
- **Screenshot ou lista das requisições**

### **4. Verificar Múltiplas Instâncias do GTM**

**No Console do navegador, execute:**
```javascript
// Verificar se há múltiplas instâncias do GTM
console.log('GTM Instances:', window.google_tag_manager);
console.log('DataLayer:', window.dataLayer);
console.log('DataLayer length:', window.dataLayer?.length);
```

**Copie o resultado**

### **5. Qual Evento Está Duplicado?**

**Teste específico:**
- Qual evento você testou? (PageView, ViewContent, AddToCart, GenerateLead, etc.)
- Em que momento aconteceu? (ao carregar página, ao clicar em botão, etc.)

---

## 🔍 POSSÍVEIS CAUSAS

### **Causa 1: Funções sendo chamadas duas vezes**
- Verificar se `trackPageViewElite()` está sendo chamada em múltiplos lugares
- Verificar se há useEffect duplicados

### **Causa 2: GTM Web + Server-Side capturando o mesmo evento**
- O evento é enviado para o DataLayer UMA vez
- Mas o GTM Web Container dispara tags
- E o GTM Server-Side também dispara tags (via "All Events")
- **Resultado:** Tags aparecem 2x no Preview Mode

### **Causa 3: Múltiplas instâncias do GTM carregadas**
- GTM script carregado duas vezes no `<head>`
- Verificar `layout.tsx`

### **Causa 4: Eventos sendo enviados duas vezes para o DataLayer**
- Funções `pushPageView()`, `pushViewItem()`, etc. sendo chamadas duas vezes
- Verificar console para ver se `📊 DataLayer push:` aparece 2x

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Envie as seguintes informações:

- [ ] **1. Screenshot do GTM Preview Mode** mostrando tags duplicadas
- [ ] **2. Console logs** mostrando `📊 DataLayer push:` (quantas vezes aparece?)
- [ ] **3. Network tab** mostrando requisições duplicadas (se houver)
- [ ] **4. Resultado do comando** `console.log(window.dataLayer)` no console
- [ ] **5. Qual evento testou** e quando aconteceu

---

## 🎯 PRÓXIMOS PASSOS

Após receber essas informações, vou:
1. Identificar a causa exata da duplicação
2. Propor solução específica
3. Implementar a correção




