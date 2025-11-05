# ✅ Correção Revertida: Payload como Array

## 🔄 **MUDANÇA APLICADA**

**Problema:** Evento Purchase não estava disparando após enviar objeto direto.

**Solução:** Revertido para enviar como array `[eventData]` (formato esperado pelo GTM Server-Side).

---

## 📝 **Mudança no Código**

### **Arquivo:** `src/lib/offlineConversions.ts`

**Antes (objeto direto - não funcionava):**
```typescript
const payload = eventData;  // Objeto direto
```

**Depois (array - formato correto):**
```typescript
const payload = [eventData];  // Array de eventos
```

---

## ⚠️ **IMPORTANTE: Ajustar Variáveis Event Data**

Como o GTM Server-Side processa arrays colocando dados em `0: {...}`, as variáveis Event Data precisam usar paths com prefixo `0.`:

### **Paths Corretos (COM `0.`):**

| Variável | Path CORRETO |
|----------|-------------|
| `{{ed - ecommerce.currency}}` | `0.ecommerce.currency` |
| `{{ed - ecommerce.value}}` | `0.ecommerce.value` |
| `{{ed - content_ids}}` | `0.content_ids` |
| `{{ed - content_name}}` | `0.content_name` |
| `{{ed - content_type}}` | `0.content_type` |
| `{{ed - user_data.email_address}}` | `0.user_data.email_address` |
| `{{ed - user_data.phone_number}}` | `0.user_data.phone_number` |
| `{{ed - user_data.first_name}}` | `0.user_data.first_name` |
| `{{ed - user_data.user_id}}` | `0.user_data.user_id` |
| `{{ed - event}}` | `0.event` |
| `{{ed - event_id}}` | `0.event_id` |

---

## 🔍 **Como Verificar**

No Preview Mode, verifique se os dados aparecem assim:

```
Dados do evento:
Nome          Valor
0             { event: "purchase", ecommerce: {...}, user_data: {...} }
```

**Se SIM**, use paths com `0.` (ex: `0.ecommerce.currency`)

**Se NÃO** (dados direto no nível raiz), use paths sem `0.` (ex: `ecommerce.currency`)

---

## ✅ **Checklist**

- [x] Código revertido para enviar como array `[eventData]`
- [ ] Verificar no Preview Mode se dados estão em `0: {...}`
- [ ] Ajustar variáveis Event Data para usar paths com `0.` se necessário
- [ ] Testar evento Purchase disparando corretamente
- [ ] Testar variáveis retornando valores (não undefined)

---

**Última atualização**: 2025-01-05
**Versão**: 1.0


