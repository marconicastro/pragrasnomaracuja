# 🔍 DIAGNÓSTICO COMPLETO: Webhook não aparece no stream

**Sintoma:** Evento envia com sucesso (200 OK), mas não aparece no stream e tags não disparam

---

## 🔍 VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar logs do servidor (Vercel):**
Procurar por:
- ✅ `📦 Payload completo sendo enviado:` - Ver formato exato
- ✅ `📥 Resposta do GTM Server-Side:` - Ver resposta completa
- ✅ Status code da resposta
- ✅ Body da resposta

### **2. Verificar no GTM Server-Side Preview Mode:**
- ✅ Evento aparece no stream?
- ✅ Qual Client processou o evento?
- ✅ Quais variáveis estão disponíveis?
- ✅ Tags disparam?

### **3. Verificar configuração do Client:**
- ✅ Client "Webhook Client" existe?
- ✅ Path `/data` está em "Accepted Path Settings"?
- ✅ "Accept Server-Side Events" está habilitado?
- ✅ Client está ativo/publicado?

---

## 🔧 POSSÍVEIS PROBLEMAS

### **Problema 1: Client não está recebendo**
**Sintoma:** Resposta 200 OK, mas evento não aparece no stream

**Causas possíveis:**
- Client não está configurado corretamente
- Path não está em "Accepted Path Settings"
- Client não aceita server-side events

**Solução:**
- Verificar configuração do Client
- Adicionar path `/data` em "Accepted Path Settings"
- Habilitar "Accept Server-Side Events"

---

### **Problema 2: Formato do payload incorreto**
**Sintoma:** GTM Server-Side aceita, mas não processa

**Causas possíveis:**
- Formato não corresponde ao esperado
- Faltam campos obrigatórios
- Estrutura incorreta

**Solução:**
- Verificar logs do payload completo
- Comparar com formato do browser
- Ajustar formato conforme necessário

---

### **Problema 3: Client Name incorreto**
**Sintoma:** Evento não é roteado para o Client correto

**Causas possíveis:**
- Client Name não corresponde ao configurado
- Query parameter não está sendo processado

**Solução:**
- Verificar nome exato do Client no GTM
- Usar nome exato (case-sensitive)
- Verificar se está sendo passado corretamente

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **Logs do Servidor:**
- [ ] Payload completo está sendo logado?
- [ ] Resposta do GTM Server-Side está sendo logada?
- [ ] Status code é 200 OK?
- [ ] Body da resposta contém informações úteis?

### **GTM Server-Side:**
- [ ] Client "Webhook Client" existe?
- [ ] Path `/data` está configurado?
- [ ] Client está ativo?
- [ ] Preview Mode mostra algum evento?

### **Configuração:**
- [ ] Variável `GTM_WEBHOOK_CLIENT_NAME` está configurada?
- [ ] Nome do Client está correto (case-sensitive)?
- [ ] Endpoint está correto?

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Adicionar logs detalhados** (já feito)
2. ⏳ **Testar webhook novamente**
3. ⏳ **Verificar logs completos** (payload + resposta)
4. ⏳ **Verificar no GTM Preview Mode**
5. ⏳ **Ajustar conforme necessário**

---

## 📝 INFORMAÇÕES NECESSÁRIAS

**Para diagnosticar melhor, preciso:**
1. Logs completos do payload sendo enviado
2. Resposta completa do GTM Server-Side (status + body)
3. Screenshot do GTM Preview Mode (se possível)
4. Configuração do Client no GTM Server-Side

---

## 🔧 SOLUÇÃO ALTERNATIVA

**Se não funcionar via `/data` endpoint:**
- Pode precisar usar Custom Tag que busca dados do KV
- Ou usar outro método de integração
- Ou manter fallback para Meta CAPI direto




