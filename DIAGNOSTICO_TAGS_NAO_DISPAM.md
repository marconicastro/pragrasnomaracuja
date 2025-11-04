# 🔍 DIAGNÓSTICO: Tags não estão disparando no GTM Server-Side

**Problema:** Webhook envia para GTM Server-Side com sucesso, mas tags não disparam

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Formato do payload incorreto**
GTM Server-Side pode precisar de formato diferente do DataLayer padrão.

### **2. Endpoint incorreto**
O endpoint `/data` pode não ser o correto para eventos server-side.

### **3. Trigger não configurado**
O trigger `ce - purchase` pode não estar configurado no GTM Server-Side.

### **4. Formato do evento**
O evento pode precisar estar em formato específico para GTM Server-Side.

---

## ✅ VERIFICAÇÕES NECESSÁRIAS

### **1. Verificar formato do payload:**
GTM Server-Side pode precisar de:
- Formato Measurement Protocol (GA4)
- Formato específico para eventos server-side
- Headers específicos

### **2. Verificar endpoint:**
- `/data` - Para eventos do browser via DataLayer
- `/collect` - Para eventos GA4
- Outro endpoint específico?

### **3. Verificar no GTM Server-Side Preview:**
- O evento aparece no stream?
- Qual é o formato do evento que chega?
- Quais variáveis estão disponíveis?

---

## 🔧 SOLUÇÕES POSSÍVEIS

### **Solução 1: Usar formato Measurement Protocol**
GTM Server-Side pode precisar do formato GA4 Measurement Protocol.

### **Solução 2: Usar Client Name correto**
Pode precisar especificar o Client Name no payload.

### **Solução 3: Verificar configuração do GTM**
- Trigger está configurado?
- Tags estão ativas?
- Variáveis estão corretas?

---

## 📋 PRÓXIMOS PASSOS

1. Verificar no GTM Server-Side Preview Mode o formato do evento recebido
2. Ajustar formato do payload conforme necessário
3. Verificar configuração de triggers e tags

