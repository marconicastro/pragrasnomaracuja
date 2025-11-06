# ✅ SOLUÇÃO: ViewContent não está disparando a tag no servidor

**Problema:** Evento `view_item` chega no servidor, mas tag `FB - ViewContent` não dispara.

**Situação:**
- ✅ Data Tag `DT - view_item` dispara no GTM Web
- ✅ Requisição chega no servidor (`event.maracujazeropragas.com`)
- ✅ Payload contém `event_name=view_item`
- ❌ Tag `FB - ViewContent` não dispara no servidor

---

## 🔍 ANÁLISE DO PROBLEMA

### **Payload recebido:**
```
GET /data?v=2&event_name=view_item&dtdc=...
```

**Dados decodificados:**
- ✅ `event_name=view_item`
- ✅ `event_id=ViewContent_1762452959626_03kxsn06zn`
- ✅ Dados do usuário presentes
- ✅ Dados do produto presentes

### **Trigger configurado:**
- ✅ Trigger: `dc - view_item`
- ✅ Event Name: `view_item`
- ✅ Client Name: `Data Client`

---

## ✅ SOLUÇÕES POSSÍVEIS

### **Solução 1: Verificar se trigger está capturando corretamente**

**No GTM Server-Side:**
1. Ir para **Triggers** → `dc - view_item`
2. Verificar configuração:
   - ✅ Event Name: `view_item` (deve ser exatamente isso)
   - ✅ Client Name: `Data Client` (deve ser exatamente isso)
   - ✅ Trigger está ativo

**Possível problema:**
- Event Name pode estar diferente (ex: `ViewContent` em vez de `view_item`)
- Client Name pode estar diferente

---

### **Solução 2: Verificar se tag está ativa**

**No GTM Server-Side:**
1. Ir para **Tags** → `FB - ViewContent`
2. Verificar:
   - ✅ Tag está ativa (não desativada)
   - ✅ Tag está publicada
   - ✅ Trigger está configurado corretamente

---

### **Solução 3: Verificar Preview Mode do Servidor**

**No GTM Server-Side Preview:**
1. Abrir Preview Mode
2. Acessar o site
3. Verificar no stream:
   - ✅ Evento `view_item` aparece?
   - ✅ Tag `FB - ViewContent` aparece?
   - ✅ Status da tag: "Success" ou "Failed"?

**Se tag não aparece:**
- Trigger não está capturando o evento
- Verificar configuração do trigger

**Se tag aparece mas falha:**
- Verificar variáveis (podem estar undefined)
- Verificar configuração da tag

---

### **Solução 4: Verificar se evento está sendo recebido pelo Data Client**

**No GTM Server-Side Preview:**
1. Verificar se evento aparece no stream
2. Verificar se evento tem Client Name: `Data Client`
3. Verificar se Event Name é exatamente `view_item`

**Possível problema:**
- Evento pode estar chegando com nome diferente
- Evento pode estar chegando de outro client

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### **GTM Server-Side Preview:**
- [ ] Evento `view_item` aparece no stream?
- [ ] Client Name é `Data Client`?
- [ ] Event Name é exatamente `view_item`?
- [ ] Tag `FB - ViewContent` aparece no stream?
- [ ] Status da tag: "Success" ou "Failed"?

### **Trigger `dc - view_item`:**
- [ ] Event Name: `view_item` (exatamente)
- [ ] Client Name: `Data Client` (exatamente)
- [ ] Trigger está ativo?

### **Tag `FB - ViewContent`:**
- [ ] Tag está ativa?
- [ ] Tag está publicada?
- [ ] Trigger: `dc - view_item`?
- [ ] Variáveis estão mapeadas corretamente?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ Abrir GTM Server-Side Preview
2. ✅ Acessar o site
3. ✅ Verificar se evento `view_item` aparece no stream
4. ✅ Verificar se tag `FB - ViewContent` aparece
5. ✅ Verificar status da tag (Success/Failed)
6. ✅ Se tag não aparece: Verificar trigger
7. ✅ Se tag falha: Verificar variáveis

---

## ⚠️ OBSERVAÇÃO IMPORTANTE

**O usuário mencionou:**
> "Quando o debug server estava funcionando, o evento ViewContent estava OK"

**Isso indica:**
- ✅ Configuração estava correta antes
- ✅ Algo mudou ou foi desativado
- ✅ Pode ser que Preview Mode não esteja funcionando corretamente

**Solução:**
- Verificar se Preview Mode está conectado corretamente
- Verificar se há mudanças recentes no trigger ou tag
- Verificar se tag foi desativada acidentalmente

---

## ✅ CONCLUSÃO

**Problema:**
- ❌ Tag `FB - ViewContent` não dispara no servidor
- ✅ Evento chega no servidor corretamente

**Causa mais provável:**
- ⚠️ Trigger não está capturando o evento corretamente
- ⚠️ OU tag está desativada
- ⚠️ OU Preview Mode não está funcionando

**Solução:**
- ✅ Verificar GTM Server-Side Preview
- ✅ Verificar trigger `dc - view_item`
- ✅ Verificar tag `FB - ViewContent`
- ✅ Verificar se Preview Mode está conectado

