# 🎯 VARIÁVEIS COMPLETAS PARA PURCHASE

**Objetivo:** Criar TODAS as variáveis de uma vez (custom_data + user_data) para garantir qualidade máxima do evento.

**Nota:** Este guia lista todas as variáveis na ordem lógica de criação, mas recomenda-se fazer tudo de uma vez!

---

## 🔴 CRÍTICAS (RESOLVEM O ERRO ATUAL)

### **1. `ed - ecommerce.currency`**
- **Path:** `ecommerce.currency`
- **Mapear em:** Custom Data → `currency`
- **Prioridade:** 🔴 **CRÍTICA** (resolve o erro atual)

### **2. `ed - ecommerce.value`**
- **Path:** `ecommerce.value`
- **Mapear em:** Custom Data → `value`
- **Prioridade:** 🔴 **CRÍTICA** (resolve o erro atual)

### **3. `ed - ecommerce.transaction_id`**
- **Path:** `ecommerce.transaction_id`
- **Mapear em:** Custom Data → `order_id`
- **Prioridade:** 🔴 **CRÍTICA**

---

## 🟡 IMPORTANTES (MELHORAM QUALIDADE)

### **4. `ed - content_name`**
- **Path:** `content_name`
- **Mapear em:** Custom Data → `content_name`

### **5. `ed - content_type`**
- **Path:** `content_type`
- **Mapear em:** Custom Data → `content_type`

### **6. `ed - content_ids`**
- **Path:** `content_ids`
- **Mapear em:** Custom Data → `content_ids`

### **7. `ed - num_items`**
- **Path:** `num_items`
- **Mapear em:** Custom Data → `num_items`

---

## 🟢 USER DATA (PARA ATRIBUIÇÃO)

### **8. `ed - user_data.user_id`**
- **Path:** `user_data.user_id`
- **Mapear em:** User Data → `external_id`

### **9. `ed - user_data.email_address`**
- **Path:** `user_data.email_address`
- **Mapear em:** User Data → `email_address`

### **10. `ed - user_data.phone_number`**
- **Path:** `user_data.phone_number`
- **Mapear em:** User Data → `phone_number`

---

## 📋 ORDEM LÓGICA DE CRIAÇÃO (FAZER TUDO DE UMA VEZ)

### **FASE 1: Custom Data (8 variáveis)**
1. ✅ `ed - ecommerce.currency` (resolve erro)
2. ✅ `ed - ecommerce.value` (resolve erro)
3. ✅ `ed - ecommerce.transaction_id`
4. ✅ `ed - content_name`
5. ✅ `ed - content_type`
6. ✅ `ed - content_ids`
7. ✅ `ed - contents`
8. ✅ `ed - num_items`

### **FASE 2: User Data (9 variáveis)**
9. ✅ `ed - user_data.user_id` (para external_id)
10. ✅ `ed - user_data.email_address`
11. ✅ `ed - user_data.phone_number`
12. ✅ `ed - user_data.first_name`
13. ✅ `ed - user_data.last_name`
14. ✅ `ed - user_data.city`
15. ✅ `ed - user_data.region` (para state)
16. ✅ `ed - user_data.postal_code` (para zip)
17. ✅ `ed - user_data.country`

### **FASE 3: Metadata (4 variáveis)**
18. ✅ `ed - event_id`
19. ✅ `ed - event_source_url`
20. ✅ `ed - client_ip_address` (opcional)
21. ✅ `ed - client_user_agent` (opcional)

---

## 🎯 RECOMENDAÇÃO: FAZER TUDO DE UMA VEZ

**Criar todas as 21 variáveis de uma vez:**
- ✅ Resolve erro imediatamente (custom_data completo)
- ✅ Máxima qualidade do evento (user_data completo)
- ✅ Melhor atribuição (external_id, PII completo)
- ✅ Maior Event Match Quality (EQM) no Meta
- ✅ Evita retrabalho (não precisa voltar depois)

**Mapear todas na tag "FB - Purchase":**
- Custom Data: 8 campos
- User Data: 11 campos
- Event Metadata: 2 campos

**Testar:** Enviar evento e verificar se tudo está funcionando corretamente.

---

## ✅ VALIDAÇÃO RÁPIDA

Após criar e mapear as 3 variáveis críticas:

1. Enviar evento de teste
2. Verificar no Preview Mode:
   - ✅ Variáveis têm valores?
   - ✅ Tag dispara?
3. Verificar payload enviado ao Meta:
   - ✅ `custom_data.currency` presente?
   - ✅ `custom_data.value` presente?
   - ✅ `custom_data.order_id` presente?

**Se sim → ✅ SUCESSO!** (Erro do Meta resolvido)

**Se não →** Verificar se os paths estão corretos nos dados do evento.

