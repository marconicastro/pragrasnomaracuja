# ✅ RESUMO RÁPIDO: Todos os Paths Devem Começar com `0.`

## 🎯 **REGRA SIMPLES**

**Todos os paths das variáveis Event Data devem começar com `0.`!**

Isso inclui:
- ✅ Variáveis de `custom_data` (ecommerce, content_ids, etc)
- ✅ Variáveis de `user_data` (email_address, phone_number, etc)
- ✅ Variáveis de metadata (event, event_id, etc)

---

## 📋 **LISTA COMPLETA - Paths com `0.`**

### **Custom Data (7 variáveis):**

| Variável | Path CORRETO |
|----------|--------------|
| `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` |
| `{{ed - ecommerce.value}}` | `0.ecommerce.value` |
| `{{ed - content_ids}}` | `0.content_ids` |
| `{{ed - content_name}}` | `0.content_name` |
| `{{ed - content_type}}` | `0.content_type` |
| `{{ed - num_items}}` | `0.num_items` |
| `{{ed - ecommerce.transaction_id}}` | `0.ecommerce.transaction_id` |

### **User Data (9 variáveis):**

| Variável | Path CORRETO |
|----------|--------------|
| `{{ed - user_data.email_address}}` | `0.user_data.email_address` |
| `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` |
| `{{ed - user_data.first_name}}` | `0.user_data.first_name` |
| `{{ed - user_data.last_name}}` | `0.user_data.last_name` |
| `{{ed - user_data.user_id}}` | `0.user_data.user_id` |
| `{{ed - user_data.city}}` | `0.user_data.city` |
| `{{ed - user_data.region}}` | `0.user_data.region` |
| `{{ed - user_data.postal_code}}` | `0.user_data.postal_code` |
| `{{ed - user_data.country}}` | `0.user_data.country` |

### **Metadata (3 variáveis):**

| Variável | Path CORRETO |
|----------|--------------|
| `{{ed - event}}` | `0.event` |
| `{{ed - event_id}}` | `0.event_id` |
| `{{ed - event_source_url}}` | `0.event_source_url` |

---

## ✅ **Checklist Rápido**

- [ ] Todas as variáveis custom_data criadas com `0.` no path ✅
- [ ] Todas as variáveis user_data criadas com `0.` no path ⚠️ **FAZER AGORA**
- [ ] Todas mapeadas na tag "FB - Purchase"
- [ ] Testar no Preview Mode
- [ ] Verificar se nenhuma retorna `undefined`

---

## 🚨 **LEMBRE-SE**

**SEMPRE começar o path com `0.` para TODAS as variáveis!**

- ❌ `ecommerce.currency` (sem `0.`)
- ✅ `0.ecommerce.currency` (com `0.`)

- ❌ `user_data.email_address` (sem `0.`)
- ✅ `0.user_data.email_address` (com `0.`)

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


