# 🚨 DIAGNÓSTICO: Stape.io Interceptando Eventos Automaticamente

**Problema:** Mesmo com tags do Meta Pixel no GTM Web pausadas, TODOS os eventos do servidor chegam desduplicados.

**Causa Provável:** Stape.io está interceptando eventos do DataLayer e enviando automaticamente para Meta ANTES do GTM Server-Side processar.

---

## 🔍 ANÁLISE DO PROBLEMA

### **Situação Atual:**
```
1. Código → DataLayer.push({ event: 'view_item' })
2. Stape.io intercepta → Envia para Meta IMEDIATAMENTE → Chega PRIMEIRO → Processado ✅
3. Data Tag → GTM Server-Side → Processa → Envia para Meta → Chega DEPOIS → Desduplicado ❌
```

**Resultado:** Todos os eventos do servidor são desduplicados porque Stape.io chega primeiro!

---

## 🔍 VERIFICAÇÃO NECESSÁRIA

### **1. Verificar Network Tab**

**No DevTools → Network:**
1. Filtrar por: `facebook.com` ou `fb.com` ou `stape.io`
2. Verificar se há requisições sendo enviadas automaticamente
3. Verificar origem das requisições (Stape.io ou Meta direto)

**O que procurar:**
- Requisições para `https://graph.facebook.com/v*/events`
- Requisições para `https://*.stape.io/*`
- Requisições com `server_event_uri` no payload

---

### **2. Verificar Configuração do Stape.io**

**No Stape.io Dashboard:**
1. Verificar se há "Auto-Enhanced Events" ativado
2. Verificar se há "Automatic Event Tracking" ativado
3. Verificar se há interceptação automática de eventos do DataLayer
4. Verificar configuração do CAPIG Gateway

**Configurações a verificar:**
- `server_event_uri` - Se configurado, Stape intercepta automaticamente
- `auto_track` - Se ativado, Stape envia eventos automaticamente
- `intercept_data_layer` - Se ativado, Stape intercepta DataLayer

---

### **3. Verificar GTM Server-Side**

**No GTM Server-Side:**
1. Verificar se há tags configuradas para "Auto-fire"
2. Verificar se há interceptação automática de eventos
3. Verificar configuração do Data Client (Stape)

**O que verificar:**
- Data Client está configurado para interceptar eventos?
- Há tags configuradas para enviar automaticamente?
- Há configuração de `server_event_uri` no Data Client?

---

## ✅ SOLUÇÕES POSSÍVEIS

### **Solução 1: Desativar Interceptação Automática do Stape.io**

**Se Stape.io estiver interceptando automaticamente:**
1. No Stape.io Dashboard, desativar "Auto-Enhanced Events"
2. Desativar "Automatic Event Tracking"
3. Desativar interceptação automática do DataLayer
4. Garantir que apenas GTM Server-Side envia eventos

---

### **Solução 2: Remover server_event_uri**

**Se `server_event_uri` estiver configurado:**
1. Remover `server_event_uri` da configuração do Meta Pixel
2. Garantir que apenas GTM Server-Side envia eventos
3. Não usar CAPIG Gateway para interceptação automática

---

### **Solução 3: Usar event_id Diferente para Stape.io**

**Se não puder desativar interceptação:**
1. Configurar Stape.io para usar `event_id` diferente
2. OU configurar GTM Server-Side para usar `event_id` diferente
3. **NÃO recomendado** - Quebra deduplicação

---

### **Solução 4: Desativar Stape.io Completamente**

**Se Stape.io não for necessário:**
1. Remover configuração do Stape.io
2. Usar apenas GTM Server-Side para enviar eventos
3. Garantir que GTM Server-Side está configurado corretamente

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **Network Tab:**
- [ ] Há requisições para `facebook.com` sendo enviadas automaticamente?
- [ ] Qual a origem dessas requisições? (Stape.io, Meta direto, etc.)
- [ ] Há requisições com `server_event_uri` no payload?

### **Stape.io:**
- [ ] "Auto-Enhanced Events" está ativado?
- [ ] "Automatic Event Tracking" está ativado?
- [ ] Há interceptação automática do DataLayer?
- [ ] `server_event_uri` está configurado?

### **GTM Server-Side:**
- [ ] Data Client está configurado corretamente?
- [ ] Há tags configuradas para "Auto-fire"?
- [ ] Há interceptação automática de eventos?

### **Código:**
- [ ] Há Meta Pixel sendo carregado em algum lugar?
- [ ] Há `window.fbq()` sendo chamado diretamente?
- [ ] Há outros sistemas enviando eventos?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Verificar Network Tab → Requisições automáticas para Meta
2. ✅ Verificar Stape.io Dashboard → Configurações de interceptação
3. ✅ Verificar GTM Server-Side → Configuração do Data Client
4. ✅ Verificar código → Meta Pixel ou `window.fbq()` sendo usado

---

## ⚠️ PROBLEMA ADICIONAL: ViewContent Aparecendo como PageView

**Observação:** ViewContent está aparecendo como "PageView" no Meta Events Manager.

**Possíveis causas:**
1. GTM Server-Side está mapeando errado o evento
2. Stape.io está convertendo ViewContent para PageView
3. Configuração incorreta da tag no GTM Server-Side

**Verificar:**
- Tag `FB - ViewContent` no GTM Server-Side
- Mapeamento do evento `view_item` → `ViewContent`
- Configuração do trigger `dc - view_item`

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Todos os eventos do servidor chegam desduplicados
- ❌ ViewContent aparece como PageView
- ❌ Há um evento chegando ANTES do servidor

**Causa mais provável:**
- ⚠️ Stape.io interceptando eventos do DataLayer automaticamente
- ⚠️ OU GTM Server-Side enviando eventos duas vezes
- ⚠️ OU Meta Pixel sendo carregado em algum lugar

**Solução:**
- ✅ Identificar origem do evento que chega primeiro
- ✅ Desativar interceptação automática se necessário
- ✅ Garantir que apenas GTM Server-Side envia eventos

