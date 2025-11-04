# 🔧 GUIA: Ativar Power Up de Teste na Stape

**Objetivo:** Ativar o modo de teste/debug no Stape para visualizar eventos de webhook no stream do GTM Server-Side.

---

## 📋 PASSO A PASSO

### **1. Acessar Configurações do Stape**
1. Faça login no Stape: https://stape.io/
2. Acesse o seu container GTM Server-Side
3. Vá em **Configurações** ou **Settings**

### **2. Ativar Power Up de Teste**
1. Procure por **"Power Up"** ou **"Test Mode"** ou **"Debug Mode"**
2. Ative a opção de **teste/debug**
3. Salve as alterações

### **3. Verificar se está Ativo**
- Deve aparecer um indicador visual de que o modo de teste está ativo
- Pode aparecer um badge ou indicador no dashboard

---

## 🔍 ONDE VERIFICAR OS EVENTOS APÓS ATIVAR

### **No Stape Dashboard:**
1. Acesse o dashboard do container
2. Vá em **Events** ou **Stream**
3. Os eventos de webhook devem aparecer agora

### **No GTM Server-Side Preview Mode:**
1. Abra o Tag Assistant: https://tagassistant.google.com/
2. Conecte ao container Server-Side
3. Os eventos devem aparecer no stream após ativar o Power Up

---

## ⚠️ OBSERVAÇÕES IMPORTANTES

### **Power Up de Teste:**
- Permite visualizar eventos server-side no stream
- Útil para debug e validação
- Pode ter limitações de tempo ou quantidade de eventos

### **Após Ativar:**
- Teste o webhook novamente via ReqBin
- Verifique se o evento aparece no stream
- Verifique se as tags disparam

---

## 📝 PRÓXIMOS PASSOS APÓS ATIVAR

1. ✅ Ativar Power Up de teste no Stape
2. ⏳ Testar webhook novamente via ReqBin
3. ⏳ Verificar se evento aparece no stream
4. ⏳ Verificar se tags disparam
5. ⏳ Validar no Meta Events Manager
6. ⏳ Validar no GA4 DebugView

---

**Status**: Aguardando ativação do Power Up de teste no Stape

