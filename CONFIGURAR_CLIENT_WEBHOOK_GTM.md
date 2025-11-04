# 🔧 CONFIGURAR: Client para Webhook no GTM Server-Side

**Objetivo:** Criar/configurar um Client específico para processar eventos de webhook

---

## 🎯 POR QUE PRECISA DE UM CLIENT ESPECÍFICO?

### **Data Client (padrão):**
- ✅ Processa eventos do browser via DataLayer
- ✅ Recebe eventos do GTM Web Container
- ❌ **NÃO processa eventos server-side diretos** (como webhooks)

### **Client para Webhook:**
- ✅ Processa eventos server-side diretos
- ✅ Recebe eventos via POST `/data` de fontes externas
- ✅ Permite processar eventos do webhook

---

## 📋 CONFIGURAÇÃO NO GTM SERVER-SIDE

### **Opção 1: Usar Data Client (se suportar server-side)**

**Verificar se Data Client aceita eventos server-side:**
1. Abrir GTM Server-Side → Clients
2. Abrir "Data Client"
3. Verificar configuração de "Ingestion Settings"
4. Se permitir "Server-side events", pode usar

### **Opção 2: Criar Client Customizado (Recomendado)**

**Passos:**

1. **Abrir GTM Server-Side → Clients**
2. **Criar novo Client:**
   - Nome: `Webhook Client` (ou `Server-Side Events`)
   - Tipo: `Custom Client`
3. **Configurar Ingestion:**
   - Permitir eventos server-side
   - Aceitar POST em `/data`
4. **Configurar Processamento:**
   - Processar eventos normalmente
   - Passar para tags (FB, GA4, etc.)

---

## 🔧 AJUSTAR CÓDIGO

### **Se usar Client Customizado:**

**Atualizar `sendPurchaseToGTM()`:**
```typescript
// Usar Client Name correto
const gtmEndpoint = `${gtmServerUrl}/data?client_name=Webhook Client`;
```

**Ou se usar Data Client com suporte server-side:**
```typescript
const gtmEndpoint = `${gtmServerUrl}/data?client_name=Data Client`;
```

---

## 📊 ESTRUTURA DO CLIENT

### **Client para Webhook deve ter:**
- ✅ Nome único (ex: "Webhook Client")
- ✅ **Accepted Path Settings:** Configurar path `/data`
  - Ir em "Accepted Path Settings"
  - Adicionar path: `/data`
  - Tipo: "Additional paths"
- ✅ Ingestion Settings: Aceitar server-side events
- ✅ Processamento: Passar eventos para tags
- ✅ Variáveis: Acessar Event Data (ed - *)

---

## 🎯 CONFIGURAÇÃO RECOMENDADA

### **Nome do Client:**
```
Webhook Client
```

### **Ingestion Settings:**
- ✅ Aceitar eventos server-side
- ✅ Endpoint: `/data`
- ✅ Método: POST
- ✅ Content-Type: application/json

### **Processamento:**
- ✅ Processar eventos normalmente
- ✅ Passar para Data Client (opcional)
- ✅ Ou processar diretamente

---

## ✅ APÓS CONFIGURAR

1. **Atualizar código** para usar o Client Name correto
2. **Testar webhook** novamente
3. **Verificar no GTM Preview Mode** se evento aparece
4. **Verificar se tags disparam**

---

## 📝 NOTA

**Se o GTM Server-Side estiver hospedado na Stape:**
- Stape pode ter configuração específica para Clients
- Verificar documentação da Stape sobre Clients customizados
- Pode precisar configurar permissões específicas

