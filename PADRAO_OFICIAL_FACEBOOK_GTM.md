# 📋 PADRÃO OFICIAL: Facebook Conversion API + GTM Server-Side

## 🎯 **PADRÃO OFICIAL DO FACEBOOK CONVERSION API**

Baseado na documentação oficial do Facebook, o formato padrão é:

### **Estrutura Padrão:**
```json
{
  "event_name": "ViewContent",
  "event_time": 1234567890,
  "event_id": "unique_event_id",
  "user_data": {
    "email_address": "user@example.com",
    "phone_number": "+5511999999999",
    "first_name": "John",
    "last_name": "Doe",
    "city": "São Paulo",
    "region": "SP",
    "postal_code": "01310-100",
    "country": "BR",
    "external_id": "user_id_123"
  },
  "custom_data": {
    "value": 39.9,
    "currency": "BRL",
    "content_ids": ["hacr962"],
    "content_name": "Sistema 4 Fases - Ebook Trips",
    "content_type": "product",
    "contents": [{
      "id": "hacr962",
      "quantity": 1,
      "item_price": 39.9
    }],
    "num_items": 1
  }
}
```

---

## ✅ **PADRÃO CORRETO PARA GTM SERVER-SIDE**

### **DataLayer deve enviar:**
```javascript
{
  event: 'view_item',
  user_data: {
    email_address: 'user@example.com',
    phone_number: '+5511999999999',
    first_name: 'John',
    last_name: 'Doe',
    city: 'São Paulo',
    region: 'SP',
    postal_code: '01310-100',
    country: 'BR',
    user_id: 'user_id_123'
  },
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  content_ids: ['hacr962'],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  contents: [...],
  num_items: 1,
  value: 39.9,  // ✅ Também no nível raiz para facilitar acesso
  currency: 'BRL'  // ✅ Também no nível raiz para facilitar acesso
}
```

---

## 📋 **VARIÁVEIS EVENT DATA - PADRÃO OFICIAL**

### **User Data:**
| Variável | Path | Padrão |
|----------|------|--------|
| `{{ed - user_data.email_address}}` | `user_data.email_address` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.phone_number}}` | `user_data.phone_number` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.first_name}}` | `user_data.first_name` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.last_name}}` | `user_data.last_name` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.city}}` | `user_data.city` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.region}}` | `user_data.region` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.postal_code}}` | `user_data.postal_code` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.country}}` | `user_data.country` | ✅ **PADRÃO OFICIAL** |
| `{{ed - user_data.user_id}}` | `user_data.user_id` | ✅ **PADRÃO OFICIAL** |

### **Ecommerce/Custom Data:**
| Variável | Path | Padrão |
|----------|------|--------|
| `{{ed - ecommerce.value}}` | `ecommerce.value` | ✅ **PADRÃO OFICIAL** |
| `{{ed - ecommerce.currency}}` | `ecommerce.currency` | ✅ **PADRÃO OFICIAL** |
| `{{ed - content_ids}}` | `content_ids` | ✅ **PADRÃO OFICIAL** |
| `{{ed - content_name}}` | `content_name` | ✅ **PADRÃO OFICIAL** |
| `{{ed - content_type}}` | `content_type` | ✅ **PADRÃO OFICIAL** |
| `{{ed - contents}}` | `contents` | ✅ **PADRÃO OFICIAL** |
| `{{ed - num_items}}` | `num_items` | ✅ **PADRÃO OFICIAL** |

### **Alternativas (nível raiz - para facilitar acesso):**
| Variável | Path | Uso |
|----------|------|-----|
| `{{ed - value}}` | `value` | Alternativa a `ecommerce.value` |
| `{{ed - currency}}` | `currency` | Alternativa a `ecommerce.currency` |

---

## 🚨 **PROBLEMA IDENTIFICADO NO CÓDIGO**

O código atual está enviando campos **DUPLICADOS**:
- ✅ No nível raiz: `email_address`, `content_name`, etc.
- ✅ Dentro de `user_data`: `user_data.email_address`, etc.

**Isso está correto para facilitar acesso, MAS:**

### **O padrão oficial do Facebook é:**
- `user_data.email_address` (dentro de user_data)
- `custom_data.content_name` (dentro de custom_data)

### **O GTM Server-Side espera:**
- Variáveis Event Data devem usar paths do padrão oficial
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- `{{ed - content_name}}` → Path: `content_name`

---

## ✅ **SOLUÇÃO: MANTER AMBOS (Compatibilidade)**

**Manter:**
1. ✅ Campos dentro de `user_data` (padrão oficial)
2. ✅ Campos dentro de `ecommerce` (padrão oficial)
3. ✅ Campos no nível raiz (facilita acesso direto)

**Variáveis Event Data devem usar:**
- **PADRÃO OFICIAL:** `user_data.email_address`, `ecommerce.value`
- **ALTERNATIVA:** `email_address`, `value` (se disponível no nível raiz)

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ PADRÃO OFICIAL CONFIRMADO

