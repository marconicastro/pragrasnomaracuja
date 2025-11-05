# ✅ CONFIRMAÇÃO: Variáveis para Eventos GTM Web (Server-Side)

## 🎯 **FORMATO CORRETO**

**Eventos via GTM Web (DataLayer) → Objeto direto → SEM prefixo `0.`**

---

## 📋 **VARIÁVEIS PARA EVENTOS GTM WEB**

### **✅ FORMATO CORRETO:**

| Variável | Path | Usar em |
|----------|------|---------|
| `{{ed - email_address}}` | `email_address` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - phone_number}}` | `phone_number` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - first_name}}` | `first_name` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - last_name}}` | `last_name` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - city}}` | `city` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - region}}` | `region` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - postal_code}}` | `postal_code` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - country}}` | `country` | Lead, InitiateCheckout, PageView, ViewContent, AddToCart |
| `{{ed - value}}` | `value` | ViewContent, AddToCart, InitiateCheckout |
| `{{ed - currency}}` | `currency` | ViewContent, AddToCart, InitiateCheckout |
| `{{ed - content_ids}}` | `content_ids` | ViewContent, AddToCart, InitiateCheckout, Lead |
| `{{ed - content_name}}` | `content_name` | ViewContent, AddToCart, InitiateCheckout |
| `{{ed - content_type}}` | `content_type` | ViewContent, AddToCart, InitiateCheckout |
| `{{ed - num_items}}` | `num_items` | ViewContent, AddToCart, InitiateCheckout |
| `{{ed - contents}}` | `contents` | ViewContent, AddToCart, InitiateCheckout, Lead |
| `{{ed - event_id}}` | `event_id` | Todos os eventos |

---

## ✅ **AJUSTES APLICADOS NO CÓDIGO**

### **1. Campos no Nível Raiz**

Todos os eventos agora enviam campos também no nível raiz:
- ✅ `email_address`, `phone_number`, `first_name`, `last_name` no nível raiz
- ✅ `city`, `region`, `postal_code`, `country` no nível raiz
- ✅ `value`, `currency` no nível raiz (para eventos ecommerce)
- ✅ Campos também dentro de `user_data` e `ecommerce` (compatibilidade)

### **2. Event ID Adicionado**

Todos os eventos agora incluem `event_id`:
- ✅ Gerado automaticamente via `generateEventId()`
- ✅ Incluído no nível raiz do evento
- ✅ Acessível via `{{ed - event_id}}`

---

## 📊 **EXEMPLO DE FORMATO**

### **Evento: generate_lead**

```javascript
{
  event: 'generate_lead',
  // ✅ Campos no nível raiz
  email_address: 'joao.silva@email.com',
  phone_number: '11999999999',
  first_name: 'João',
  last_name: 'Silva',
  city: 'caculé',
  region: 'ba',
  postal_code: '46300',
  country: 'BR',
  event_id: 'Lead_1762265997000_abc123',
  // ✅ Campos também dentro de user_data (compatibilidade)
  user_data: {
    email_address: 'joao.silva@email.com',
    phone_number: '11999999999',
    first_name: 'João',
    last_name: 'Silva',
    city: 'caculé',
    region: 'ba',
    postal_code: '46300',
    country: 'BR'
  }
}
```

**Variáveis funcionam:**
- ✅ `{{ed - email_address}}` → `'joao.silva@email.com'`
- ✅ `{{ed - first_name}}` → `'João'`
- ✅ `{{ed - city}}` → `'caculé'`
- ✅ `{{ed - event_id}}` → `'Lead_1762265997000_abc123'`

---

## ✅ **CONFIRMAÇÃO FINAL**

**SIM, o padrão de variáveis está correto!**

- ✅ **Eventos GTM Web** → Variáveis SEM prefixo `0.` (ex: `{{ed - email_address}}`)
- ✅ **Purchase via Webhook** → Variáveis COM prefixo `0.` (ex: `{{ed - purchase.email_address}}`)

**O código foi ajustado para enviar campos no nível raiz, facilitando o acesso direto no GTM Server-Side!**

---

**Última atualização**: 2025-01-05
**Versão**: 1.0
**Status**: ✅ CONFIRMADO E AJUSTADO

