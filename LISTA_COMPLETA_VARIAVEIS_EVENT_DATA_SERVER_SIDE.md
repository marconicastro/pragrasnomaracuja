# 📋 LISTA COMPLETA: Variáveis Event Data para GTM Server-Side

## 🎯 **OBJETIVO**

Criar **TODAS** as variáveis Event Data no GTM Server-Side usando **EXATAMENTE** os mesmos paths que o código envia.

**⚠️ IMPORTANTE:** 
- **NÃO usar prefixo `0.`** (isso é só para Purchase via webhook)
- Usar **exatamente** o mesmo path que está no código
- Se no código é `content_name`, o path é `content_name`

---

## ✅ **VARIÁVEIS COMUNS (Todos os Eventos)**

### **User Data - Nível Raiz:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 1 | `{{ed - email_address}}` | `email_address` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 2 | `{{ed - phone_number}}` | `phone_number` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 3 | `{{ed - first_name}}` | `first_name` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 4 | `{{ed - last_name}}` | `last_name` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 5 | `{{ed - city}}` | `city` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 6 | `{{ed - region}}` | `region` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 7 | `{{ed - postal_code}}` | `postal_code` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 8 | `{{ed - country}}` | `country` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |

### **User Data - Dentro de user_data:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 9 | `{{ed - user_data.email_address}}` | `user_data.email_address` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 10 | `{{ed - user_data.phone_number}}` | `user_data.phone_number` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 11 | `{{ed - user_data.first_name}}` | `user_data.first_name` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 12 | `{{ed - user_data.last_name}}` | `user_data.last_name` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 13 | `{{ed - user_data.city}}` | `user_data.city` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 14 | `{{ed - user_data.region}}` | `user_data.region` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 15 | `{{ed - user_data.postal_code}}` | `user_data.postal_code` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 16 | `{{ed - user_data.country}}` | `user_data.country` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |
| 17 | `{{ed - user_data.user_id}}` | `user_data.user_id` | Texto | PageView, ViewContent, AddToCart, BeginCheckout, Lead |

### **Metadata:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 18 | `{{ed - event_id}}` | `event_id` | Texto | Todos os eventos |

---

## ✅ **VARIÁVEIS ECOMMERCE (ViewContent, AddToCart, BeginCheckout)**

### **Ecommerce - Nível Raiz:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 19 | `{{ed - value}}` | `value` | Número | ViewContent, AddToCart, BeginCheckout |
| 20 | `{{ed - currency}}` | `currency` | Texto | ViewContent, AddToCart, BeginCheckout |

### **Ecommerce - Dentro de ecommerce:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 21 | `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | ViewContent, AddToCart, BeginCheckout |
| 22 | `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | ViewContent, AddToCart, BeginCheckout |

### **Content Data:**
| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 23 | `{{ed - content_ids}}` | `content_ids` | Array | ViewContent, AddToCart, BeginCheckout, Lead |
| 24 | `{{ed - content_name}}` | `content_name` | Texto | ViewContent, AddToCart, BeginCheckout ⚠️ **CRÍTICO** |
| 25 | `{{ed - content_type}}` | `content_type` | Texto | ViewContent, AddToCart, BeginCheckout ⚠️ **CRÍTICO** |
| 26 | `{{ed - contents}}` | `contents` | Array | ViewContent, AddToCart, BeginCheckout, Lead |
| 27 | `{{ed - num_items}}` | `num_items` | Número | AddToCart, BeginCheckout |

---

## ✅ **VARIÁVEIS ECOMMERCE (GenerateLead - Opcional)**

**⚠️ IMPORTANTE:** Essas variáveis só existem se `value` for fornecido no `pushGenerateLead()`.

| # | Nome da Variável | Path | Tipo | Usar em |
|---|------------------|------|------|---------|
| 28 | `{{ed - ecommerce.value}}` | `ecommerce.value` | Número | Lead (opcional) |
| 29 | `{{ed - ecommerce.currency}}` | `ecommerce.currency` | Texto | Lead (opcional) |

---

## 📋 **COMO CRIAR NO GTM SERVER-SIDE**

### **Passo 1: Ir em Variáveis → Nova**

### **Passo 2: Configurar cada variável:**

**Exemplo: Criar `{{ed - content_name}}`**

```
Nome da variável: ed - content_name
Tipo de variável: Event Data
Nome do campo de evento: content_name
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Exemplo: Criar `{{ed - content_type}}`**

```
Nome da variável: ed - content_type
Tipo de variável: Event Data
Nome do campo de evento: content_type
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**Exemplo: Criar `{{ed - value}}`**

```
Nome da variável: ed - value
Tipo de variável: Event Data
Nome do campo de evento: value
Tipo de valor: Número
Valor padrão: (deixar vazio)
```

**Exemplo: Criar `{{ed - content_ids}}`**

```
Nome da variável: ed - content_ids
Tipo de variável: Event Data
Nome do campo de evento: content_ids
Tipo de valor: Array
Valor padrão: (deixar vazio)
```

---

## 🚨 **VARIÁVEIS CRÍTICAS (Resolvem Problemas Atuais)**

### **Para ViewContent/BeginCheckout:**
- [ ] `{{ed - content_name}}` → Path: `content_name` ⚠️ **CRÍTICO**
- [ ] `{{ed - content_type}}` → Path: `content_type` ⚠️ **CRÍTICO**

### **Para GenerateLead:**
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value` (opcional - só se value for fornecido)
- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency` (opcional - só se value for fornecido)

### **Para PageView:**
- [ ] Criar **TODAS** as variáveis da seção "VARIÁVEIS COMUNS" acima

---

## ✅ **CHECKLIST COMPLETO**

### **Fase 1: Variáveis Críticas (Resolvem Problemas Imediatos)**
- [ ] `{{ed - content_name}}` → Path: `content_name`
- [ ] `{{ed - content_type}}` → Path: `content_type`
- [ ] `{{ed - email_address}}` → Path: `email_address`
- [ ] `{{ed - phone_number}}` → Path: `phone_number`
- [ ] `{{ed - first_name}}` → Path: `first_name`
- [ ] `{{ed - last_name}}` → Path: `last_name`
- [ ] `{{ed - city}}` → Path: `city`
- [ ] `{{ed - region}}` → Path: `region`
- [ ] `{{ed - postal_code}}` → Path: `postal_code`
- [ ] `{{ed - country}}` → Path: `country`
- [ ] `{{ed - event_id}}` → Path: `event_id`

### **Fase 2: Variáveis Ecommerce (ViewContent, AddToCart, BeginCheckout)**
- [ ] `{{ed - value}}` → Path: `value`
- [ ] `{{ed - currency}}` → Path: `currency`
- [ ] `{{ed - ecommerce.value}}` → Path: `ecommerce.value`
- [ ] `{{ed - ecommerce.currency}}` → Path: `ecommerce.currency`
- [ ] `{{ed - content_ids}}` → Path: `content_ids`
- [ ] `{{ed - contents}}` → Path: `contents`
- [ ] `{{ed - num_items}}` → Path: `num_items`

### **Fase 3: Variáveis User Data (Dentro de user_data)**
- [ ] `{{ed - user_data.email_address}}` → Path: `user_data.email_address`
- [ ] `{{ed - user_data.phone_number}}` → Path: `user_data.phone_number`
- [ ] `{{ed - user_data.first_name}}` → Path: `user_data.first_name`
- [ ] `{{ed - user_data.last_name}}` → Path: `user_data.last_name`
- [ ] `{{ed - user_data.city}}` → Path: `user_data.city`
- [ ] `{{ed - user_data.region}}` → Path: `user_data.region`
- [ ] `{{ed - user_data.postal_code}}` → Path: `user_data.postal_code`
- [ ] `{{ed - user_data.country}}` → Path: `user_data.country`
- [ ] `{{ed - user_data.user_id}}` → Path: `user_data.user_id`

---

## 🎯 **RESUMO**

**Total de variáveis a criar:** 29 variáveis

**Prioridade:**
1. **CRÍTICO:** `content_name`, `content_type` (resolvem ViewContent/BeginCheckout)
2. **ALTO:** Variáveis comuns (resolvem PageView)
3. **MÉDIO:** Variáveis ecommerce (completam ViewContent/AddToCart/BeginCheckout)
4. **BAIXO:** Variáveis dentro de user_data (backup/compatibilidade)

**Padrão:**
- **NÃO usar prefixo `0.`** (isso é só para Purchase via webhook)
- Usar **exatamente** o mesmo path que está no código
- Se no código é `content_name`, o path é `content_name`

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ LISTA COMPLETA - PRONTO PARA CRIAR

