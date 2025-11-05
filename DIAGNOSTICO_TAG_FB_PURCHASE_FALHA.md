# 🔍 DIAGNÓSTICO: Tag "FB - Purchase" Falhou

**Status:** ✅ Tag disparou, mas falhou ao enviar para Meta

**Observações:**
- ✅ Evento apareceu no stream
- ✅ Tag "FB - Purchase" disparou
- ❌ Tag "FB - Purchase" falhou (erro ao enviar para Meta)
- ✅ Tag "GA4 - purchase" concluída com sucesso

---

## 🔍 INFORMAÇÕES NECESSÁRIAS

Para diagnosticar o problema, preciso das seguintes informações do Preview Mode:

### **1. Detalhes da Tag "FB - Purchase":**

No Preview Mode → **Tags** → **FB - Purchase** → **Falha**:

1. **Mensagem de erro:** Qual é a mensagem de erro exata?
2. **Status HTTP:** Qual o código de status da resposta do Meta?
3. **Resposta do Meta:** Qual a resposta completa do Meta?

### **2. Valores das Variáveis:**

No Preview Mode → **Variáveis** → Verificar se todas têm valores:

#### **Custom Data:**
- [ ] `{{ed - ecommerce.value}}` → Qual valor?
- [ ] `{{ed - ecommerce.currency}}` → Qual valor?
- [ ] `{{ed - ecommerce.transaction_id}}` → Qual valor?
- [ ] `{{ed - content_ids}}` → Qual valor?
- [ ] `{{ed - contents}}` → Qual valor?
- [ ] `{{ed - num_items}}` → Qual valor?
- [ ] `{{ed - content_name}}` → Qual valor?
- [ ] `{{ed - content_type}}` → Qual valor?

#### **User Data:**
- [ ] `{{ed - user_data.email_address}}` → Qual valor?
- [ ] `{{ed - user_data.first_name}}` → Qual valor?
- [ ] `{{ed - user_data.last_name}}` → Qual valor?
- [ ] `{{ed - user_data.phone_number}}` → Qual valor?
- [ ] `{{ed - user_data.city}}` → Qual valor?
- [ ] `{{ed - user_data.region}}` → Qual valor?
- [ ] `{{ed - user_data.postal_code}}` → Qual valor?
- [ ] `{{ed - user_data.country}}` → Qual valor?
- [ ] `{{cs - x-stape-user-id}}` → Qual valor?

### **3. Payload Enviado ao Meta:**

No Preview Mode → **Tags** → **FB - Purchase** → **Solicitação HTTP enviada do servidor**:

Verificar o payload completo que foi enviado ao Meta.

---

## 🔍 POSSÍVEIS CAUSAS

### **1. Variável ainda retornando `undefined`:**
- Alguma variável pode não ter sido criada/corrigida
- Path pode estar incorreto
- Dados podem não estar no payload

### **2. Campo obrigatório faltando:**
- Meta pode estar rejeitando por falta de algum campo obrigatório
- Erro de validação do Meta

### **3. Erro de autenticação:**
- API Access Token pode estar inválido
- Pixel ID pode estar incorreto

### **4. Formato incorreto:**
- Algum campo pode estar em formato incorreto
- Tipo de dados errado (string ao invés de number, etc.)

---

## 📋 CHECKLIST DE DIAGNÓSTICO

### **Passo 1: Verificar Variáveis**
- [ ] Todas as variáveis têm valores? (não `undefined`)
- [ ] Paths estão corretos?
- [ ] Variáveis Event Data foram criadas?

### **Passo 2: Verificar Payload**
- [ ] `custom_data.value` presente?
- [ ] `custom_data.currency` presente?
- [ ] `custom_data.order_id` presente?
- [ ] `user_data` presente?
- [ ] Formato está correto?

### **Passo 3: Verificar Resposta do Meta**
- [ ] Qual o código de status?
- [ ] Qual a mensagem de erro?
- [ ] Resposta completa do Meta

---

## 🎯 PRÓXIMOS PASSOS

1. **Capturar detalhes do erro** no Preview Mode
2. **Verificar valores das variáveis** no Preview Mode
3. **Verificar payload enviado** ao Meta
4. **Verificar resposta do Meta** (código e mensagem)

Com essas informações, posso identificar exatamente o que está causando a falha e corrigir.

---

## 📸 INFORMAÇÕES NECESSÁRIAS

Por favor, envie:
1. Screenshot ou texto da mensagem de erro da tag "FB - Purchase"
2. Valores das variáveis no Preview Mode
3. Payload enviado ao Meta (se disponível)
4. Resposta do Meta (código de status e mensagem)



