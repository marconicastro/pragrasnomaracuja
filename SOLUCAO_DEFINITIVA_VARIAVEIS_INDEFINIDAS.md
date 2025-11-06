# ✅ SOLUÇÃO DEFINITIVA: Variáveis Indefinidas

## 🚨 **PROBLEMA IDENTIFICADO**

Analisando os arquivos JSON reais do GTM Server-Side:

### **Situação Atual:**

**GTM Server-Side tem variáveis Event Data para eventos do browser:**
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address` (SEM `0.`)
- `{{ed - ecommerce.value}}` → Path: `ecommerce.value` (SEM `0.`)
- `{{ed - content_name}}` → Path: `content_name` (nível raiz) ✅
- `{{ed - content_type}}` → Path: `content_type` (nível raiz) ✅

**Código envia:**
- ✅ Campos no nível raiz: `email_address`, `value`, `currency`, `content_name`, etc.
- ✅ Campos também dentro de `user_data`: `user_data.email_address`, etc.
- ✅ Campos também dentro de `ecommerce`: `ecommerce.value`, etc.

**Resultado:**
- `content_name` e `content_type` funcionam (nível raiz) ✅
- `user_data.email_address` retorna `undefined` ❌
- `ecommerce.value` retorna `undefined` ❌

---

## 🔍 **CAUSA RAIZ**

### **Hipótese 1: Eventos do Browser também precisam de `0.`**

Se os eventos do browser também estão sendo processados como array pelo GTM Server-Side, as variáveis precisam usar `0.`:

**Variáveis atuais:**
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address`

**Variáveis corretas (se precisar de `0.`):**
- `{{ed - user_data.email_address}}` → Path: `0.user_data.email_address`

### **Hipótese 2: Variáveis precisam acessar nível raiz**

Se os eventos do browser NÃO precisam de `0.`, mas as variáveis estão configuradas para acessar `user_data.email_address` quando o campo está no nível raiz:

**Variáveis atuais:**
- `{{ed - user_data.email_address}}` → Path: `user_data.email_address` (não encontra se estiver no nível raiz)

**Variáveis corretas:**
- `{{ed - email_address}}` → Path: `email_address` (nível raiz)

---

## ✅ **SOLUÇÃO: Criar Variáveis no Nível Raiz**

### **Variáveis que FALTAM no GTM Server-Side:**

#### **1. User Data - Nível Raiz (8 variáveis):**
| # | Variável | Path | Tipo |
|---|----------|------|------|
| 1 | `{{ed - email_address}}` | `email_address` | Texto |
| 2 | `{{ed - phone_number}}` | `phone_number` | Texto |
| 3 | `{{ed - first_name}}` | `first_name` | Texto |
| 4 | `{{ed - last_name}}` | `last_name` | Texto |
| 5 | `{{ed - city}}` | `city` | Texto |
| 6 | `{{ed - region}}` | `region` | Texto |
| 7 | `{{ed - postal_code}}` | `postal_code` | Texto |
| 8 | `{{ed - country}}` | `country` | Texto |

#### **2. Ecommerce - Nível Raiz (2 variáveis):**
| # | Variável | Path | Tipo |
|---|----------|------|------|
| 9 | `{{ed - value}}` | `value` | Número |
| 10 | `{{ed - currency}}` | `currency` | Texto |

---

## 🔧 **COMO CRIAR NO GTM SERVER-SIDE**

### **Exemplo: Criar `{{ed - email_address}}`**

```
Nome da variável: ed - email_address
Tipo de variável: Event Data
Nome do campo de evento: email_address
Tipo de valor: Texto
Valor padrão: (deixar vazio)
```

**⚠️ IMPORTANTE:** 
- **NÃO usar prefixo `0.`** (isso é só para Purchase via webhook)
- Usar **exatamente** o path do nível raiz: `email_address`

---

## 📋 **MAPEAMENTO NAS TAGS FACEBOOK**

### **Tag "FB - ViewContent":**

**User Data:**
- `email_address` → `{{ed - email_address}}` (nível raiz) ⚠️ **USAR ESTA**
- `phone_number` → `{{ed - phone_number}}` (nível raiz) ⚠️ **USAR ESTA**
- `first_name` → `{{ed - first_name}}` (nível raiz) ⚠️ **USAR ESTA**
- `last_name` → `{{ed - last_name}}` (nível raiz) ⚠️ **USAR ESTA**
- `city` → `{{ed - city}}` (nível raiz) ⚠️ **USAR ESTA**
- `region` → `{{ed - region}}` (nível raiz) ⚠️ **USAR ESTA**
- `postal_code` → `{{ed - postal_code}}` (nível raiz) ⚠️ **USAR ESTA**
- `country` → `{{ed - country}}` (nível raiz) ⚠️ **USAR ESTA**

**Custom Data:**
- `value` → `{{ed - value}}` (nível raiz) ⚠️ **USAR ESTA**
- `currency` → `{{ed - currency}}` (nível raiz) ⚠️ **USAR ESTA**
- `content_name` → `{{ed - content_name}}` (nível raiz) ✅ **JÁ FUNCIONA**
- `content_type` → `{{ed - content_type}}` (nível raiz) ✅ **JÁ FUNCIONA**
- `content_ids` → `{{ed - content_ids}}` (nível raiz) ✅ **JÁ FUNCIONA**
- `contents` → `{{ed - contents}}` (nível raiz) ✅ **JÁ FUNCIONA**
- `num_items` → `{{ed - num_items}}` (nível raiz) ✅ **JÁ FUNCIONA**

---

## ✅ **CHECKLIST COMPLETO**

### **Fase 1: Criar Variáveis no Nível Raiz (10 variáveis)**
- [ ] `{{ed - email_address}}` → Path: `email_address`
- [ ] `{{ed - phone_number}}` → Path: `phone_number`
- [ ] `{{ed - first_name}}` → Path: `first_name`
- [ ] `{{ed - last_name}}` → Path: `last_name`
- [ ] `{{ed - city}}` → Path: `city`
- [ ] `{{ed - region}}` → Path: `region`
- [ ] `{{ed - postal_code}}` → Path: `postal_code`
- [ ] `{{ed - country}}` → Path: `country`
- [ ] `{{ed - value}}` → Path: `value`
- [ ] `{{ed - currency}}` → Path: `currency`

### **Fase 2: Atualizar Tags Facebook**
- [ ] Tag "FB - ViewContent" → User Data → Usar variáveis nível raiz
- [ ] Tag "FB - AddToCart" → User Data → Usar variáveis nível raiz
- [ ] Tag "FB - InitiateCheckout" → User Data → Usar variáveis nível raiz
- [ ] Tag "FB - Lead" → User Data → Usar variáveis nível raiz
- [ ] Tag "FB - PageView" → User Data → Usar variáveis nível raiz

---

## 🎯 **RESUMO**

**Problema:** Variáveis Event Data estão configuradas para acessar `user_data.email_address`, mas o código envia `email_address` no nível raiz.

**Solução:** Criar variáveis Event Data no nível raiz:
- `{{ed - email_address}}` → Path: `email_address`
- `{{ed - value}}` → Path: `value`
- `{{ed - currency}}` → Path: `currency`

**Total:** 10 variáveis a criar

**Por quê funciona:** O código envia campos no nível raiz E dentro de `user_data`/`ecommerce`. Usar variáveis no nível raiz garante que funcionem independente da estrutura.

---

**Última atualização**: 2025-01-05  
**Versão**: 1.0  
**Status**: ✅ SOLUÇÃO DEFINITIVA - PRONTO PARA IMPLEMENTAR

