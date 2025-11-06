# ✅ SOLUÇÃO FINAL: Deduplicação - Stape Data Tag Enviando Automaticamente

## 🔍 PROBLEMA IDENTIFICADO

**Stape Data Tag está enviando eventos automaticamente para Meta ANTES do GTM Server-Side processar.**

**Configuração atual:**
- Data Tag usa: `"request_type": "auto"`
- Data Tag carrega: `https://stapecdn.com/dtag/v8.js`
- Este script intercepta eventos do DataLayer e envia automaticamente para Meta

**Fluxo atual (ERRADO):**
```
1. Código → DataLayer.push({ event: 'view_item' })
2. Stape Data Tag script intercepta → Envia para Meta IMEDIATAMENTE → Chega PRIMEIRO → Processado ✅
3. Data Tag → GTM Server-Side → Processa → Envia para Meta → Chega DEPOIS → Desduplicado ❌
```

---

## ✅ SOLUÇÃO: Configurar Data Tag para NÃO Enviar Automaticamente

### **OPÇÃO 1: Alterar request_type para "manual" (Recomendado)**

**No GTM Web:**
1. Ir para **Tags** → Cada Data Tag (`DT - *`)
2. Abrir configuração da Data Tag
3. Procurar por: **"Request Type"** ou **"Auto-send"**
4. Alterar de `"auto"` para `"manual"` ou desativar "Auto-send to Meta"
5. Salvar e publicar

**Se não houver essa opção:**
- Verificar no Stape.io Dashboard se há configuração global
- Desativar "Auto-Enhanced Events" ou "Automatic Event Tracking"

---

### **OPÇÃO 2: Remover script do Stape Data Tag**

**No GTM Web:**
1. Ir para **Tags** → Cada Data Tag (`DT - *`)
2. Abrir configuração
3. Procurar por: **"Data Tag Load Script URL"**
4. Remover ou deixar vazio: `https://stapecdn.com/dtag/v8.js`
5. Salvar e publicar

**⚠️ ATENÇÃO:** Isso pode quebrar o envio para GTM Server-Side. Verificar se Data Tag ainda funciona.

---

### **OPÇÃO 3: Verificar Stape.io Dashboard**

**No Stape.io Dashboard:**
1. Acessar: https://stape.io
2. Selecionar container do GTM Server-Side
3. Ir para **Settings** ou **Configuration**
4. Verificar:
   - **"Auto-Enhanced Events"** → Desativar se ativado
   - **"Automatic Event Tracking"** → Desativar se ativado
   - **"Intercept DataLayer"** → Desativar se ativado
   - **"Auto-send to Meta"** → Desativar se ativado

---

## 🎯 VERIFICAÇÃO

### **Após alterar configuração:**

1. **Network Tab:**
   - Filtrar por: `facebook.com` ou `fb.com`
   - Verificar se NÃO há mais requisições automáticas
   - Apenas GTM Server-Side deve enviar

2. **Meta Events Manager:**
   - Eventos devem chegar apenas do servidor
   - Sem desduplicação
   - Status: "Processado" (não "Desduplicado")

---

## ⚠️ IMPORTANTE

**Data Tags são necessárias para:**
- ✅ Enviar eventos do browser para GTM Server-Side
- ✅ Processar eventos no servidor

**Mas NÃO devem:**
- ❌ Enviar automaticamente para Meta
- ❌ Interceptar e enviar antes do servidor processar

**Solução:**
- ✅ Manter Data Tags para enviar para GTM Server-Side
- ✅ Desativar envio automático para Meta
- ✅ Deixar apenas GTM Server-Side enviar para Meta

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Stape Data Tag está enviando automaticamente para Meta
- ❌ Eventos do servidor são desduplicados

**Solução:**
- ✅ Alterar `request_type` de `"auto"` para `"manual"` nas Data Tags
- ✅ OU Desativar "Auto-send to Meta" no Stape.io Dashboard
- ✅ Deixar apenas GTM Server-Side enviar para Meta

**Resultado esperado:**
- ✅ Apenas servidor envia para Meta
- ✅ Sem duplicação
- ✅ Eventos chegam como "Processado"

