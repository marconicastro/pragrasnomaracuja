# 🚀 RESUMO EXECUTIVO: Criar Variáveis Event Data para Webhook

**Problema:** Tag "FB - Purchase" dispara, mas `custom_data` está vazio no payload enviado ao Meta.

**Erro do Meta:**
```
"error_user_msg":"Seu evento de compra não inclui um parâmetro de moeda. Insira um parâmetro de moeda. Por exemplo: USD"
```

**Situação:**
- ✅ GTM Web já tem variáveis configuradas (Data Layer Variables `{{dlv - *}}`)
- ✅ Essas variáveis funcionam para eventos do browser (PageView, ViewContent, etc.)
- ❌ Webhook precisa de variáveis **Event Data** (`{{ed - *}}`) para acessar dados do payload

**Solução:** Criar variáveis **Event Data Variable** (`{{ed - *}}`) com os **mesmos paths** do GTM Web, mas para acessar dados do webhook.

---

## 🔍 DIFERENÇA IMPORTANTE

### **GTM Web (Browser - já configurado):**
- Tipo: **Data Layer Variable** (`{{dlv - *}}`)
- Path: `ecommerce.value`, `ecommerce.currency`, etc.
- Uso: Eventos do browser (PageView, ViewContent, AddToCart, Lead, InitiateCheckout)

### **GTM Server-Side (Webhook - precisa criar):**
- Tipo: **Event Data Variable** (`{{ed - *}}`)
- Path: `ecommerce.value`, `ecommerce.currency`, etc. ← **MESMO PATH!**
- Uso: Evento Purchase do webhook

**Por que precisamos de variáveis diferentes?**
- GTM Web acessa `window.dataLayer` (Data Layer Variables)
- GTM Server-Side (webhook) acessa payload do evento direto (Event Data Variables)
- **Mas os paths são os mesmos porque o formato do payload é o mesmo!** ✅

---

## ✅ SOLUÇÃO COMPLETA: 3 PASSOS

### **PASSO 1: Criar Variáveis Event Data (para Webhook)**

No GTM Server-Side → **Variáveis** → **Nova** → **Event Data Variable**:

**IMPORTANTE:** 
- Criar variáveis **Event Data Variable** (`{{ed - *}}`)
- Usar os **mesmos paths** que já existem no GTM Web
- Exemplo: Se no GTM Web tem `dlv - ecommerce.value` (path: `ecommerce.value`), criar `ed - ecommerce.value` (path: `ecommerce.value`)

#### **🔴 CUSTOM DATA (Obrigatórias - Resolvem Erro):**

1. **`ed - ecommerce.currency`**
   - Path: `ecommerce.currency`

2. **`ed - ecommerce.value`**
   - Path: `ecommerce.value`

3. **`ed - ecommerce.transaction_id`**
   - Path: `ecommerce.transaction_id`

#### **🟡 CUSTOM DATA (Importantes - Melhoram Qualidade):**

4. **`ed - content_name`**
   - Path: `content_name`

5. **`ed - content_type`**
   - Path: `content_type`

6. **`ed - content_ids`**
   - Path: `content_ids`

7. **`ed - contents`**
   - Path: `contents`

8. **`ed - num_items`**
   - Path: `num_items`

#### **🟢 USER DATA (Para Atribuição - Máxima Qualidade):**

9. **`ed - user_data.user_id`**
   - Path: `user_data.user_id`

10. **`ed - user_data.email_address`**
    - Path: `user_data.email_address`

11. **`ed - user_data.phone_number`**
    - Path: `user_data.phone_number`

12. **`ed - user_data.first_name`**
    - Path: `user_data.first_name`

13. **`ed - user_data.last_name`**
    - Path: `user_data.last_name`

14. **`ed - user_data.city`**
    - Path: `user_data.city`

15. **`ed - user_data.region`**
    - Path: `user_data.region`

16. **`ed - user_data.postal_code`**
    - Path: `user_data.postal_code`

17. **`ed - user_data.country`**
    - Path: `user_data.country`

#### **🔵 METADATA (Opcionais mas Recomendadas):**

18. **`ed - event_id`**
    - Path: `event_id`

19. **`ed - event_source_url`**
    - Path: `event_source_url`

20. **`ed - client_ip_address`** (se disponível)
    - Path: `client_ip_address`

21. **`ed - client_user_agent`** (se disponível)
    - Path: `client_user_agent`

---

### **PASSO 2: Mapear na Tag "FB - Purchase" (usar Event Data Variables)**

**IMPORTANTE:** 
- Na tag "FB - Purchase", usar variáveis **Event Data** (`{{ed - *}}`) para eventos do webhook
- Se eventos do browser também usam essa tag, pode precisar de lógica condicional ou tags separadas
- **Recomendação:** Mapear Event Data Variables na tag "FB - Purchase" para que funcione com webhook

#### **📍 CUSTOM DATA:**

Na tag **FB - Purchase** → **Custom Data**:

1. **`currency`** = `{{ed - ecommerce.currency}}`
2. **`value`** = `{{ed - ecommerce.value}}`
3. **`order_id`** = `{{ed - ecommerce.transaction_id}}`
4. **`content_name`** = `{{ed - content_name}}`
5. **`content_type`** = `{{ed - content_type}}`
6. **`content_ids`** = `{{ed - content_ids}}`
7. **`contents`** = `{{ed - contents}}`
8. **`num_items`** = `{{ed - num_items}}`

#### **📍 USER DATA:**

Na tag **FB - Purchase** → **User Data**:

1. **`external_id`** = `{{ed - user_data.user_id}}`
2. **`email_address`** = `{{ed - user_data.email_address}}` (hasheado automaticamente)
3. **`phone_number`** = `{{ed - user_data.phone_number}}` (hasheado automaticamente)
4. **`first_name`** = `{{ed - user_data.first_name}}` (hasheado automaticamente)
5. **`last_name`** = `{{ed - user_data.last_name}}` (hasheado automaticamente)
6. **`city`** = `{{ed - user_data.city}}` (hasheado automaticamente)
7. **`state`** = `{{ed - user_data.region}}` (hasheado automaticamente)
8. **`zip`** = `{{ed - user_data.postal_code}}` (hasheado automaticamente)
9. **`country`** = `{{ed - user_data.country}}` (hasheado automaticamente)
10. **`client_ip_address`** = `{{ed - client_ip_address}}` (se disponível, não hasheado)
11. **`client_user_agent`** = `{{ed - client_user_agent}}` (se disponível, não hasheado)

#### **📍 EVENT METADATA:**

Na tag **FB - Purchase** → **Event Metadata**:

1. **`Event ID`** = `{{ed - event_id}}`
2. **`Event Source URL`** = `{{ed - event_source_url}}`

---

### **PASSO 3: Testar**

1. Enviar evento via ReqBin
2. Verificar no Preview Mode:
   - ✅ Todas as variáveis têm valores?
   - ✅ Tag dispara?
3. Verificar payload enviado ao Meta:
   - ✅ `custom_data` completo (currency, value, order_id, content_name, etc.)
   - ✅ `user_data` completo (external_id, email, phone, etc.)
   - ✅ Status 200 (sem erro)

**Se sim → ✅ SUCESSO!** (Erro resolvido + Qualidade máxima)

---

## 📊 CHECKLIST COMPLETO

### **Variáveis Event Data (21 variáveis):**
- [ ] `ed - ecommerce.currency`
- [ ] `ed - ecommerce.value`
- [ ] `ed - ecommerce.transaction_id`
- [ ] `ed - content_name`
- [ ] `ed - content_type`
- [ ] `ed - content_ids`
- [ ] `ed - contents`
- [ ] `ed - num_items`
- [ ] `ed - user_data.user_id`
- [ ] `ed - user_data.email_address`
- [ ] `ed - user_data.phone_number`
- [ ] `ed - user_data.first_name`
- [ ] `ed - user_data.last_name`
- [ ] `ed - user_data.city`
- [ ] `ed - user_data.region`
- [ ] `ed - user_data.postal_code`
- [ ] `ed - user_data.country`
- [ ] `ed - event_id`
- [ ] `ed - event_source_url`
- [ ] `ed - client_ip_address` (opcional)
- [ ] `ed - client_user_agent` (opcional)

### **Mapeamento na Tag "FB - Purchase":**
- [ ] Custom Data: 8 campos mapeados
- [ ] User Data: 11 campos mapeados
- [ ] Event Metadata: 2 campos mapeados

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para mais detalhes, consulte:
- **`GUIA_CRIAR_VARIAVEIS_EVENT_DATA.md`** - Guia completo de todas as variáveis
- **`GUIA_MAPEAR_TAG_FB_PURCHASE.md`** - Mapeamento completo na tag
- **`VARIAVEIS_PRIORITARIAS_PURCHASE.md`** - Lista de prioridades (se quiser fazer por fases)

---

## 🎯 VANTAGENS DE FAZER TUDO DE UMA VEZ

✅ **Resolve erro imediatamente** (custom_data completo)
✅ **Máxima qualidade do evento** (user_data completo)
✅ **Melhor atribuição** (external_id, PII completo)
✅ **Maior Event Match Quality (EQM)** no Meta
✅ **Evita retrabalho** (não precisa voltar depois)

**Recomendação:** Fazer tudo de uma vez para garantir qualidade máxima desde o início! 🚀

