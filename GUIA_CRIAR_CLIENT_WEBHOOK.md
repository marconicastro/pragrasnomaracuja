# 📋 GUIA: Criar Client para Webhook no GTM Server-Side

**Objetivo:** Criar um Client específico para processar eventos de webhook

---

## 🎯 PASSO A PASSO

### **1. Acessar GTM Server-Side**
- Abrir GTM Server-Side Container
- Ir em **Clients** (no menu lateral)

### **2. Criar Novo Client**
- Clicar em **"New"** ou **"+"**
- Nome: `Webhook Client` (ou `Server-Side Events`)
- Tipo: **Custom Client**

### **3. Configurar Ingestion Settings**
- **Ingestion Method:** `HTTP POST`
- **Accepted Path Settings:** 
  - ✅ Adicionar path `/data`
  - Tipo: `Additional paths`
  - Exemplo: `/data` ou `/webhook` (conforme necessário)
- **Accept Server-Side Events:** ✅ Sim
- **Content-Type:** `application/json`

### **4. Configurar Processamento**
- **Process Events:** ✅ Sim
- **Pass to Data Client:** Opcional (se quiser que Data Client também processe)
- **Variables:** Habilitar Event Data Variables (ed - *)

### **5. Salvar e Publicar**
- Salvar Client
- Publicar container (ou testar em Preview Mode)

---

## 🔧 CONFIGURAÇÃO NO CÓDIGO

### **Variável de Ambiente:**
```env
GTM_WEBHOOK_CLIENT_NAME=Webhook Client
```

**Se não configurado, usa:** `Data Client` (pode não funcionar)

### **Código atualizado:**
```typescript
const clientName = process.env.GTM_WEBHOOK_CLIENT_NAME || 'Data Client';
const gtmEndpoint = `${gtmServerUrl}/data?client_name=${encodeURIComponent(clientName)}`;
```

---

## ✅ VERIFICAÇÃO

### **Após criar Client:**
1. ✅ Testar webhook novamente
2. ✅ Verificar no GTM Preview Mode se evento aparece
3. ✅ Verificar se Client Name está correto
4. ✅ Verificar se tags disparam

---

## 📝 NOTA IMPORTANTE

**Se usar Stape:**
- Verificar se Stape permite criar Clients customizados
- Pode precisar de configuração específica na Stape
- Verificar documentação da Stape

**Se não conseguir criar Client:**
- Tentar usar `Data Client` (pode não funcionar)
- Ou usar outro método (ex: Custom Tag que busca dados do KV)

