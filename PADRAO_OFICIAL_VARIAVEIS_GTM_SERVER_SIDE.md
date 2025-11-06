# 📋 PADRÃO OFICIAL: Variáveis Event Data GTM Server-Side

## 🎯 **PADRÃO OFICIAL DO FACEBOOK CONVERSION API**

Baseado na documentação oficial do Facebook, o formato padrão é:

```json
{
  "event_name": "ViewContent",
  "user_data": {
    "email_address": "user@example.com",
    "phone_number": "+5511999999999",
    "first_name": "John",
    "last_name": "Doe",
    "city": "São Paulo",
    "region": "SP",
    "postal_code": "01310-100",
    "country": "BR"
  },
  "custom_data": {
    "value": 39.9,
    "currency": "BRL",
    "content_ids": ["hacr962"],
    "content_name": "Sistema 4 Fases - Ebook Trips",
    "content_type": "product",
    "contents": [{"id": "hacr962", "quantity": 1, "item_price": 39.9}],
    "num_items": 1
  }
}
```

---

## ✅ **PADRÃO CORRETO PARA GTM SERVER-SIDE**

### **O GTM Server-Side espera:**

**Formato do DataLayer (enviado pelo código):**
```javascript
{
  event: 'view_item',
  // ✅ PADRÃO OFICIAL: Dentro de user_data
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
  // ✅ PADRÃO OFICIAL: Dentro de ecommerce
  ecommerce: {
    value: 39.9,
    currency: 'BRL',
    items: [...]
  },
  // ✅ PADRÃO OFICIAL: No nível raiz (para custom_data)
  content_ids: ['hacr962'],
  content_name: 'Sistema 4 Fases - Ebook Trips',
  content_type: 'product',
  contents: [...],
  num_items: 1,
  // ✅ TAMBÉM no nível raiz (facilita acesso direto)
  value: 39.9,
  currency: 'BRL',
  email_address: 'user@example.com',  // Alternativa para acesso direto
  first_name: 'John'  // Alternativa para acesso direto
}
```

---

## 📋 **VARIÁVEIS EVENT DATA - PADRÃO OFICIAL**

### **✅ FORMATO CORRETO (Seguindo Padrão Oficial):**

#### **1. User Data (Padrão Oficial: `user_data.*`)**

| # | Nome da Variável | Path (PADRÃO OFICIAL) | Tipo | Usar em |
|---|------------------|----------------------|------|---------|
| 1 | `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto | Todos |
| 2 | `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto | Todos |
| 3 | `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto | Todos |
| 4 | `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto | Todos |
| 5 | `{{ed - user_data.city}}` | `user_data.city` | Texto | Todos |
| 6 | `{{ed - user_data.region}}` | `user_data.region` | Texto | Todos |
| 7 | `{{ed - user_data.postal_code}}` | `user_data.postal_code` | Texto | Todos |
| 8 | `{{ed - user_data.country}}` | `user_data.country` | Texto | Todos |
| 9 | `{{ed - user_data.user_id}}` | `user_data.user_id` | Texto | Todos |

#### **2. Ecommerce Data (Padrão Oficial: `ecommerce.*`)**

| # | Nome da Variável | Path (PADRÃO OFICIAL) | Tipo | Usar em |
|---|------------------|----------------------|------|---------|
| 10 | `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | ViewContent, AddToCart, BeginCheckout |
| 11 | `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | ViewContent, AddToCart, BeginCheckout |
| 12 | `{{ed - ecommerce.transaction_id}}` | `ecommerce.transaction_id` | Texto | Purchase |

#### **3. Custom Data (Padrão Oficial: Nível Raiz)**

| # | Nome da Variável | Path (PADRÃO OFICIAL) | Tipo | Usar em |
|---|------------------|----------------------|------|---------|
| 13 | `{{ed - content_ids}}` | `content_ids` | Array | ViewContent, AddToCart, BeginCheckout, Lead |
| 14 | `{{ed - content_name}}` | `content_name` | Texto | ViewContent, AddToCart, BeginCheckout ⚠️ **CRÍTICO** |
| 15 | `{{ed - content_type}}` | `content_type` | Texto | ViewContent, AddToCart, BeginCheckout ⚠️ **CRÍTICO** |
| 16 | `{{ed - contents}}` | `contents` | Array | ViewContent, AddToCart, BeginCheckout, Lead |
| 17 | `{{ed - num_items}}` | `num_items` | Número | AddToCart, BeginCheckout |

#### **4. Alternativas (Nível Raiz - Para Acesso Direto)**

| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 18 | `{{ed - value}}` | `value` | Número | ViewContent, AddToCart, BeginCheckout |
| 19 | `{{ed - currency}}` | `currency` | Texto | ViewContent, AddToCart, BeginCheckout |
| 20 | `{{ed - email_address}}` | `email_address` | Texto | Todos (alternativa) |
| 21 | `{{ed - phone_number}}` | `phone_number` | Texto | Todos (alternativa) |
| 22 | `{{ed - first_name}}` | `first_name` | Texto | Todos (alternativa) |
| 23 | `{{ed - last_name}}` | `last_name` | Texto | Todos (alternativa) |
| 24 | `{{ed - city}}` | `city` | Texto | Todos (alternativa) |
| 25 | `{{ed - region}}` | `region` | Texto | Todos (alternativa) |
| 26 | `{{ed - postal_code}}` | `postal_code` | Texto | Todos (alternativa) |
| 27 | `{{ed - country}}` | `country` | Texto | Todos (alternativa) |
| 28 | `{{ed - event_id}}` | `event_id` | Texto | Todos |

---

## 🚨 **VARIÁVEIS CRÍTICAS (Resolvem Problemas Atuais)**

### **Para ViewContent/BeginCheckout:**
- [ ] `{{ed - content_name}}` → Path: `content_name` ⚠️ **CRÍTICO**
- [ ] `{{ed - content_type}}` → Path: `content_type` ⚠️ **CRÍTICO`

### **Para GenerateLead:**
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value` (opcional - só se value for fornecido)
- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency` (opcional - só se value for fornecido)

### **Para PageView:**
- [ ] `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `user_data.first_name`
- [ ] `{{ed - user_data.last_name}}` → Path: `user_data.last_name`
- [ ] `{{ed - user_data.city}}` → Path: `user_data.city`
- [ ] `{{ed - user_data.region}}` → Path: `user_data.region`
- [ ] `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code`
- [ ] `{{ed - user_data.country}}` → Path: `user_data.country`

---

## 📋 **COMO CRIAR NO GTM SERVER-SIDE**

### **Exemplo 1: Criar `{{ed - user_data.email_address}}` (PADRÃO OFICIAL)**

```
Nome da variável: ed - user_data.email_address
Tipo de variável: Event Data
Nome do campo de evento: user_data.email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

### **Exemplo 2: Criar `{{ed - content_name}}` (PADRÃO OFICIAL)**

```
Nome da variável: ed - content_name
Tipo de variável: Event Data
Nome do campo de evento: content_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

### **Exemplo 3: Criar `{{ed - ecommerce.value}}` (PADRÃO OFICIAL)**

```
Nome da variável: ed - ecommerce.value
Tipo de variável: Event Data
Nome do campo de evento: ecommerce.value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

---

## 🎯 **MAPEAMENTO NAS TAGS FACEBOOK**

### **Tag "FB - ViewContent"**

**User Data (Padrão Oficial):**
- `email_address` → `{{ed - user_data.email_address}}` (Path: `user_data.email_address`)
- `phone_number` → `{{ed - user_data.phone_number}}` (Path: `user_data.phone_number`)
- `first_name` → `{{ed - user_data.first_name}}` (Path: `user_data.first_name`)
- `last_name` → `{{ed - user_data.last_name}}` (Path: `user_data.last_name`)
- `city` → `{{ed - user_data.city}}` (Path: `user_data.city`)
- `region` → `{{ed - user_data.region}}` (Path: `user_data.region`)
- `postal_code` → `{{ed - user_data.postal_code}}` (Path: `user_data.postal_code`)
- `country` → `{{ed - user_data.country}}` (Path: `user_data.country`)

**Custom Data (Padrão Oficial):**
- `value` → `{{ed - ecommerce.value}}` (Path: `ecommerce.value`) OU `{{ed - value}}` (Path: `value`)
- `currency` → `{{ed - ecommerce.currency}}` (Path: `ecommerce.currency`) OU `{{ed - currency}}` (Path: `currency`)
- `content_ids` → `{{ed - content_ids}}` (Path: `content_ids`)
- `content_name` → `{{ed - content_name}}` (Path: `content_name`) ⚠️ **CRÍTICO**
- `content_type` → `{{ed - content_type}}` (Path: `content_type`) ⚠️ **CRÍTICO**
- `contents` → `{{ed - contents}}` (Path: `contents`)
- `num_items` → `{{ed - num_items}}` (Path: `num_items`)

---

## ✅ **CHECKLIST COMPLETO**

### **Fase 1: Variáveis Críticas (Resolvem Problemas Imediatos)**
- [ ] `{{ed - content_name}}` → Path: `content_name`
- [ ] `{{ed - content_type}}` → Path: `content_type`
- [ ] `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `user_data.first_name`
- [ ] `{{ed - user_data.last_name}}` → Path: `user_data.last_name`
- [ ] `{{ed - user_data.city}}` → Path: `user_data.city`
- [ ] `{{ed - user_data.region}}` → Path: `user_data.region`
- [ ] `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code`
- [ ] `{{ed - user_data.country}}` → Path: `user_data.country`

### **Fase 2: Variáveis Ecommerce (ViewContent, AddToCart, BeginCheckout)**
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value`
- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency`
- [ ] `{{ed - content_ids}}` → Path: `content_ids`
- [ ] `{{ed - contents}}` → Path: `contents`
- [ ] `{{ed - num_items}}` → Path: `num_items`

### **Fase 3: Variáveis Alternativas (Nível Raiz - Para Acesso Direto)**
- [ ] `{{ed - value}}` → Path: `value`
- [ ] `{{ed - currency}}` → Path: `currency`
- [ ] `{{ed - email_address}}` → Path: `email_address`
- [ ] `{{ed - phone_number}}` → Path: `phone_number`
- [ ] `{{ed - first_name}}` → Path: `first_name`
- [ ] `{{ed - last_name}}` → Path: `last_name`
- [ ] `{{ed - city}}` → Path: `city`
- [ ] `{{ed - region}}` → Path: `region`
- [ ] `{{ed - postal_code}}` → Path: `postal_code`
- [ ] `{{ed - country}}` → Path: `country`
- [ ] `{{ed - event_id}}` → Path: `event_id`

---

## 🎯 **RESUMO**

**Padrão Oficial:**
- ✅ **User Data:** `user_data.email_address` (dentro de `user_data`)
- ✅ **Ecommerce Data:** `ecommerce.value` (dentro de `ecommerce`)
- ✅ **Custom Data:** `content_name` (nível raiz)

**Total de variáveis a criar:** 28 variáveis

**Prioridade:**
1. **CRÍTICO:** `content_name`, `content_type` (resolvem ViewContent/BeginCheckout)
2. **ALTO:** Variáveis `user_data.*` (resolvem PageView)
3. **MÉDIO:** Variáveis `ecommerce.*` (completam ViewContent/AddToCart/BeginCheckout)
4. **BAIXO:** Variáveis nível raiz (alternativas para acesso direto)

**⚠️ IMPORTANTE:**
- **NÃO usar prefixo `0.`** (isso é só para Purchase via webhook)
- Usar **exatamente** os paths listados acima
- Seguir o padrão oficial do Facebook Conversion API

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ PADRÃO OFICIAL CONFIRMADO - PRONTO PARA CRIAR VARIÁVEIS

