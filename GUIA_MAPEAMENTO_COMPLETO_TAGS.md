# 📋 GUIA COMPLETO: Mapeamento de Variáveis nas Tags

## ✅ **VARIÁVEIS JÁ CRIADAS**

Você já criou todas as variáveis necessárias! Agora só precisa mapear nas tags.

---

## 🎯 **MAPEAMENTO POR TAG**

### **1. FB - ViewContent**

#### **Custom Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `currency` | `{{ed - currency}}` | `currency` (nível raiz) ✅ |
| `value` | `{{ed - value}}` | `value` (nível raiz) ✅ |
| `content_ids` | `{{ed - content_ids}}` | `content_ids` ✅ |
| `contents` | `{{ed - contents}}` | `contents` ✅ |
| `content_name` | `{{ed - content_name}}` | `content_name` ⚠️ (pode não chegar) |
| `content_type` | `{{ed - content_type}}` | `content_type` ⚠️ (pode não chegar) |
| `num_items` | `{{ed - num_items}}` | `num_items` ✅ |

#### **User Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Email` | `{{ed - email_address}}` | `email_address` (nível raiz) ✅ |
| `Phone` | `{{ed - phone_number}}` | `phone_number` (nível raiz) ✅ |
| `First Name` | `{{ed - first_name}}` | `first_name` (nível raiz) ✅ |
| `Last Name` | `{{ed - last_name}}` | `last_name` (nível raiz) ✅ |
| `City` | `{{ed - city}}` | `city` (nível raiz) ✅ |
| `State` | `{{ed - region}}` | `region` (nível raiz) ✅ |
| `Country` | `{{ed - country}}` | `country` (nível raiz) ✅ |
| `Zip` | `{{ed - postal_code}}` | `postal_code` (nível raiz) ✅ |
| `External ID` | `{{ed - user_id}}` | `user_id` (nível raiz) ✅ |

#### **Event ID:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Event ID` | `{{ed - event_id}}` | `event_id` ✅ |

---

### **2. FB - AddToCart**

#### **Custom Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `currency` | `{{ed - currency}}` | `currency` (nível raiz) ✅ |
| `value` | `{{ed - value}}` | `value` (nível raiz) ✅ |
| `content_ids` | `{{ed - content_ids}}` | `content_ids` ✅ |
| `contents` | `{{ed - contents}}` | `contents` ✅ |
| `content_name` | `{{ed - content_name}}` | `content_name` ⚠️ (pode não chegar) |
| `content_type` | `{{ed - content_type}}` | `content_type` ⚠️ (pode não chegar) |
| `num_items` | `{{ed - num_items}}` | `num_items` ✅ |

#### **User Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Email` | `{{ed - email_address}}` | `email_address` (nível raiz) ✅ |
| `Phone` | `{{ed - phone_number}}` | `phone_number` (nível raiz) ✅ |
| `First Name` | `{{ed - first_name}}` | `first_name` (nível raiz) ✅ |
| `Last Name` | `{{ed - last_name}}` | `last_name` (nível raiz) ✅ |
| `City` | `{{ed - city}}` | `city` (nível raiz) ✅ |
| `State` | `{{ed - region}}` | `region` (nível raiz) ✅ |
| `Country` | `{{ed - country}}` | `country` (nível raiz) ✅ |
| `Zip` | `{{ed - postal_code}}` | `postal_code` (nível raiz) ✅ |
| `External ID` | `{{ed - user_id}}` | `user_id` (nível raiz) ✅ |

#### **Event ID:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Event ID` | `{{ed - event_id}}` | `event_id` ✅ |

---

### **3. FB - InitiateCheckout**

#### **Custom Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `currency` | `{{ed - currency}}` | `currency` (nível raiz) ✅ |
| `value` | `{{ed - value}}` | `value` (nível raiz) ✅ |
| `content_ids` | `{{ed - content_ids}}` | `content_ids` ✅ |
| `contents` | `{{ed - contents}}` | `contents` ✅ |
| `content_name` | `{{ed - content_name}}` | `content_name` ⚠️ (pode não chegar) |
| `content_type` | `{{ed - content_type}}` | `content_type` ⚠️ (pode não chegar) |
| `num_items` | `{{ed - num_items}}` | `num_items` ✅ |

#### **User Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Email` | `{{ed - email_address}}` | `email_address` (nível raiz) ✅ |
| `Phone` | `{{ed - phone_number}}` | `phone_number` (nível raiz) ✅ |
| `First Name` | `{{ed - first_name}}` | `first_name` (nível raiz) ✅ |
| `Last Name` | `{{ed - last_name}}` | `last_name` (nível raiz) ✅ |
| `City` | `{{ed - city}}` | `city` (nível raiz) ✅ |
| `State` | `{{ed - region}}` | `region` (nível raiz) ✅ |
| `Country` | `{{ed - country}}` | `country` (nível raiz) ✅ |
| `Zip` | `{{ed - postal_code}}` | `postal_code` (nível raiz) ✅ |
| `External ID` | `{{ed - user_id}}` | `user_id` (nível raiz) ✅ |

#### **Event ID:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Event ID` | `{{ed - event_id}}` | `event_id` ✅ |

---

### **4. FB - PageView**

#### **Custom Data:**
PageView geralmente não precisa de Custom Data (não tem `contents` com `item_price`).

Se precisar:
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `content_ids` | `{{ed - content_ids}}` | `content_ids` ✅ |
| `content_name` | `{{ed - content_name}}` | `content_name` ⚠️ |
| `content_type` | `{{ed - content_type}}` | `content_type` ⚠️ |

#### **User Data:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Email` | `{{ed - email_address}}` | `email_address` (nível raiz) ✅ |
| `Phone` | `{{ed - phone_number}}` | `phone_number` (nível raiz) ✅ |
| `First Name` | `{{ed - first_name}}` | `first_name` (nível raiz) ✅ |
| `Last Name` | `{{ed - last_name}}` | `last_name` (nível raiz) ✅ |
| `City` | `{{ed - city}}` | `city` (nível raiz) ✅ |
| `State` | `{{ed - region}}` | `region` (nível raiz) ✅ |
| `Country` | `{{ed - country}}` | `country` (nível raiz) ✅ |
| `Zip` | `{{ed - postal_code}}` | `postal_code` (nível raiz) ✅ |
| `External ID` | `{{ed - user_id}}` | `user_id` (nível raiz) ✅ |

#### **Event ID:**
| Campo Meta | Variável GTM | Path |
|------------|--------------|------|
| `Event ID` | `{{ed - event_id}}` | `event_id` ✅ |

---

## ⚠️ **NOTA SOBRE content_name e content_type**

Esses campos podem não chegar no GTM Server-Side (Stape.io pode estar filtrando).

**Se as variáveis retornarem `undefined`:**
- Usar valores fixos nas tags (não ideal, mas funciona)
- Ou investigar configuração do Stape.io

---

## ✅ **RESUMO**

**Use SEMPRE as variáveis do NÍVEL RAIZ:**
- ✅ `{{ed - currency}}` (não `{{ed - ecommerce.currency}}`)
- ✅ `{{ed - value}}` (não `{{ed - ecommerce.value}}`)
- ✅ `{{ed - email_address}}` (não `{{ed - user_data.email_address}}`)
- ✅ `{{ed - first_name}}` (não `{{ed - user_data.first_name}}`)
- ✅ `{{ed - city}}` (não `{{ed - user_data.city}}`)

**Por quê?**
- Os dados chegam no nível raiz ✅
- As variáveis do nível raiz funcionam ✅
- As variáveis nested (`ecommerce.*`, `user_data.*`) retornam `undefined` ❌

---

**Status:** ✅ **TODAS AS VARIÁVEIS CRIADAS - AGORA SÓ MAPEAR NAS TAGS**

